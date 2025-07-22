import { API_CONFIG, AUTH_CONFIG } from '../config/api'

// Función para hacer requests HTTP
const makeRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    return {
      success: response.ok,
      data,
      status: response.status,
    }
  } catch (error) {
    console.error('Request failed:', error)
    return {
      success: false,
      error: 'Error de conexión. Inténtalo de nuevo.',
      status: 0,
    }
  }
}

// Función para login
export const loginUser = async (credentials) => {
  const { email, password } = credentials

  const result = await makeRequest(API_CONFIG.ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  if (result.success && result.data.success) {
    return {
      success: true,
      data: {
        user: result.data.user,
        token: result.data.access_token,
        tokenType: result.data.token_type,
      },
    }
  }

  return {
    success: false,
    error: result.data?.message || result.error || 'Error en el login',
  }
}

// Función para registro
export const registerUser = async (userData) => {
  const { name, email, password } = userData

  const result = await makeRequest(API_CONFIG.ENDPOINTS.REGISTER, {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })

  if (result.success && result.data.access_token) {
    return {
      success: true,
      data: {
        user: result.data.user,
        token: result.data.access_token,
        tokenType: result.data.token_type,
      },
    }
  }

  return {
    success: false,
    error: result.data?.message || result.error || 'Error en el registro',
  }
}

// Función para hacer requests autenticados
export const authenticatedRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY)
  
  if (!token) {
    throw new Error('No hay token de autenticación')
  }

  return makeRequest(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `${AUTH_CONFIG.TOKEN_PREFIX} ${token}`,
    },
  })
}

// Función para logout
export const logoutUser = async () => {
  try {
    await authenticatedRequest(API_CONFIG.ENDPOINTS.LOGOUT, {
      method: 'POST',
    })
  } catch (error) {
    console.error('Error during logout:', error)
  }
}

// Función para verificar el token
export const verifyToken = async () => {
  try {
    const result = await authenticatedRequest(API_CONFIG.ENDPOINTS.USER)
    return {
      success: result.success,
      user: result.data,
    }
  } catch (error) {
    return {
      success: false,
      error: 'Token inválido' + (error.message ? `: ${error.message}` : ''),
    }
  }
}
