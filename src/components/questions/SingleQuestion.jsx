import { useState } from 'react'

export default function SingleQuestion({ question, onAnswerChange }) {
  const [selectedOption, setSelectedOption] = useState('')

  const handleChange = (value) => {
    setSelectedOption(value)
    onAnswerChange(question.id, value)
  }

  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <span className="px-2 py-1 text-sm font-medium text-green-600 bg-green-100 rounded">
          Selección Única
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
              type="radio"
              name={`question_${question.id}`}
              value={option}
              checked={selectedOption === option}
              onChange={(e) => handleChange(e.target.value)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <span className="font-medium text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  )
}