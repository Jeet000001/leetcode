import axios from "axios";

export function getJudge0LanguageId(language: string): number | undefined {
  const languageMap: Record<string, number> = {
    PYTHON: 71,
    JAVASCRIPT: 63,
    JAVA: 62,
    CPP: 54,
    GO: 60,
  };

  return languageMap[language.toUpperCase()];
}

export async function submitBatch(submissions: any) {
  const { data } = await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
    { submissions },
    {
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
        }
    }
  );
  console.log('Batch submission response:', data);
  return data; 
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


export async function pollBatchResults(tokens) {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_API_URL}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
        }
      }
    );

    console.log(data);
    const results = data.submissions;

    const isAllDone = results.every(
      (r) => r.status.id !== 1 && r.status.id !== 2
    );
    if (isAllDone) return results;

    await sleep(1000);
  }
}