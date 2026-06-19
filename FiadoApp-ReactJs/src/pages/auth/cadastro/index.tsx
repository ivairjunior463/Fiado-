import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import logo from '../../../assets/images/fiadoapp_logo.png'

import { PageContainer } from "../../../components/Containers"
import { InputField } from "../../../components/Inputs"

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Checkbox from "@mui/material/Checkbox"
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

import api from "../../../services/api"

function Cadastro() {

    const navigate = useNavigate()

    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [aceitouTermos, setAceitouTermos] = useState(false)

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleCadastro(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        console.log("🟡 SUBMIT CADASTRO")

        setError('')
        setSuccess('')

        // VALIDAÇÕES
        if (!nome || !email || !senha || !confirmarSenha) {
            setError('Preencha todos os campos.')
            return
        }

        if (!email.includes('@')) {
            setError('Email inválido.')
            return
        }

        if (senha.length < 6) {
            setError('Senha muito curta.')
            return
        }

        if (senha !== confirmarSenha) {
            setError('Senhas não coincidem.')
            return
        }

        if (!aceitouTermos) {
            setError('Você precisa aceitar os termos.')
            return
        }

        try {
            setLoading(true)

            const payload = {
                nome,
                email,
                senha
            }

            console.log("📤 PAYLOAD ENVIADO:", payload)

            const response = await api.post('/auth/register', payload)

            console.log("🟢 RESPONSE API:", response.data)

            if (response.data.token) {
                localStorage.setItem('token', response.data.token)
            }

            setSuccess('Conta criada com sucesso!')

            setTimeout(() => {
                navigate('/home')
            }, 1200)

        } catch (err: any) {

            console.error("🔴 ERRO:", err)
            console.error("🔴 RESPONSE ERROR:", err?.response?.data)

            setError(
                err?.response?.data?.msg ||
                err?.response?.data?.mensagem ||
                'Erro ao cadastrar usuário'
            )

        } finally {
            setLoading(false)
        }
    }

    return (
        <PageContainer className="text-white">

            <form
                onSubmit={handleCadastro}
                className="m-0 w-[40%] bg-secondary-container p-6 rounded-lg"
            >

                {/* HEADER */}
                <div className="flex flex-col items-center justify-center gap-4 mb-6">

                    <img
                        src={logo}
                        alt="Logo"
                        className="w-18.75"
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

                {/* SUCCESS */}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                {/* NOME */}
                <InputField>
                    <span>Nome</span>
                    <TextField
                        variant="outlined"
                        type="text"
                        fullWidth
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                </InputField>

                {/* EMAIL */}
                <InputField>
                    <span>E-mail</span>
                    <TextField
                        variant="outlined"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </InputField>

                {/* SENHA */}
                <InputField>
                    <span>Senha</span>
                    <TextField
                        variant="outlined"
                        type="password"
                        fullWidth
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </InputField>

                {/* CONFIRMAR SENHA */}
                <InputField>
                    <span>Confirmar senha</span>
                    <TextField
                        variant="outlined"
                        type="password"
                        fullWidth
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                    />
                </InputField>

                {/* TERMOS */}
                <div className="flex items-start gap-2 mt-2 mb-4">

                    <Checkbox
                        checked={aceitouTermos}
                        onChange={(e) => setAceitouTermos(e.target.checked)}
                    />

                    <span className="text-sm">
                        Li e aceito a Política de Privacidade e concordo com o tratamento dos meus dados conforme a LGPD.
                    </span>

                </div>

                {/* BOTÕES */}
                <div className="flex flex-col gap-4">

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
                                    Criando conta...
                                </span>
                            </>
                        ) : (
                            <span className="font-bold">
                                Cadastrar
                            </span>
                        )}
                    </Button>

                    <Button
                        component={Link}
                        to="/"
                        variant="contained"
                        color="secondary"
                    >
                        <span className="font-bold">
                            Já tenho uma conta
                        </span>
                    </Button>

                </div>

            </form>

        </PageContainer>
    )
}

export default Cadastro