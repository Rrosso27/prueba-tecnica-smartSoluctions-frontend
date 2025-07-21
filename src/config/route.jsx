import { createBrowserRouter } from "react-router-dom";
import Inicio from '../views/Inicio.jsx'
import Login from '../views/Login.jsx'
import Register from '../views/Register.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import PublicRoute from '../components/PublicRoute.jsx'
import AuthLayout from "../layouts/AuthLayout.jsx";
const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    )
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    )
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AuthLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Inicio />
      },
    ]
  },
]);

export default router;