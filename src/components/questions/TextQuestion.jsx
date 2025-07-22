import { useState } from 'react'

export default function TextQuestion({ question, onAnswerChange }) {
  const [answer, setAnswer] = useState('')

  const handleChange = (e) => {
    const value = e.target.value
    setAnswer(value)
    onAnswerChange(question.id, value)
  }

  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <span className="px-2 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded">
          Pregunta de Texto
        </span>
      </div>
      
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        {question.question_text}
      </h3>
      
      <div>
        <textarea
          value={answer}
          onChange={handleChange}
          placeholder="Escribe tu respuesta aquí..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[100px]"
          rows={4}
        />
      </div>
    </div>
  )
}