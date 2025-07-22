export const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:8000/api',
  ENDPOINTS: {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    USER: '/user',
    SURVEYS: '/surveys',
    QUESTIONS : '/questions',
    RESPONSES: '/responses',

  },
  TIMEOUT: 10000, 
}

export const AUTH_CONFIG = {
  TOKEN_KEY: 'access_token',
  USER_KEY: 'user_data',
  TOKEN_PREFIX: 'Bearer',
}
