export async function loadQuestions() {
  const modules = await Promise.all(Array.from({ length: 10 }, (_, index) => import(`../questions/question${index + 1}.js`)));
  return modules.map(module => module.default);
}
