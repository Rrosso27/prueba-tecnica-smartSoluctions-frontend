import { useNavigate } from 'react-router-dom'
import { getMyResponses } from '../services/responses'
import { useState, useEffect } from 'react'


export default function Encuestas({ survey }) {
    const { id, title, description } = survey;
    const [myResponses, setMyResponses] = useState([])
    const navigate = useNavigate()
    const handleRealizarEncuesta = () => {
        navigate(`/preguntas-encuestas/${id}`);
    }
    const handleVerResultados = () => {
        navigate(`/resultados-encuesta/${id}`);
    }

    useEffect(() => {
        const fetchMyResponses = async () => {
            try {
                const result = await getMyResponses(id);
                if (result.success) {
                    setMyResponses(result.data.data || []);
                } else {
                    console.error('Error fetching my responses:', result.error);
                }
            } catch (error) {
                console.error('Unexpected error fetching my responses:', error);
            }
        };
        fetchMyResponses();
    }, []);



    if (!survey) {
        return (
            <div className="w-full p-6 bg-white rounded-lg shadow-lg">
                <div className="text-center text-gray-500">
                    <p>Cargando encuesta...</p>
                </div>
            </div>
        );
    }



    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-lg">
            {/* Header con título */}
            <div className="mb-6">
                <h1 className="mb-2 text-3xl font-bold text-gray-800">
                    {title || 'Encuesta sin título'}
                </h1>
                <div className="w-16 h-1 bg-blue-500 rounded-full"></div>
            </div>

            {/* Descripción */}
            <div className="mb-8">
                {description ? (
                    <p className="text-lg leading-relaxed text-gray-600">
                        {description}
                    </p>
                ) : (
                    <p className="text-lg italic leading-relaxed text-gray-400">
                        No hay descripción disponible para esta encuesta
                    </p>
                )}
            </div>

            {/* Información de la encuesta */}
            <div className="mb-8">
                <div className="p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>ID de encuesta: <strong>{id || 'N/A'}</strong></span>
                        <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                            Disponible
                        </span>
                    </div>
                </div>
            </div>

            {/* Botón de acción */}
            <div className="flex justify-center">
                {myResponses.length > 0 ? <button
                    onClick={handleVerResultados}
                    className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white transition-all duration-200 transform bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Ver mis respuestas
                </button> : <button
                    onClick={handleRealizarEncuesta}
                    className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white transition-all duration-200 transform bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Realizar Encuesta
                </button>}

            </div>
        </div>
    )
}