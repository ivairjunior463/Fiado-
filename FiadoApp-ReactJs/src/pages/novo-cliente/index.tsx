import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"
import CircularProgress from "@mui/material/CircularProgress"

import { PageContainer, GenericContainer } from "../../components/Containers"
import { Header } from "../../components/General"
import { InputField } from "../../components/Inputs"

import api from "../../services/api"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"

function NovoCliente() {
    const navigate = useNavigate()

    const [nome, setNome] = useState("")
    const [sobrenome, setSobrenome] = useState("")
    const [telefone, setTelefone] = useState("")
    const [referencia, setReferencia] = useState("")
    const [limiteCredito, setLimiteCredito] = useState<number>(0)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        setError("")
        setSuccess("")

        if (!nome || !sobrenome || !telefone) {
            setError("Nome, sobrenome e telefone são obrigatórios.")
            return
        }

        setLoading(true)

        try {
            const payload = {
                nome: nome.trim(),
                sobrenome: sobrenome.trim(),
                telefone: telefone.trim(),
                referencia: referencia.trim(),
                limite_credito: limiteCredito || 0
            }

            console.log("📦 Payload enviado:", payload)

            const response = await api.post("/clientes", payload)

            console.log("✅ Resposta API:", response.data)

            setSuccess("Cliente cadastrado com sucesso!")

            setTimeout(() => {
                navigate("/clientes")
            }, 1200)

        } catch (err: any) {
            console.error("❌ Erro ao cadastrar cliente:", err)

            setError(
                err?.response?.data?.msg ||
                err?.response?.data?.message ||
                "Erro ao cadastrar cliente."
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Header />

            <div className="flex items-center px-5 pt-3">
                <Button
                    component={Link}
                    to="/home"
                    variant="contained"
                    color="secondary"
                    startIcon={<FontAwesomeIcon icon={faChevronLeft} />}
                >
                    Voltar
                </Button>
            </div>

            <PageContainer className="text-white">
                <GenericContainer className="w-6xl rounded-2xl bg-[#181829] gap-4">

                    <h3 className="text-center my-2 text-xl font-bold">
                        Cadastrar novo cliente
                    </h3>

                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        <div className="flex gap-5">
                            <InputField className="w-1/2">
                                <span className="secondary-text">Nome:</span>
                                <TextField
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    fullWidth
                                />
                            </InputField>

                            <InputField className="w-1/2">
                                <span className="secondary-text">Sobrenome:</span>
                                <TextField
                                    value={sobrenome}
                                    onChange={(e) => setSobrenome(e.target.value)}
                                    fullWidth
                                />
                            </InputField>
                        </div>

                        <InputField>
                            <span className="secondary-text">Telefone:</span>
                            <TextField
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                fullWidth
                            />
                        </InputField>

                        <InputField>
                            <span className="secondary-text">Referência:</span>
                            <TextField
                                value={referencia}
                                onChange={(e) => setReferencia(e.target.value)}
                                fullWidth
                            />
                        </InputField>

                        <InputField>
                            <span className="secondary-text">Limite de crédito:</span>
                            <TextField
                                type="number"
                                value={limiteCredito}
                                onChange={(e) => setLimiteCredito(Number(e.target.value))}
                                fullWidth
                            />
                        </InputField>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? (
                                <CircularProgress size={22} color="inherit" />
                            ) : (
                                "Cadastrar cliente"
                            )}
                        </Button>

                    </form>

                </GenericContainer>
            </PageContainer>
        </>
    )
}

export default NovoCliente