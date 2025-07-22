import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Encuestas from '../components/Encuestas'
import { getAllSurveys } from '../services/surveys'
export default function Inicio() {
  const { user } = useAuth()
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setLoading(true)
        const result = await getAllSurveys()


        if (result.success) {
          // ✅ Ahora surveys será directamente el array
          setSurveys(result.data || [])
        } else {
          setError(result.error || 'Error al cargar las encuestas')
          setSurveys([])
        }
      } catch (err) {
        console.error('Error fetching surveys:', err)
        setError('Error inesperado al cargar las encuestas')
        setSurveys([])
      } finally {
        setLoading(false)
      }
    }

    fetchSurveys()
  }, [])

  return (
    <div className="w-full space-y-8">
      {/* Header de bienvenida */}
      <div className="flex flex-col items-center justify-center w-full min-h-48">
        <h1 className="mb-4 text-4xl font-bold text-gray-800">
          ¡Bienvenido, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Aquí puedes ver y realizar las encuestas disponibles
        </p>
      </div>

      {/* Información del usuario */}
      <div className="w-full max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-center">Información del Usuario</h2>
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
          <div className="p-4 text-center rounded-lg bg-gray-50">
            <p className="font-semibold text-gray-800">ID:</p>
            <p className="text-gray-600">{user?.id || 'N/A'}</p>
          </div>
          <div className="p-4 text-center rounded-lg bg-gray-50">
            <p className="font-semibold text-gray-800">Email:</p>
            <p className="text-gray-600">{user?.email || 'N/A'}</p>
          </div>
          <div className="p-4 text-center rounded-lg bg-gray-50">
            <p className="font-semibold text-gray-800">Registrado:</p>
            <p className="text-gray-600">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Sección de encuestas */}
      <div className="w-full max-w-4xl mx-auto">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Encuestas Disponibles
        </h2>

        {/* Estados de carga, error y datos */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Cargando encuestas...</span>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <div className="p-6 border border-red-200 rounded-lg bg-red-50">
              <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="mb-2 text-lg font-semibold text-red-800">Error al cargar encuestas</h3>
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 mt-4 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : Array.isArray(surveys.data) && surveys.data.length > 0 ? (
          <div className="space-y-6">
            {surveys.data.map((survey) => (
              <Encuestas  key={survey.id || Math.random()} survey={survey} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">No hay encuestas disponibles</h3>
              <p className="text-gray-600">No se encontraron encuestas para mostrar en este momento.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}