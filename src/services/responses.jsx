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

// GET /responses/my - Obtener respuestas del usuario autenticado
export const getMyResponses = async (id) => {
  const result = await makeRequest(`${API_CONFIG.ENDPOINTS.RESPONSES}/my/${id}`, {
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
      error: result.error || 'Error al obtener tus respuestas.',
    };
  }
};

// GET /responses/debug-auth - Debug de autenticación
export const debugAuth = async () => {
  const result = await makeRequest(`${API_CONFIG.ENDPOINTS.RESPONSES}/debug-auth`, {
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
      error: result.error || 'Error en debug de autenticación.',
    };
  }
};

// GET /responses/{id} - Obtener una respuesta específica
export const getResponseById = async (id) => {
  const result = await makeRequest(`${API_CONFIG.ENDPOINTS.RESPONSES}/${id}`, {
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
      error: result.error || 'Error al obtener la respuesta.',
    };
  }
};

// POST /responses - Crear/Enviar nuevas respuestas
export const submitSurveyResponses = async (responseData) => {
  const result = await makeRequest(API_CONFIG.ENDPOINTS.RESPONSES, {
    method: 'POST',
    headers: {
      Authorization: `${AUTH_CONFIG.TOKEN_PREFIX} ${localStorage.getItem(AUTH_CONFIG.TOKEN_KEY)}`,
    },
    body: JSON.stringify(responseData),
  });

  if (result.success) {
    return {
      success: true,
      data: result.data,
      message: 'Respuestas enviadas exitosamente.',
    };
  } else {
    return {
      success: false,
      error: result.error || 'Error al enviar las respuestas.',
    };
  }
};

// PUT /responses/{id} - Actualizar una respuesta existente
export const updateResponse = async (id, responseData) => {
  const result = await makeRequest(`${API_CONFIG.ENDPOINTS.RESPONSES}/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `${AUTH_CONFIG.TOKEN_PREFIX} ${localStorage.getItem(AUTH_CONFIG.TOKEN_KEY)}`,
    },
    body: JSON.stringify(responseData),
  });

  if (result.success) {
    return {
      success: true,
      data: result.data,
      message: 'Respuesta actualizada exitosamente.',
    };
  } else {
    return {
      success: false,
      error: result.error || 'Error al actualizar la respuesta.',
    };
  }
};

// DELETE /responses/{id} - Eliminar una respuesta
export const deleteResponse = async (id) => {
  const result = await makeRequest(`${API_CONFIG.ENDPOINTS.RESPONSES}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `${AUTH_CONFIG.TOKEN_PREFIX} ${localStorage.getItem(AUTH_CONFIG.TOKEN_KEY)}`,
    },
  });

  if (result.success) {
    return {
      success: true,
      message: 'Respuesta eliminada exitosamente.',
    };
  } else {
    return {
      success: false,
      error: result.error || 'Error al eliminar la respuesta.',
    };
  }
};

// Función auxiliar para formatear respuestas antes de enviar
export const formatSurveyResponses = (answers, surveyId) => {
  // Convertir el objeto de respuestas en el formato esperado por el backend
  const responses = Object.entries(answers).map(([questionId, answer]) => ({
    question_id: parseInt(questionId),
    answer: Array.isArray(answer) ? answer.join(', ') : answer.toString(),
  }));

  return {
    survey_id: parseInt(surveyId),
    responses: responses,
  };
};

// Función de conveniencia para enviar respuestas de encuesta
export const submitSurvey = async (answers, surveyId) => {
  try {
    // Validar que hay respuestas
    if (!answers || Object.keys(answers).length === 0) {
      return {
        success: false,
        error: 'No hay respuestas para enviar.',
      };
    }

    // Formatear respuestas
    const formattedData = formatSurveyResponses(answers, surveyId);
    
    // Enviar respuestas
    const result = await submitSurveyResponses(formattedData);
    
    return result;
  } catch (error) {
    console.error('Error submitting survey:', error);
    return {
      success: false,
      error: 'Error inesperado al enviar la encuesta.',
    };
  }
};

// Función para validar respuestas antes de enviar
export const validateSurveyResponses = (answers, questions) => {
  const errors = [];
  
  // Verificar que todas las preguntas obligatorias estén respondidas
  questions.forEach(question => {
    if (!answers[question.id]) {
      errors.push(`La pregunta "${question.question_text}" es obligatoria.`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Función auxiliar para hacer requests autenticados
export const authenticatedResponseRequest = async (endpoint, options = {}) => {
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

// Función para verificar si el usuario puede realizar operaciones en respuestas
export const verifyResponsePermissions = () => {
  const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  return !!token;
};

// Función para obtener estadísticas de respuestas del usuario
export const getMyResponsesStats = async () => {
  try {
    const result = await getMyResponses();
    
    if (result.success && result.data) {
      const responses = result.data;
      return {
        success: true,
        stats: {
          total: responses.length,
          completed: responses.filter(r => r.status === 'completed').length,
          pending: responses.filter(r => r.status === 'pending').length,
          surveys: [...new Set(responses.map(r => r.survey_id))].length,
        }
      };
    }
    
    return result;
  } catch (error) {
    return {
      success: false,
      error: 'Error al obtener estadísticas de respuestas.' + error.message,
    };
  }
};