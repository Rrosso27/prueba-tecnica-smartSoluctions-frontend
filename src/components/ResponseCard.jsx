import { useState } from 'react'

export default function ResponseCard({ response, isLatest = false }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getAnswerType = (answer) => {
    if (answer.includes(',')) return 'multiple'
    if (['Sí', 'No', 'Yes', 'No'].includes(answer)) return 'boolean'
    if (['1', '2', '3', '4', '5'].includes(answer)) return 'scale'
    if (answer.length > 50) return 'text'
    return 'single'
  }

  const getAnswerBadgeColor = (type) => {
    switch (type) {
      case 'multiple': return 'bg-purple-100 text-purple-800'
      case 'boolean': return 'bg-red-100 text-red-800'
      case 'scale': return 'bg-orange-100 text-orange-800'
      case 'text': return 'bg-blue-100 text-blue-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  const answerType = getAnswerType(response.answer)

  return (
    <div className={`bg-white rounded-lg shadow-md border-l-4 transition-all hover:shadow-lg ${
      isLatest ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
    }`}>
      <div className="p-6">
        {/* Header con badges */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAnswerBadgeColor(answerType)}`}>
              {answerType === 'multiple' ? 'Múltiple' : 
               answerType === 'boolean' ? 'Sí/No' :
               answerType === 'scale' ? 'Escala' :
               answerType === 'text' ? 'Texto' : 'Única'}
            </span>
            {isLatest && (
              <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-200 rounded-full">
                Más reciente
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500">
            ID: {response.id}
          </div>
        </div>

        {/* Pregunta */}
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {response.question_text}
        </h3>

        {/* Respuesta */}
        <div className="mb-4">
          <div className="p-4 bg-gray-50 rounded-lg border">
            {answerType === 'text' && response.answer.length > 100 ? (
              <div>
                <p className="text-gray-700">
                  {isExpanded ? response.answer : `${response.answer.substring(0, 100)}...`}
                </p>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {isExpanded ? 'Ver menos' : 'Ver más'}
                </button>
              </div>
            ) : answerType === 'multiple' ? (
              <div className="flex flex-wrap gap-2">
                {response.answer.split(', ').map((item, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : answerType === 'scale' ? (
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-orange-600">
                  {response.answer}
                </span>
                <span className="text-gray-500">/ 5</span>
                <div className="flex space-x-1 ml-4">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div
                      key={num}
                      className={`w-3 h-3 rounded-full ${
                        num <= parseInt(response.answer) ? 'bg-orange-400' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : answerType === 'boolean' ? (
              <div className="flex items-center space-x-2">
                <span className={`text-2xl ${
                  response.answer === 'Sí' || response.answer === 'Yes' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {response.answer === 'Sí' || response.answer === 'Yes' ? '✓' : '✗'}
                </span>
                <span className="text-lg font-medium text-gray-700">
                  {response.answer}
                </span>
              </div>
            ) : (
              <p className="text-gray-700 font-medium">
                {response.answer}
              </p>
            )}
          </div>
        </div>

        {/* Footer con fecha */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Respondido el {formatDate(response.created_at)}
          </span>
          {response.created_at !== response.updated_at && (
            <span className="text-yellow-600">
              Editado el {formatDate(response.updated_at)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}