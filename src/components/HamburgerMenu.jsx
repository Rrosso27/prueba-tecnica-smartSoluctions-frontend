import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function HamburgerMenu() {
    // ✅ Corregido: el menú debe empezar cerrado
    const [isOpen, setIsOpen] = useState(false)
    const { user, logout } = useAuth()

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    // ✅ Corregido: closeMenu debe cerrar el menú (false)
    const closeMenu = () => {
        setIsOpen(false)
    }

    const handleLogout = () => {
        logout()
        closeMenu()
    }

    return (
        <>
            {/* Botón del hamburger */}
            <button
                onClick={toggleMenu}
                className="flex items-center p-2 text-gray-800 transition-colors duration-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                aria-label="Abrir menú"
            >
                <span className="sr-only">Abrir menú</span>

                <div className="flex flex-col items-center justify-center w-6 h-6">
                    <span className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
                        }`}></span>
                    <span className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isOpen ? 'opacity-0' : 'opacity-100'
                        }`}></span>
                    <span className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
                        }`}></span>
                </div>
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 "
                    onClick={closeMenu}
                ></div>
            )}

            <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50  ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>

                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Menú</h2>
                    <button
                        onClick={closeMenu}
                        className="p-2 text-gray-500 transition-colors duration-200 rounded-lg hover:bg-gray-100"
                        aria-label="Cerrar menú"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                {user && (
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 font-medium text-white bg-blue-500 rounded-full">
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                <nav className="flex-1 px-4 py-6">
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/"
                                onClick={closeMenu}
                                className="flex items-center px-4 py-3 text-gray-700 transition-colors duration-200 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                </svg>
                                Inicio
                            </Link>
                        </li>
                       
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center w-full px-4 py-3 text-red-600 transition-colors duration-200 rounded-lg bg-red-50 hover:bg-red-100"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </>
    )
}