import { useState } from 'react'

export default function MultipleQuestion({ question, onAnswerChange }) {
  const [selectedOptions, setSelectedOptions] = useState([])

  const handleChange = (option) => {
    let newSelection
    if (selectedOptions.includes(option)) {
      newSelection = selectedOptions.filter(item => item !== option)
    } else {
      newSelection = [...selectedOptions, option]
    }
    
    setSelectedOptions(newSelection)
    onAnswerChange(question.id, newSelection)
  }

  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <span className="px-2 py-1 text-sm font-medium text-purple-600 bg-purple-100 rounded">
          Selección Múltiple
        </span>
      </div>
      
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        {question.question_text}
      </h3>
      
      <div className="space-y-3">
        {question.options && question.options.map((option, index) => (
          <label 
            key={index} 
            className="flex items-center p-3 space-x-3 transition-colors rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <input
              type="checkbox"
              value={option}
              checked={selectedOptions.includes(option)}
              onChange={() => handleChange(option)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="font-medium text-gray-700">{option}</span>
          </label>
        ))}
      </div>
      
      {selectedOptions.length > 0 && (
        <div className="p-3 mt-4 rounded-lg bg-blue-50">
          <p className="text-sm text-blue-800">
            Seleccionados: {selectedOptions.join(', ')}
          </p>
        </div>
      )}
    </div>
  )
}