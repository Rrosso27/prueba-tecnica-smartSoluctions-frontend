import { API_CONFIG, AUTH_CONFIG } from "../config/api";

const makeRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    return {
      success: response.ok,
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('Request failed:', error);
    return {
      success: false,
      error: 'Error de conexión. Inténtalo de nuevo.',
      status: 0,
    };
  }
};

// GET /surveys - Obtener todas las encuestas
export const getAllSurveys = async () => {
  const result = await makeRequest(API_CONFIG.ENDPOINTS.SURVEYS, {
    method: 'GET',
    headers: {
      Authorization: `${AUTH_CONFIG.TOKEN_PREFIX} ${localStorage.getItem(AUTH_CONFIG.TOKEN_KEY)}`,
    },
  });

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  } else {
    return {
      success: false,
      error: result.error || 'Error al obtener las encuestas.',
    };
  }
};

// GET /surveys/{id} - Obtener una encuesta específica
export const getSurveyById = async (id) => {
  const result = await makeRequest(`${API_CONFIG.ENDPOINTS.SURVEYS}/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `${AUTH_CONFIG.TOKEN_PREFIX} ${localStorage.getItem(AUTH_CONFIG.TOKEN_KEY)}`,
    },
  });

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  } else {
    return {
      success: false,
      error: result.error || 'Error al obtener la encuesta.',
    };
  }
};

// POST /surveys - Crear una nueva encuesta
export const createSurvey = async (surveyData) => {
  const result = await makeRequest(API_CONFIG.ENDPOINTS.SURVEYS, {
    method: 'POST',
    headers: {
      Authorization: `${AUTH_CONFIG.TOKEN_PREFIX} ${localStorage.getItem(AUTH_CONFIG.TOKEN_KEY)}`,
    },
    body: JSON.stringify(surveyData),
  });

  if (result.success) {
    return {
      success: true,
      data: result.data,
      message: 'Encuesta creada exitosamente.',
    };
  } else {
    return {
      success: false,
      error: result.error || 'Error al crear la encuesta.',
    };
  }
};

// PUT /surveys/{id} - Actualizar una encuesta existente
export const updateSurvey = async (id, surveyData) => {
  const result = await makeRequest(`${API_CONFIG.ENDPOINTS.SURVEYS}/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `${AUTH_CONFIG.TOKEN_PREFIX} ${localStorage.getItem(AUTH_CONFIG.TOKEN_KEY)}`,
    },
    body: JSON.stringify(surveyData),
  });

  if (result.success) {
    return {
      success: true,
      data: result.data,
      message: 'Encuesta actualizada exitosamente.',
    };
  } else {
    return {
      success: false,
      error: result.error || 'Error al actualizar la encuesta.',
    };
  }
};

// DELETE /surveys/{id} - Eliminar una encuesta
export const deleteSurvey = async (id) => {
  const result = await makeRequest(`${API_CONFIG.ENDPOINTS.SURVEYS}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `${AUTH_CONFIG.TOKEN_PREFIX} ${localStorage.getItem(AUTH_CONFIG.TOKEN_KEY)}`,
    },
  });

  if (result.success) {
    return {
      success: true,
      message: 'Encuesta eliminada exitosamente.',
    };
  } else {
    return {
      success: false,
      error: result.error || 'Error al eliminar la encuesta.',
    };
  }
};

// Función auxiliar para hacer requests autenticados
export const authenticatedSurveyRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  
  if (!token) {
    return {
      success: false,
      error: 'No se encontró token de autenticación.',
    };
  }

  return await makeRequest(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `${AUTH_CONFIG.TOKEN_PREFIX} ${token}`,
    },
  });
};

// Función para verificar si el usuario puede realizar operaciones en surveys
export const verifySurveyPermissions = () => {
  const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  return !!token;
};