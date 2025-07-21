import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import '../App.css'

function AuthLayout() {
  const { user, logout, isAuthenticated } = useAuth()



  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm p-4">
        <div className="flex gap-8 justify-between items-center max-w-7xl mx-auto">
         
          
          {/* User info and logout */}
          {isAuthenticated() && (
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-600">Bienvenido, </span>
                <span className="font-semibold text-gray-800">{user?.name}</span>
              </div>
              <button
                onClick={() => logout ()}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>
      
      {/* Main content - Here will render the child routes */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AuthLayout
