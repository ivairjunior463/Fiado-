// src/components/RoutesComponent.tsx

import { Navigate } from 'react-router-dom'

interface RouteProps {
    children: React.ReactNode
}

export function PrivateRoute({ children }: RouteProps) {
    const token = localStorage.getItem('token')

    if (!token) {
        return <Navigate to='/' replace />
    }

    return children
}

export function PublicRoute({ children }: RouteProps) {
    const token = localStorage.getItem('token')

    if (token) {
        return <Navigate to='/home' replace />
    }

    return children
}