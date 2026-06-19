import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import logo from '../../../assets/images/fiadoapp_logo.png'

import { PageContainer } from "../../../components/Containers"
import AuthForm from "../../../components/Forms"
import { InputField } from "../../../components/Inputs"

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

import api from "../../../services/api"

function Login() {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        console.log("🟡 LOGIN SUBMIT")

        setError('')

        if (!email || !senha) {
            setError('Email e senha são obrigatórios!')
            return
        }

        try {
            setLoading(true)

            const payload = { email, senha }

            console.log("📤 ENVIANDO LOGIN:", payload)

            const response = await api.post('/auth/login', payload)

            console.log("🟢 RESPOSTA LOGIN:", response.data)

            if (response.data?.token) {
                localStorage.setItem('token', response.data.token)
            } else {
                setError(response.data?.msg || 'Erro ao fazer login')
                return
            }

            navigate('/home')

        } catch (err: any) {

            console.error("🔴 ERRO LOGIN:", err)
            console.error("🔴 RESPONSE:", err?.response?.data)

            setError(
                err?.response?.data?.msg ||
                err?.response?.data?.mensagem ||
                'Não foi possível fazer login'
            )

        } finally {
            setLoading(false)
        }
    }

    return (
        <PageContainer className="text-white">

            <form
                onSubmit={handleLogin}
                className="m-0 w-[40%] bg-secondary-container p-6 rounded-lg"
            >

                {/* HEADER */}
                <div className="flex flex-col items-center justify-center gap-4 mb-6">

                    <img
                        src={logo}
                        alt="Logotipo FiadoApp"
                        className='w-18.75'
                    />

                    <div className="text-center flex flex-col gap-3">
                        <h1 className="text-2xl font-bold">
                            FiadoApp
                        </h1>

                        <p>
                            Controle de vendas a prazo para o seu negócio
                        </p>
                    </div>

                </div>

                {/* ERROR */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* EMAIL */}
                <InputField>
                    <span>E-mail</span>
                    <TextField
                        fullWidth
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </InputField>

                {/* SENHA */}
                <InputField>
                    <span>Senha</span>
                    <TextField
                        fullWidth
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </InputField>

                {/* BOTÕES */}
                <div className="flex flex-col gap-4 mt-6">

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        fullWidth
                    >
                        {loading ? (
                            <>
                                <CircularProgress size={20} color="inherit" />
                                <span style={{ marginLeft: 8 }}>
                                    Entrando...
                                </span>
                            </>
                        ) : (
                            <span className="font-bold">
                                Entrar
                            </span>
                        )}
                    </Button>

                    <Button
                        component={Link}
                        to="/cadastro"
                        variant="contained"
                        color="secondary"
                        fullWidth
                    >
                        <span className="font-bold">
                            Criar conta
                        </span>
                    </Button>

                </div>

            </form>

        </PageContainer>
    )
}

export default Login