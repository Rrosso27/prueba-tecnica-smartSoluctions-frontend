import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getQuestionsBySurveyId } from '../services/questions'
import { submitSurveyResponses } from '../services/responses'
import TextQuestion from '../components/questions/TextQuestion'
import SingleQuestion from '../components/questions/SingleQuestion'
import MultipleQuestion from '../components/questions/MultipleQuestion'
import ScaleQuestion from '../components/questions/ScaleQuestion'
import BooleanQuestion from '../components/questions/BooleanQuestion'
import { useNavigate } from 'react-router-dom'

export default function PreguntasEncuestas() {
  const { id } = useParams()
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [responseSubmitted, setResponseSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        const result = await getQuestionsBySurveyId(id)

        if (result.success) {
          setQuestions(result.data.data.data || [])
        } else {
          setError(result.error || 'Error al cargar las preguntas')
        }
      } catch (err) {
        console.error('Error fetching questions:', err)
        setError('Error inesperado al cargar las preguntas')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchQuestions()
    }
  }, [id])

  useEffect(() => {
    if (responseSubmitted) {
      const timer = setTimeout(() => {
        setResponseSubmitted(false)
        navigate('/')

      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [responseSubmitted])

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      setError('')

      if (Object.keys(answers).length === 0) {
        setError('No hay respuestas para enviar')
        return
      }

      if (Object.keys(answers).length !== questions.length) {
        setError('Por favor responde todas las preguntas')
        return
      }


      const formattedData = {
        survey_id: parseInt(id),
        responses: Object.entries(answers).map(([questionId, answer]) => ({
          question_id: parseInt(questionId),
          answer: Array.isArray(answer) ? answer.join(', ') : String(answer)
        }))
      }


      const response = await submitSurveyResponses(formattedData)


      if (response.success) {
        console.log(' Respuestas enviadas exitosamente')
        setResponseSubmitted(true)
        setAnswers({})
        setError('')
      } else {
        console.error(' Error del servidor:', response.error)
        setError(response.error || 'Error al enviar las respuestas')
      }
    } catch (err) {
      console.error(' Error inesperado:', err)
      setError('Error inesperado al enviar la encuesta: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const renderQuestion = (question) => {
    const questionProps = {
      question,
      onAnswerChange: handleAnswerChange
    }

    switch (question.question_type) {
      case 'text':
        return <TextQuestion key={question.id} {...questionProps} />
      case 'single':
        return <SingleQuestion key={question.id} {...questionProps} />
      case 'multiple':
        return <MultipleQuestion key={question.id} {...questionProps} />
      case 'scale':
        return <ScaleQuestion key={question.id} {...questionProps} />
      case 'boolean':
        return <BooleanQuestion key={question.id} {...questionProps} />
      default:
        return (
          <div key={question.id} className="p-4 mb-4 bg-gray-100 rounded-lg">
            <p className="text-gray-600">Tipo de pregunta no soportado: {question.question_type}</p>
          </div>
        )
    }
  }

  // ✅ Estados de la UI
  if (responseSubmitted) {
    return (
      <div className="py-12 text-center">
        <div className="p-6 border border-green-200 rounded-lg bg-green-50">
          <svg className="w-12 h-12 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <h3 className="mb-2 text-lg font-semibold text-green-800">¡Encuesta enviada con éxito!</h3>
          <p className="text-green-600">Gracias por tus respuestas</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Cargando preguntas...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="p-6 border border-red-200 rounded-lg bg-red-50">
          <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mb-2 text-lg font-semibold text-red-800">Error al cargar preguntas</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl p-4 mx-auto">
      <div className="mb-8">

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-800">
              Encuesta #{id}
            </h1>
            <p className="text-gray-600">
              Responde todas las preguntas y envía tu encuesta
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center px-4 py-2 space-x-2 font-medium text-gray-600 hover:text-gray-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Volver</span>
          </button>
        </div>


      </div>




      {/* Progreso */}
      <div className="mb-8">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 transition-all bg-blue-600 rounded-full"
            style={{
              width: `${(Object.keys(answers).length / questions.length) * 100}%`
            }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Progreso: {Object.keys(answers).length} de {questions.length} preguntas respondidas
        </p>
      </div>

      {/* Preguntas */}
      <div className="space-y-6">
        {questions.map(question => renderQuestion(question))}
      </div>

      {/* Botón de envío */}
      {questions.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== questions.length || submitting}
            className={`px-8 py-3 rounded-lg font-semibold transition-all flex items-center ${Object.keys(answers).length === questions.length && !submitting
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                Enviando...
              </>
            ) : (
              'Enviar Encuesta'
            )}
          </button>
        </div>
      )}


    </div>
  )
}