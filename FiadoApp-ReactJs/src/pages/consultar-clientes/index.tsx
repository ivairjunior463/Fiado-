import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

import Chip from "@mui/material/Chip"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CircularProgress from "@mui/material/CircularProgress"

import { PageContainer, GenericContainer } from "../../components/Containers"
import { Header } from "../../components/General"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons"

import api from "../../services/api"

/* =========================
   CARD
========================= */
function ClienteCard({
    id,
    nome,
    valor,
    num_vendas_at,
    num_vendas_pg,
    onDelete
}: any) {

    async function handleDelete(e: any) {
        e.preventDefault()
        e.stopPropagation()

        const confirmDelete = window.confirm(
            "Deseja realmente remover este cliente?"
        )

        if (!confirmDelete) return

        try {
            await api.delete(`/clientes/${id}`)

            onDelete?.(id)

        } catch (err) {
            console.error("Erro ao deletar cliente:", err)
            alert("Erro ao deletar cliente.")
        }
    }

    return (
        <Card
            component={Link}
            to={`/clientes/${id}`}
            sx={{
                backgroundColor: "#1E1E2E",
                borderRadius: 3,
                textDecoration: "none",
                transition: "0.2s",
                "&:hover": {
                    borderColor: "primary.main",
                    transform: "translateY(-2px)",
                },
            }}
        >
            <CardContent sx={{ padding: 1.5 }}>

                <div className="flex flex-col gap-2">

                    <div className="flex justify-between items-center">
                        <h1 className="font-bold text-xl">
                            {nome}
                        </h1>

                        <Chip
                            label={`R$ ${Number(valor).toFixed(2)}`}
                            color={Number(valor) > 0 ? "error" : "success"}
                        />
                    </div>

                    <div className="flex items-center gap-4">

                        <div className="flex flex-col border-r pr-3">
                            <span>Ativas</span>
                            <span>{num_vendas_at}</span>
                        </div>

                        <div className="flex flex-col">
                            <span>Pagas</span>
                            <span>{num_vendas_pg}</span>
                        </div>

                    </div>

                    <div className="flex justify-end gap-2">

                        <Button
                            onClick={handleDelete}
                            variant="contained"
                            color="secondary"
                            size="small"
                            title="Deletar cliente"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>

                        <Button
                            component={Link}
                            to={`/nova-venda?clienteId=${id}`}
                            variant="contained"
                            color="primary"
                            size="small"
                            title="Nova venda para este cliente"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </Button>

                    </div>

                </div>

            </CardContent>
        </Card>
    )
}

/* =========================
   PAGE
========================= */
function ConsultarClientes() {
    const location = useLocation()

    const [clientes, setClientes] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [searchTerm, setSearchTerm] = useState("")

    const initialFilter =
        location.state?.initialFilter || "all"

    const [filter, setFilter] =
        useState<"all" | "debt" | "noDebt">(initialFilter)

    useEffect(() => {
        async function load() {
            setLoading(true)

            try {
                const res = await api.get("/clientes/meus-clientes")
                setClientes(res.data)

            } catch (err: any) {
                setError(
                    err?.response?.data?.msg ||
                    "Erro ao carregar clientes"
                )
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [])

    function handleRemove(id: string) {
        setClientes((prev) => prev.filter(c => c.id !== id))
    }

    function handleFilterChange(selected: "all" | "debt" | "noDebt") {
        setFilter((prev) => {
            if (selected === "all") return "all"
            if (prev === selected) return "all"
            return selected
        })
    }

    const clientesFiltrados = clientes.filter((cliente) => {

        const nomeCompleto =
            `${cliente.nome} ${cliente.sobrenome}`.toLowerCase()

        const matchSearch =
            nomeCompleto.includes(searchTerm.toLowerCase())

        const temDebito =
            Number(cliente.qtd_vendas_abertas) > 0

        const matchFilter =
            filter === "all" ||
            (filter === "debt" && temDebito) ||
            (filter === "noDebt" && !temDebito)

        return matchSearch && matchFilter
    })

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

                <GenericContainer className="w-6xl rounded-2xl bg-[#181829] gap-3">

                    <div className="flex flex-col gap-1">
                        <h1 className="font-bold text-xl">
                            Buscar clientes
                        </h1>
                        <span className="secondary-text">
                            Aqui você pode ver seus clientes
                        </span>
                    </div>

                    {/* SEARCH */}
                    <TextField
                        placeholder="Nome do cliente"
                        type="search"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {/* FILTERS */}
                    <div className="flex gap-3">

                        <Chip
                            label="Todos"
                            clickable
                            color={filter === "all" ? "primary" : "default"}
                            onClick={() => handleFilterChange("all")}
                        />

                        <Chip
                            label="Com débito"
                            clickable
                            color={filter === "debt" ? "primary" : "default"}
                            onClick={() => handleFilterChange("debt")}
                        />

                        <Chip
                            label="Sem débito"
                            clickable
                            color={filter === "noDebt" ? "primary" : "default"}
                            onClick={() => handleFilterChange("noDebt")}
                        />
                    </div>

                    <hr />

                    {loading && (
                        <div className="flex justify-center">
                            <CircularProgress />
                        </div>
                    )}

                    {error && (
                        <p className="text-red-400">{error}</p>
                    )}

                    {!loading && (
                        <span className="secondary-text">
                            {clientesFiltrados.length} cliente(s) encontrado(s)
                        </span>
                    )}

                    <div className="flex flex-col gap-3">

                        {clientesFiltrados.map((cliente) => (
                            <ClienteCard
                                key={cliente.id}
                                id={cliente.id}
                                nome={`${cliente.nome} ${cliente.sobrenome}`}
                                valor={cliente.valor_devido}
                                num_vendas_at={cliente.qtd_vendas_abertas}
                                num_vendas_pg={cliente.qtd_vendas_pagas}
                                onDelete={handleRemove}
                            />
                        ))}

                    </div>

                </GenericContainer>

            </PageContainer>
        </>
    )
}

export default ConsultarClientes