import { createContext, useContext, useState, useEffect } from 'react'
import { logoutUser } from '../services/auth'
import { AUTH_CONFIG } from '../config/api'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const savedToken = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY)
        const savedUser = localStorage.getItem(AUTH_CONFIG.USER_KEY)

        if (savedToken && savedUser) {
            try {
                setToken(savedToken)
                setUser(JSON.parse(savedUser))
            } catch (error) {
                console.error('Error parsing saved user data:', error)
                localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY)
                localStorage.removeItem(AUTH_CONFIG.USER_KEY)
            }
        }
        setLoading(false)
    }, [])

    const login = (accessToken, userData) => {
        setToken(accessToken)
        setUser(userData)

        localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, accessToken)
        localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(userData))
    }

    const logout = async () => {
        try {
            await logoutUser()

            setToken(null)
            setUser(null)

            localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY)
            localStorage.removeItem(AUTH_CONFIG.USER_KEY)

        } catch (error) {
            console.error('Error during logout:', error)
        }
    }

    const isAuthenticated = () => {
        return !!token && !!user
    }

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
