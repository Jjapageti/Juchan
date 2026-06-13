const loadedModels = new Map();
async function modelExists(modelUrl) { try { const response = await fetch(modelUrl, { method: 'HEAD' }); return response.ok; } catch { return false; } }
async function loadTeachableModel(modelBasePath) {
  if (!window.tmImage) throw new Error('Teachable Machine 라이브러리를 불러오지 못했습니다.');
  if (loadedModels.has(modelBasePath)) return loadedModels.get(modelBasePath);
  const modelUrl = `${modelBasePath}/model.json`; const metadataUrl = `${modelBasePath}/metadata.json`;
  const exists = await modelExists(modelUrl); if (!exists) return null;
  const model = await window.tmImage.load(modelUrl, metadataUrl); loadedModels.set(modelBasePath, model); return model;
}
function createImageFromFile(file) { return new Promise((resolve, reject) => { const url = URL.createObjectURL(file); const image = new Image(); image.onload = () => resolve({ image, url }); image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('이미지를 읽을 수 없습니다.')); }; image.src = url; }); }
export async function checkImageMission(file, mission) {
  if (!file) return { success: false, message: '사진을 먼저 업로드하세요.' };
  const photoCheck = mission.photoCheck;
  if (!photoCheck || photoCheck.mode === 'upload-only') return { success: true, message: '사진 업로드가 확인되었습니다.' };
  if (photoCheck.mode !== 'teachable-machine') return { success: false, message: '알 수 없는 사진 미션 방식입니다.' };
  const { image, url } = await createImageFromFile(file);
  try {
    const model = await loadTeachableModel(photoCheck.modelPath);
    if (!model) return { success: true, message: '아직 ML 모델 파일이 없어 임시로 성공 처리했습니다.\n' + `${photoCheck.modelPath} 폴더에 model.json, metadata.json, weights.bin 파일을 넣으면 자동 판별됩니다.` };
    const predictions = await model.predict(image);
    const target = predictions.find(prediction => prediction.className === photoCheck.successLabel);
    const probability = target ? target.probability : 0;
    const threshold = photoCheck.threshold ?? 0.8;
    const detail = predictions.map(prediction => `${prediction.className}: ${(prediction.probability * 100).toFixed(1)}%`).join('\n');
    return { success: probability >= threshold, message: `${detail}\n\n성공 기준: ${photoCheck.successLabel} ${(threshold * 100).toFixed(0)}% 이상` };
  } finally { URL.revokeObjectURL(url); }
}
