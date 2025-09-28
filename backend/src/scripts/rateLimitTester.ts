// backend/src/rateLimitTester.ts

type TestResult = {
  id: number;
  status: number | string;
  body?: { error: string };
  error?: unknown;
};

const API_URL = "http://localhost:3005/api";
const REQUESTS_TO_SEND = 5;

async function runTest() {
  console.log(
    `Iniciando teste de rate limit com ${REQUESTS_TO_SEND} requisições...`
  );

  const requests: Promise<TestResult>[] = [];

  for (let i = 1; i <= REQUESTS_TO_SEND; i++) {
    const requestPromise = fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptIdea: `Teste ${i}` }),
    })
      .then(async (response) => {
        if (response.ok) {
          return { status: response.status, id: i };
        }
        const errorBody = await response.json();
        return { status: response.status, body: errorBody, id: i };
      })
      .catch((error) => {
        return { status: "FETCH_ERROR", error, id: i };
      });

    requests.push(requestPromise);
  }

  const results: TestResult[] = await Promise.all(requests);

  console.log("\n--- Resultados do Teste ---");
  results.forEach((result) => {
    console.log(`Requisição #${result.id}: Status ${result.status}`);
    if (result.body) {
      console.log(`   Resposta: ${JSON.stringify(result.body)}`);
    }
  });
  console.log("--------------------------\n");
}

runTest();
