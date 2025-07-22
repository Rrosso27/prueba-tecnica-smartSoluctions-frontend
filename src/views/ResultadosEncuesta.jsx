import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMyResponses } from '../services/responses'
import ResponseCard from '../components/ResponseCard'

export default function ResultadosEncuesta() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [groupedResponses, setGroupedResponses] = useState({})
  const [surveyInfo, setSurveyInfo] = useState(null)
  const [viewMode, setViewMode] = useState('grouped') // 'grouped' o 'chronological'

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true)
        const result = await getMyResponses(id)
        console.log('Fetched responses:', result)
        if (result.success) {
          // Filtrar respuestas por survey_id
        
          
          setResponses(result.data.data || [])
          
          // Extraer información de la encuesta
          if (result.data.data.length > 0) {
            setSurveyInfo({
              id: result.data.data[0].survey_id,
              title: `Encuesta #${result.data.data[0].survey_id}`
            })
          }
          
          // Agrupar respuestas por pregunta
          const grouped = groupResponsesByQuestion(result.data.data)
          setGroupedResponses(grouped)
          
        } else {
          setError(result.error || 'Error al cargar las respuestas')
        }
      } catch (err) {
        console.error('Error fetching responses:', err)
        setError('Error inesperado al cargar las respuestas')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchResponses()
    }
  }, [id])

  const groupResponsesByQuestion = (responses) => {
    return responses.reduce((acc, response) => {
      if (!acc[response.question_id]) {
        acc[response.question_id] = {
          question_text: response.question_text,
          responses: []
        }
      }
      acc[response.question_id].responses.push(response)
      return acc
    }, {})
  }

  const getLatestResponsePerQuestion = () => {
    const latest = {}
    responses.forEach(response => {
      if (!latest[response.question_id] || 
          new Date(response.created_at) > new Date(latest[response.question_id].created_at)) {
        latest[response.question_id] = response
      }
    })
    return Object.values(latest).sort((a, b) => a.question_id - b.question_id)
  }

  const getSurveyStats = () => {
    const totalSubmissions = new Set(responses.map(r => r.created_at)).size
    const totalQuestions = Object.keys(groupedResponses).length
    const firstSubmission = responses.length > 0 ? 
      new Date(Math.min(...responses.map(r => new Date(r.created_at)))) : null
    const lastSubmission = responses.length > 0 ? 
      new Date(Math.max(...responses.map(r => new Date(r.created_at)))) : null

    return {
      totalSubmissions,
      totalQuestions,
      firstSubmission,
      lastSubmission
    }
  }

  const stats = getSurveyStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Cargando resultados...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="max-w-md p-6 mx-auto border border-red-200 rounded-lg bg-red-50">
          <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mb-2 text-lg font-semibold text-red-800">Error al cargar resultados</h3>
          <p className="mb-4 text-red-600">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Volver a encuestas
          </button>
        </div>
      </div>
    )
  }

  if (responses.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="max-w-md p-6 mx-auto border border-gray-200 rounded-lg bg-gray-50">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mb-2 text-lg font-semibold text-gray-800">No hay respuestas</h3>
          <p className="mb-4 text-gray-600">Aún no has respondido esta encuesta</p>
          <button 
            onClick={() => navigate(`/preguntas-encuestas/${id}`)}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Responder encuesta
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl p-4 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-800">
              Mis Respuestas - {surveyInfo?.title}
            </h1>
            <p className="text-gray-600">
              Revisa todas tus respuestas a esta encuesta
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

        {/* Estadísticas */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div className="text-2xl font-bold text-blue-600">{stats.totalSubmissions}</div>
            <div className="text-sm text-blue-800">Envíos totales</div>
          </div>
          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <div className="text-2xl font-bold text-green-600">{stats.totalQuestions}</div>
            <div className="text-sm text-green-800">Preguntas respondidas</div>
          </div>
          <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
            <div className="text-sm font-bold text-purple-600">
              {stats.firstSubmission?.toLocaleDateString('es-ES')}
            </div>
            <div className="text-sm text-purple-800">Primera respuesta</div>
          </div>
          <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
            <div className="text-sm font-bold text-orange-600">
              {stats.lastSubmission?.toLocaleDateString('es-ES')}
            </div>
            <div className="text-sm text-orange-800">Última respuesta</div>
          </div>
        </div>

        {/* Controles de vista */}
        <div className="flex mb-6 space-x-2">
          <button
            onClick={() => setViewMode('grouped')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'grouped' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Por pregunta
          </button>
          <button
            onClick={() => setViewMode('chronological')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'chronological' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Más recientes
          </button>
        </div>
      </div>

      {/* Contenido */}
      {viewMode === 'grouped' ? (
        <div className="space-y-8">
          {Object.entries(groupedResponses).map(([questionId, questionData]) => (
            <div key={questionId} className="p-6 bg-white rounded-lg shadow-lg">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                {questionData.question_text}
              </h2>
              <div className="mb-4 text-sm text-gray-500">
                {questionData.responses.length} respuesta(s)
              </div>
              <div className="space-y-4">
                {questionData.responses
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .map((response, index) => (
                    <ResponseCard 
                      key={response.id} 
                      response={response} 
                      isLatest={index === 0}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {getLatestResponsePerQuestion().map((response) => (
            <ResponseCard 
              key={response.id} 
              response={response} 
              isLatest={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}