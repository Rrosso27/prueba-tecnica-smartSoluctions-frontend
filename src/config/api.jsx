// Configuración de la API
export const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:8000/api',
  ENDPOINTS: {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    USER: '/user',
  },
  TIMEOUT: 10000, // 10 segundos
}

// Configuración de autenticación
export const AUTH_CONFIG = {
  TOKEN_KEY: 'access_token',
  USER_KEY: 'user_data',
  TOKEN_PREFIX: 'Bearer',
}
