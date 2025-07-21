import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import HamburgerMenu from '../components/HamburgerMenu'

export default function Inicio() {
  const [count, setCount] = useState(0)
  const { user, token } = useAuth()

  return (
    <>
      <HamburgerMenu />
      <div className="flex flex-col items-center justify-center w-full min-h-96">
        <h1 className="mb-8 text-4xl font-bold text-gray-800">¡Bienvenido, {user?.name}!</h1>

        {/* Información del usuario */}
        <div className="w-full max-w-md p-6 mb-8 bg-white rounded-lg shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-center">Información del Usuario</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">ID:</span> {user?.id}</p>
            <p><span className="font-semibold">Nombre:</span> {user?.name}</p>
            <p><span className="font-semibold">Email:</span> {user?.email}</p>
            <p><span className="font-semibold">Registrado:</span> {new Date(user?.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <p className="max-w-md mb-8 text-lg text-center text-gray-600">
          Has iniciado sesión correctamente. Esta es la página de inicio de tu aplicación React con Vite, React Router y Tailwind CSS.
        </p>


      </div>
    </>

  );
}