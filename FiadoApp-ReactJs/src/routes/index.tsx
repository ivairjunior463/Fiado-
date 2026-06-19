import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from '../pages/auth/login'
import Home from '../pages/home'
import Cadastro from '../pages/auth/cadastro'
import NovaVenda from '../pages/nova-venda'
import ConsultarClientes from '../pages/consultar-clientes'
import Relatorios from '../pages/relatorios'
import VendasCliente from '../pages/vendas-cliente'
// import Configuracoes from '../pages/configuracoes'

import {
    PrivateRoute,
    PublicRoute
} from '../components/RoutesComponent'
import NovoCliente from '../pages/novo-cliente'
import Analytics from '../pages/analytics'

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Públicas */}

                <Route
                    path='/'
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                <Route
                    path='/cadastro'
                    element={
                        <PublicRoute>
                            <Cadastro />
                        </PublicRoute>
                    }
                />

                {/* Privadas */}

                <Route
                    path='/home'
                    element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    }
                />

                <Route
                    path='/nova-venda'
                    element={
                        <PrivateRoute>
                            <NovaVenda />
                        </PrivateRoute>
                    }
                />

                <Route
                    path='/clientes'
                    element={
                        <PrivateRoute>
                            <ConsultarClientes />
                        </PrivateRoute>
                    }
                />

                <Route
                    path='/relatorios'
                    element={
                        <PrivateRoute>
                            <Relatorios />
                        </PrivateRoute>
                    }
                />

                {/* <Route
                    path='/configuracoes'
                    element={
                        <PrivateRoute>
                            <Configuracoes />
                        </PrivateRoute>
                    }
                /> */}

                <Route
                    path='/novo-cliente'
                    element={
                        <PrivateRoute>
                            <NovoCliente />
                        </PrivateRoute>
                    }
                />

                <Route
                    path='/clientes/:id'
                    element={
                        <PrivateRoute>
                            <VendasCliente />
                        </PrivateRoute>
                    }
                />

                <Route
                    path='/analytics'
                    element={
                        <PrivateRoute>
                            <Analytics />
                        </PrivateRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    )
}