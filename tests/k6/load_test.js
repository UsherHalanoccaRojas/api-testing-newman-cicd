import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 20 }, // Rampa de subida a 20 usuarios virtuales
    { duration: '20s', target: 20 }, // Carga sostenida
    { duration: '10s', target: 0 },  // Rampa de bajada
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'], // 95% de las peticiones deben responder en menos de 300ms
    http_req_failed: ['rate<0.01'],    // Menos del 1% de fallos
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Test 1: Health check
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, {
    'health status is 200': (r) => r.status === 200,
  });

  // Test 2: List tasks
  const tasksRes = http.get(`${BASE_URL}/api/tasks`);
  check(tasksRes, {
    'tasks status is 200': (r) => r.status === 200,
    'tasks response has data': (r) => JSON.parse(r.body).data.length >= 0,
  });

  sleep(1);
}

