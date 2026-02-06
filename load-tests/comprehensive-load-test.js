import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'],
    'http_req_failed': ['rate<0.01'],
  },
};

const BASE_URL = 'http://localhost:8000/api';

export default function () {
  const loginRes = http.post(
    `${BASE_URL}/auth/login/`,
    JSON.stringify({
      email: 'test@example.com',
      password: 'test123'
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  
  check(loginRes, {
    'login status 200': (r) => r.status === 200,
  });
  
  sleep(1);
}
