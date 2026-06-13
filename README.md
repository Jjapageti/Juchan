# 주찬양 QR 보물찾기

서버/DB 없이 GitHub Pages에서 실행 가능한 교회 QR 보물찾기 웹앱입니다.

## 핵심 방식
- QR 코드는 모두 같은 주소를 사용합니다.
- 참가자는 QR을 스캔하면 랜덤 미션 1개를 받습니다.
- 정답을 맞히거나 사진 미션을 통과하면 `다음 QR을 찾아 스캔하세요` 화면이 나옵니다.
- 다시 같은 QR 주소로 접속하면 아직 풀지 않은 문제 중 하나가 랜덤으로 나옵니다.
- 5개 성공 시 완료 화면이 표시됩니다.

## 실행 방법
```bash
py -m http.server 8000
```
브라우저에서 `http://localhost:8000` 접속.

## 배포 방법
GitHub Pages에 전체 파일을 올리고 생성된 주소로 QR 하나를 만든 뒤 여러 장 출력하세요.

## Teachable Machine 모델
모델 파일을 아래 폴더에 넣으세요.
- model/people3/model.json, metadata.json, weights.bin
- model/hat/model.json, metadata.json, weights.bin
- model/heart/model.json, metadata.json, weights.bin

모델이 없으면 사진 업로드만으로 임시 성공 처리됩니다.
