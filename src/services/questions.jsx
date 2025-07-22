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

// GET /questions - Obtener todas las preguntas
export const getAllQuestions = async () => {
  const result = await makeRequest(API_CONFIG.ENDPOINTS.QUESTIONS, {
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
      error: result.error || 'Error al obtener las preguntas.',
    };
  }
};

// GET /questions/{id} - Obtener una pregunta específica
export const getQuestionById = async (id) => {
  const result = await makeRequest(`${API_CONFIG.ENDPOINTS.QUESTIONS}/${id}`, {
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
      error: result.error || 'Error al obtener la pregunta.',
    };
  }
};

// POST /questions - Crear una nueva pregunta
export const createQuestion = async (questionData) => {
  const result = await makeRequest(API_CONFIG.ENDPOINTS.QUESTIONS, {
    method: 'POST',
    headers: {
      Authorization: `${AUTH_CONFIG.TOKEN_PREFIX} ${localStorage.getItem(AUTH_CONFIG.TOKEN_KEY)}`,
    },
    body: JSON.stringify(questionData),
  });

  if (result.success) {
    return {
      success: true,
      data: result.data,
      message: 'Pregunta creada exitosamente.',
    };
  } else {
    return {
      success: false,
      error: result.error || 'Error al crear la pregunta.',
    };
  }
};

// PUT /questions/{id} - Actualizar una pregunta existente
export const updateQuestion = async (id, questionData) => {
  const result = await makeRequest(`${API_CONFIG.ENDPOINTS.QUESTIONS}/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `${AUTH_CONFIG.TOKEN_PREFIX} ${localStorage.getItem(AUTH_CONFIG.TOKEN_KEY)}`,
    },
    body: JSON.stringify(questionData),
  });

  if (result.success) {
    return {
      success: true,
      data: result.data,
      message: 'Pregunta actualizada exitosamente.',
    };
  } else {
    return {
      success: false,
      error: result.error || 'Error al actualizar la pregunta.',
    };
  }
};

// DELETE /questions/{id} - Eliminar una pregunta
export const deleteQuestion = async (id) => {
  const result = await makeRequest(`${API_CONFIG.ENDPOINTS.QUESTIONS}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `${AUTH_CONFIG.TOKEN_PREFIX} ${localStorage.getItem(AUTH_CONFIG.TOKEN_KEY)}`,
    },
  });

  if (result.success) {
    return {
      success: true,
      message: 'Pregunta eliminada exitosamente.',
    };
  } else {
    return {
      success: false,
      error: result.error || 'Error al eliminar la pregunta.',
    };
  }
};

// GET /questions/survey/{surveyId} - Obtener todas las preguntas de una encuesta específica
export const getQuestionsBySurveyId = async (surveyId) => {
  console.log(`${API_CONFIG.ENDPOINTS.QUESTIONS}/survey/${surveyId}`);
  const result = await makeRequest(`${API_CONFIG.ENDPOINTS.QUESTIONS}/survey/${surveyId}`, {
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
      error: result.error || 'Error al obtener las preguntas de la encuesta.',
    };
  }
};

// Función auxiliar para hacer requests autenticados
export const authenticatedQuestionRequest = async (endpoint, options = {}) => {
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

// Función para verificar si el usuario puede realizar operaciones en preguntas
export const verifyQuestionPermissions = () => {
  const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  return !!token;
};

// Función de conveniencia para obtener preguntas con opciones de respuesta
export const getQuestionsWithOptions = async (surveyId) => {
  try {
    const result = await getQuestionsBySurveyId(surveyId);
    
    if (result.success && result.data) {
      // Si las preguntas incluyen opciones, las devolvemos tal como están
      // Si no, podrías hacer llamadas adicionales para obtener las opciones
      return {
        success: true,
        data: result.data,
      };
    }
    
    return result;
  } catch (error) {
    return {
      success: false,
      error: 'Error al obtener preguntas con opciones.' + error.message,
    };
  }
};

// Función para validar estructura de pregunta antes de enviar
export const validateQuestionData = (questionData) => {
  const errors = [];
  
  if (!questionData.question_text || questionData.question_text.trim() === '') {
    errors.push('El texto de la pregunta es requerido.');
  }
  
  if (!questionData.question_type || questionData.question_type.trim() === '') {
    errors.push('El tipo de pregunta es requerido.');
  }
  
  if (!questionData.survey_id) {
    errors.push('El ID de la encuesta es requerido.');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
