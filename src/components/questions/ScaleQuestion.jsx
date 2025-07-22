import { useState } from 'react'

export default function ScaleQuestion({ question, onAnswerChange }) {
  const [selectedValue, setSelectedValue] = useState('')

  const handleChange = (value) => {
    setSelectedValue(value)
    onAnswerChange(question.id, value)
  }

  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <span className="px-2 py-1 text-sm font-medium text-orange-600 bg-orange-100 rounded">
          Escala
        </span>
      </div>
      
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        {question.question_text}
      </h3>
      
      <div className="flex items-center justify-between space-x-2">
        {question.options && question.options.map((option, index) => (
          <label 
            key={index} 
            className="flex flex-col items-center cursor-pointer group"
          >
            <input
              type="radio"
              name={`question_${question.id}`}
              value={option}
              checked={selectedValue === option}
              onChange={(e) => handleChange(e.target.value)}
              className="sr-only"
            />
            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold transition-all ${
              selectedValue === option 
                ? 'bg-orange-500 text-white border-orange-500' 
                : 'bg-white text-gray-600 border-gray-300 group-hover:border-orange-300'
            }`}>
              {option}
            </div>
            <span className="mt-1 text-xs text-gray-500">
              {index === 0 && 'Bajo'}
              {index === question.options.length - 1 && 'Alto'}
            </span>
          </label>
        ))}
      </div>
      
      {selectedValue && (
        <div className="mt-4 text-center">
          <span className="text-sm font-medium text-orange-600">
            Valor seleccionado: {selectedValue}
          </span>
        </div>
      )}
    </div>
  )
}