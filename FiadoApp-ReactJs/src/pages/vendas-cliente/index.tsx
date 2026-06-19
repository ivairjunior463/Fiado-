// src/pages/detalhes-venda-cliente/index.tsx
import { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"

import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Chip from "@mui/material/Chip"
import CircularProgress from "@mui/material/CircularProgress"
import Checkbox from "@mui/material/Checkbox"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogActions from "@mui/material/DialogActions"
import Alert from "@mui/material/Alert"

import { PageContainer, GenericContainer } from "../../components/Containers"
import { Header } from "../../components/General"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faChevronLeft,
    faCheckDouble,
    faCheck,
    faTrash,
} from "@fortawesome/free-solid-svg-icons"

import api from "../../services/api"

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface Venda {
    id: number
    status: "ATIVA" | "PAGA" | "PARCIAL"
    valor_total: string
    data_compra: string
    data_vencimento: string | null
    observacao: string | null
    cliente_nome: string
    cliente_sobrenome: string
}

// ── Card de venda ─────────────────────────────────────────────────────────────

function VendaCard({
    venda,
    selecionada,
    onToggle,
    onDeletar,
}: {
    venda: Venda
    selecionada: boolean
    onToggle: (id: number) => void
    onDeletar: (id: number) => void
}) {
    const estaPaga = venda.status === "PAGA"

    function formatarData(valor: string | null) {
        if (!valor) return "—"
        const [ano, mes, dia] = valor.split("T")[0].split("-")
        return `${dia}/${mes}/${ano}`
    }

    return (
        <Card
            sx={{
                backgroundColor: selecionada ? "#2a1f1a" : "#1E1E2E",
                borderRadius: 3,
                border: selecionada ? "1px solid #E8624A" : "1px solid transparent",
                transition: "all 0.15s",
                cursor: estaPaga ? "default" : "pointer",
            }}
            onClick={() => !estaPaga && onToggle(venda.id)}
        >
            <CardContent>
                <div className="flex items-start gap-3">

                    {/* Checkbox — só para vendas ativas */}
                    {!estaPaga && (
                        <Checkbox
                            checked={selecionada}
                            onChange={() => onToggle(venda.id)}
                            onClick={e => e.stopPropagation()}
                            sx={{
                                color: "#555",
                                "&.Mui-checked": { color: "#E8624A" },
                                padding: 0,
                                mt: "2px",
                            }}
                        />
                    )}

                    <div className="flex flex-col gap-3 flex-1">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold">
                                Venda #{venda.id}
                            </span>
                            <div className="flex items-center gap-2">
                                <Chip
                                    label={estaPaga ? "Paga" : "Em aberto"}
                                    color={estaPaga ? "success" : "error"}
                                    size="small"
                                />
                                <button
                                    type="button"
                                    onClick={e => { e.stopPropagation(); onDeletar(venda.id) }}
                                    title="Excluir venda"
                                    className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                                >
                                    <FontAwesomeIcon icon={faTrash} size="sm" />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-6 flex-wrap">
                            <div className="flex flex-col">
                                <span className="secondary-text text-sm">Valor</span>
                                <span className="font-bold">
                                    R$ {Number(venda.valor_total).toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <span className="secondary-text text-sm">Data da compra</span>
                                <span className="font-bold">{formatarData(venda.data_compra)}</span>
                            </div>

                            {venda.data_vencimento && (
                                <div className="flex flex-col">
                                    <span className="secondary-text text-sm">Vencimento</span>
                                    <span className="font-bold">
                                        {formatarData(venda.data_vencimento)}
                                    </span>
                                </div>
                            )}

                            {venda.observacao && (
                                <div className="flex flex-col">
                                    <span className="secondary-text text-sm">Obs.</span>
                                    <span className="font-bold">{venda.observacao}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// ── Página principal ──────────────────────────────────────────────────────────

function VendasCliente() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [vendas, setVendas] = useState<Venda[]>([])
    const [loading, setLoading] = useState(false)
    const [erro, setErro] = useState<string | null>(null)
    const [sucesso, setSucesso] = useState<string | null>(null)

    // Seleção
    const [selecionadas, setSelecionadas] = useState<number[]>([])

    // Loading de ações
    const [quitando, setQuitando] = useState(false)
    const [excluindo, setExcluindo] = useState(false)

    // Diálogo de confirmação de exclusão do cliente
    const [dialogExcluir, setDialogExcluir] = useState(false)

    // Diálogo de confirmação de exclusão de venda
    const [vendaParaDeletar, setVendaParaDeletar] = useState<number | null>(null)
    const [deletandoVenda, setDeletandoVenda] = useState(false)

    // ── Dados derivados ───────────────────────────────────────────────────────

    const vendasAtivas = vendas.filter(v => v.status === "ATIVA")
    const todasAtivasSelecionadas =
        vendasAtivas.length > 0 &&
        vendasAtivas.every(v => selecionadas.includes(v.id))

    const nomeCliente = vendas.length > 0
        ? `${vendas[0].cliente_nome} ${vendas[0].cliente_sobrenome}`.trim()
        : "Cliente"

    const totalSelecionado = vendas
        .filter(v => selecionadas.includes(v.id))
        .reduce((acc, v) => acc + Number(v.valor_total), 0)

    // ── Carregar vendas ───────────────────────────────────────────────────────

    async function carregar() {
        setLoading(true)
        setErro(null)
        try {
            const { data } = await api.get(`/vendas?cliente_id=${id}`)
            setVendas(data)
        } catch (err: any) {
            setErro(err?.response?.data?.erro || "Erro ao carregar vendas.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { carregar() }, [id])

    // ── Toggle seleção ────────────────────────────────────────────────────────

    function toggleSelecionada(vendaId: number) {
        setSelecionadas(prev =>
            prev.includes(vendaId)
                ? prev.filter(i => i !== vendaId)
                : [...prev, vendaId]
        )
    }

    function toggleTodas() {
        if (todasAtivasSelecionadas) {
            setSelecionadas([])
        } else {
            setSelecionadas(vendasAtivas.map(v => v.id))
        }
    }

    // ── Quitar selecionadas ───────────────────────────────────────────────────

    async function quitar(ids: number[]) {
        if (ids.length === 0) return
        setQuitando(true)
        setErro(null)
        setSucesso(null)
        try {
            await api.post(`/vendas/clientes/${id}/quitar`, { venda_ids: ids })
            setSucesso(
                ids.length === vendasAtivas.length
                    ? "Todas as vendas foram quitadas!"
                    : `${ids.length} venda(s) quitada(s) com sucesso!`
            )
            setSelecionadas([])
            await carregar()
        } catch (err: any) {
            setErro(err?.response?.data?.erro || "Erro ao quitar vendas.")
        } finally {
            setQuitando(false)
        }
    }

    // ── Deletar venda individual ─────────────────────────────────────────────

    async function deletarVenda() {
        if (!vendaParaDeletar) return
        setDeletandoVenda(true)
        setErro(null)
        try {
            await api.delete(`/vendas/${vendaParaDeletar}`)
            setSucesso("Venda excluída com sucesso.")
            setSelecionadas(prev => prev.filter(i => i !== vendaParaDeletar))
            setVendaParaDeletar(null)
            await carregar()
        } catch (err: any) {
            setErro(err?.response?.data?.erro || "Erro ao excluir venda.")
            setVendaParaDeletar(null)
        } finally {
            setDeletandoVenda(false)
        }
    }

    // ── Excluir cliente ───────────────────────────────────────────────────────

    async function excluirCliente() {
        setExcluindo(true)
        setErro(null)
        try {
            await api.delete(`/clientes/${id}`)
            navigate("/clientes")
        } catch (err: any) {
            setErro(err?.response?.data?.erro || "Erro ao excluir cliente.")
            setDialogExcluir(false)
        } finally {
            setExcluindo(false)
        }
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <>
            <Header />

            <div className="flex items-center px-5 pt-3">
                <Button
                    component={Link}
                    to="/clientes"
                    variant="contained"
                    color="secondary"
                    startIcon={<FontAwesomeIcon icon={faChevronLeft} />}
                >
                    Voltar
                </Button>
            </div>

            <PageContainer className="text-white">
                <GenericContainer className="w-6xl rounded-2xl bg-[#181829] gap-4">

                    {/* Cabeçalho */}
                    <div className="flex justify-between items-start flex-wrap gap-3">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-2xl font-bold">{nomeCliente}</h1>
                            <span className="secondary-text">
                                Histórico de vendas do cliente
                            </span>
                        </div>

                        <Button
                            variant="contained"
                            color="error"
                            startIcon={
                                excluindo
                                    ? <CircularProgress size={14} color="inherit" />
                                    : <FontAwesomeIcon icon={faTrash} />
                            }
                            disabled={excluindo || quitando}
                            onClick={() => setDialogExcluir(true)}
                        >
                            Excluir cliente
                        </Button>
                    </div>

                    {/* Alertas */}
                    {erro && (
                        <Alert severity="error" onClose={() => setErro(null)}>
                            {erro}
                        </Alert>
                    )}
                    {sucesso && (
                        <Alert severity="success" onClose={() => setSucesso(null)}>
                            {sucesso}
                        </Alert>
                    )}

                    {/* Cards de contagem */}
                    {!loading && vendas.length > 0 && (
                        <div className="grid grid-cols-3 gap-3">
                            <div className="flex flex-col gap-1 p-4 rounded-xl bg-[#13131A] border border-zinc-800">
                                <span className="secondary-text text-sm">Total de vendas</span>
                                <span className="text-2xl font-bold">{vendas.length}</span>
                            </div>
                            <div className="flex flex-col gap-1 p-4 rounded-xl bg-[#13131A] border border-zinc-800">
                                <span className="secondary-text text-sm">Vendas em aberto</span>
                                <span className="text-2xl font-bold primary-text">
                                    {vendasAtivas.length}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1 p-4 rounded-xl bg-[#13131A] border border-zinc-800">
                                <span className="secondary-text text-sm">Total em aberto</span>
                                <span className="text-2xl font-bold primary-text">
                                    R$ {vendasAtivas
                                        .reduce((acc, v) => acc + Number(v.valor_total), 0)
                                        .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    )}

                    <hr className="border-zinc-700" />

                    {/* Barra de ações */}
                    {!loading && vendasAtivas.length > 0 && (
                        <div className="flex items-center justify-between flex-wrap gap-3 p-3 rounded-xl bg-[#13131A] border border-zinc-800">
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    checked={todasAtivasSelecionadas}
                                    indeterminate={
                                        selecionadas.length > 0 && !todasAtivasSelecionadas
                                    }
                                    onChange={toggleTodas}
                                    sx={{
                                        color: "#555",
                                        "&.Mui-checked": { color: "#E8624A" },
                                        "&.MuiCheckbox-indeterminate": { color: "#E8624A" },
                                        padding: 0,
                                    }}
                                />
                                <span className="text-sm secondary-text">
                                    {selecionadas.length > 0
                                        ? `${selecionadas.length} selecionada(s) · R$ ${totalSelecionado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                                        : "Selecionar vendas em aberto"}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    disabled={selecionadas.length === 0 || quitando}
                                    startIcon={
                                        quitando
                                            ? <CircularProgress size={14} color="inherit" />
                                            : <FontAwesomeIcon icon={faCheck} />
                                    }
                                    onClick={() => quitar(selecionadas)}
                                >
                                    Quitar selecionadas
                                </Button>

                                <Button
                                    variant="outlined"
                                    size="small"
                                    disabled={vendasAtivas.length === 0 || quitando}
                                    startIcon={
                                        quitando
                                            ? <CircularProgress size={14} color="inherit" />
                                            : <FontAwesomeIcon icon={faCheckDouble} />
                                    }
                                    sx={{
                                        borderColor: "#E8624A",
                                        color: "#E8624A",
                                        "&:hover": { borderColor: "#E8624A", background: "#2a1f1a" },
                                    }}
                                    onClick={() => quitar(vendasAtivas.map(v => v.id))}
                                >
                                    Quitar todas
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="flex justify-center py-8">
                            <CircularProgress sx={{ color: "#E8624A" }} />
                        </div>
                    )}

                    {/* Lista de vendas */}
                    {!loading && (
                        <>
                            {vendas.length === 0 ? (
                                <span className="secondary-text text-center py-8">
                                    Nenhuma venda encontrada para este cliente.
                                </span>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {vendas.map(venda => (
                                        <VendaCard
                                            key={venda.id}
                                            venda={venda}
                                            selecionada={selecionadas.includes(venda.id)}
                                            onToggle={toggleSelecionada}
                                            onDeletar={vid => setVendaParaDeletar(vid)}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                </GenericContainer>
            </PageContainer>

            {/* Diálogo de confirmação de exclusão de venda */}
            <Dialog
                open={vendaParaDeletar !== null}
                onClose={() => setVendaParaDeletar(null)}
                PaperProps={{
                    sx: { backgroundColor: "#1E1E2E", color: "#fff", borderRadius: 3 }
                }}
            >
                <DialogTitle sx={{ fontWeight: "bold" }}>
                    Excluir venda
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: "#ccc" }}>
                        Tem certeza que deseja excluir a <strong style={{ color: "#fff" }}>Venda #{vendaParaDeletar}</strong>?
                        Os itens e pagamentos desta venda também serão removidos.
                        Essa ação não pode ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: 2, gap: 1 }}>
                    <Button
                        onClick={() => setVendaParaDeletar(null)}
                        variant="contained"
                        color="secondary"
                        disabled={deletandoVenda}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={deletarVenda}
                        variant="contained"
                        color="error"
                        disabled={deletandoVenda}
                        startIcon={deletandoVenda ? <CircularProgress size={14} color="inherit" /> : null}
                    >
                        {deletandoVenda ? "Excluindo..." : "Confirmar exclusão"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo de confirmação de exclusão de cliente */}
            <Dialog
                open={dialogExcluir}
                onClose={() => setDialogExcluir(false)}
                PaperProps={{
                    sx: { backgroundColor: "#1E1E2E", color: "#fff", borderRadius: 3 }
                }}
            >
                <DialogTitle sx={{ fontWeight: "bold" }}>
                    Excluir cliente
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: "#ccc" }}>
                        Tem certeza que deseja excluir <strong style={{ color: "#fff" }}>{nomeCliente}</strong>?
                        Todas as vendas e pagamentos associados também serão excluídos.
                        Essa ação não pode ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: 2, gap: 1 }}>
                    <Button
                        onClick={() => setDialogExcluir(false)}
                        variant="contained"
                        color="secondary"
                        disabled={excluindo}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={excluirCliente}
                        variant="contained"
                        color="error"
                        disabled={excluindo}
                        startIcon={excluindo ? <CircularProgress size={14} color="inherit" /> : null}
                    >
                        {excluindo ? "Excluindo..." : "Confirmar exclusão"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default VendasCliente