import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../App.css'
import HamburgerMenu from '../components/HamburgerMenu'

function AuthLayout() {
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Header/Navigation - Ocupa todo el ancho */}
      <header className="w-full p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between w-full px-4">
          {/* Logo o título de la aplicación */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">Mi Aplicación</h1>
          </div>

          {/* User info and hamburger menu */}
          {isAuthenticated() && (
            <div className="flex items-center gap-4">
              <div className="hidden text-sm sm:block">
                <span className="text-gray-600">Bienvenido, </span>
                <span className="font-semibold text-gray-800">{user?.name}</span>
              </div>
              <HamburgerMenu />
            </div>
          )}
        </div>
      </header>

      {/* Main content - Ocupa TODO el ancho de la pantalla */}
      <main className="w-full">
        <div className="w-full px-4 py-8">
          <div className="w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}

export default AuthLayout
