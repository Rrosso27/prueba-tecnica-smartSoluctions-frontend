import { useState } from 'react'

export default function BooleanQuestion({ question, onAnswerChange }) {
  const [selectedOption, setSelectedOption] = useState('')

  const handleChange = (value) => {
    setSelectedOption(value)
    onAnswerChange(question.id, value)
  }

  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <span className="px-2 py-1 text-sm font-medium text-red-600 bg-red-100 rounded">
          Sí / No
        </span>
      </div>
      
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        {question.question_text}
      </h3>
      
      <div className="flex space-x-4">
        {question.options && question.options.map((option, index) => (
          <label 
            key={index} 
            className={`flex-1 cursor-pointer p-4 rounded-lg border-2 transition-all ${
              selectedOption === option 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 hover:border-red-300'
            }`}
          >
            <input
              type="radio"
              name={`question_${question.id}`}
              value={option}
              checked={selectedOption === option}
              onChange={(e) => handleChange(e.target.value)}
              className="sr-only"
            />
            <div className="text-center">
              <div className={`text-2xl mb-2 ${selectedOption === option ? 'text-red-500' : 'text-gray-400'}`}>
                {option === 'Sí' || option === 'Yes' ? '✓' : '✗'}
              </div>
              <span className={`font-medium ${selectedOption === option ? 'text-red-700' : 'text-gray-600'}`}>
                {option}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}