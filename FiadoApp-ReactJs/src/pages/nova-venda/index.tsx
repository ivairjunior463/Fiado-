// src/pages/nova-venda/index.tsx
import { useState, useEffect, useRef, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faChevronLeft, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'

import { GenericContainer, PageContainer } from '../../components/Containers'
import { Header } from '../../components/General'
import { InputField } from '../../components/Inputs'

import api from '../../services/api'

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface Cliente {
    id: number
    nome: string
    sobrenome: string
    referencia: string | null
    telefone: string | null
}

interface ItemVenda {
    id: string          // chave local para o React (não vai para a API)
    descricao: string
    quantidade: number
    valor_unitario: number
}

// ── Componente ────────────────────────────────────────────────────────────────

function NovaVenda() {
    const navigate = useNavigate()

    // ── Estado: busca de cliente ──────────────────────────────────────────────
    const [buscaCliente, setBuscaCliente] = useState('')
    const [sugestoes, setSugestoes] = useState<Cliente[]>([])
    const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null)
    const [buscandoClientes, setBuscandoClientes] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // ── Estado: itens ─────────────────────────────────────────────────────────
    const [itens, setItens] = useState<ItemVenda[]>([
        { id: crypto.randomUUID(), descricao: '', quantidade: 1, valor_unitario: 0 }
    ])

    // ── Estado: outros campos ─────────────────────────────────────────────────
    const [dataCompra, setDataCompra] = useState(new Date().toISOString().split('T')[0])
    const [dataVencimento, setDataVencimento] = useState('')
    const [observacao, setObservacao] = useState('')

    // ── Estado: submissão ─────────────────────────────────────────────────────
    const [salvando, setSalvando] = useState(false)
    const [erro, setErro] = useState<string | null>(null)

    // ── Total calculado ───────────────────────────────────────────────────────
    const total = itens.reduce((acc, item) => {
        const qtd = Number(item.quantidade) || 0
        const val = Number(item.valor_unitario) || 0
        return acc + qtd * val
    }, 0)

    // ── Busca de clientes com debounce ────────────────────────────────────────
    useEffect(() => {
        if (clienteSelecionado) return

        if (debounceRef.current) clearTimeout(debounceRef.current)

        if (buscaCliente.trim().length < 2) {
            setSugestoes([])
            return
        }

        debounceRef.current = setTimeout(async () => {
            setBuscandoClientes(true)
            try {
                const { data } = await api.get('/clientes', {
                    params: { nome: buscaCliente.trim() }
                })
                // Filtra localmente pelo nome digitado (a API retorna todos os clientes do usuário)
                const filtrados = (data as Cliente[]).filter(c =>
                    `${c.nome} ${c.sobrenome}`.toLowerCase()
                        .includes(buscaCliente.toLowerCase())
                )
                setSugestoes(filtrados.slice(0, 6))
            } catch {
                setSugestoes([])
            } finally {
                setBuscandoClientes(false)
            }
        }, 350)
    }, [buscaCliente, clienteSelecionado])

    // Fecha dropdown ao clicar fora
    useEffect(() => {
        function handleClickFora(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setSugestoes([])
            }
        }
        document.addEventListener('mousedown', handleClickFora)
        return () => document.removeEventListener('mousedown', handleClickFora)
    }, [])

    function selecionarCliente(cliente: Cliente) {
        setClienteSelecionado(cliente)
        setBuscaCliente(`${cliente.nome} ${cliente.sobrenome}`)
        setSugestoes([])
    }

    function limparCliente() {
        setClienteSelecionado(null)
        setBuscaCliente('')
        setSugestoes([])
    }

    // ── Manipulação de itens ──────────────────────────────────────────────────
    function adicionarItem() {
        setItens(prev => [
            ...prev,
            { id: crypto.randomUUID(), descricao: '', quantidade: 1, valor_unitario: 0 }
        ])
    }

    function removerItem(id: string) {
        if (itens.length === 1) return
        setItens(prev => prev.filter(item => item.id !== id))
    }

    function atualizarItem(id: string, campo: keyof Omit<ItemVenda, 'id'>, valor: string) {
        setItens(prev => prev.map(item => {
            if (item.id !== id) return item
            return {
                ...item,
                [campo]: campo === 'descricao' ? valor : Number(valor)
            }
        }))
    }

    // ── Submissão ─────────────────────────────────────────────────────────────
    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setErro(null)

        if (!clienteSelecionado) {
            setErro('Selecione um cliente da lista.')
            return
        }

        const itensValidos = itens.filter(i =>
            i.descricao.trim() !== '' && i.quantidade > 0 && i.valor_unitario > 0
        )

        if (itensValidos.length === 0) {
            setErro('Adicione ao menos um produto com descrição, quantidade e valor.')
            return
        }

        if (total <= 0) {
            setErro('O valor total da venda deve ser maior que zero.')
            return
        }

        setSalvando(true)
        try {
            await api.post('/vendas', {
                cliente_id: clienteSelecionado.id,
                data_compra: dataCompra,
                data_vencimento: dataVencimento || undefined,
                observacao: observacao.trim() || undefined,
                itens: itensValidos.map(({ descricao, quantidade, valor_unitario }) => ({
                    descricao,
                    quantidade,
                    valor_unitario
                }))
            })
            navigate('/home')
        } catch (err: any) {
            setErro(err.response?.data?.erro || 'Erro ao salvar venda.')
        } finally {
            setSalvando(false)
        }
    }

    // ── Render ────────────────────────────────────────────────────────────────
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
                <form onSubmit={handleSubmit} className="w-full flex justify-center">
                    <GenericContainer className="w-6xl rounded-2xl bg-[#181829] gap-5">

                        <h1 className="text-3xl font-bold">Registrar nova venda</h1>

                        {erro && (
                            <Alert severity="error" onClose={() => setErro(null)}>
                                {erro}
                            </Alert>
                        )}

                        {/* ── CLIENTE ── */}
                        <InputField>
                            <span className="font-bold text-xl">CLIENTE</span>
                            <span className="secondary-text">Buscar cliente já cadastrado:</span>

                            <div className="relative" ref={dropdownRef}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Digite o nome do cliente..."
                                    value={buscaCliente}
                                    onChange={e => {
                                        setBuscaCliente(e.target.value)
                                        if (clienteSelecionado) limparCliente()
                                    }}
                                    disabled={salvando}
                                    slotProps={{
                                        endAdornment: buscandoClientes
                                            ? <CircularProgress size={18} color="inherit" />
                                            : clienteSelecionado
                                                ? (
                                                    <button
                                                        type="button"
                                                        onClick={limparCliente}
                                                        className="text-zinc-400 hover:text-white text-xs px-2"
                                                    >
                                                        ✕ trocar
                                                    </button>
                                                )
                                                : null
                                    }}
                                />

                                {/* Dropdown de sugestões */}
                                {sugestoes.length > 0 && (
                                    <div className="absolute z-50 w-full mt-1 rounded-xl border border-zinc-700 bg-[#1f2028] shadow-xl overflow-hidden">
                                        {sugestoes.map(c => (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => selecionarCliente(c)}
                                                className="w-full text-left px-4 py-3 hover:bg-[#2a2a3a] transition-colors border-b border-zinc-700 last:border-0"
                                            >
                                                <span className="font-semibold text-white">
                                                    {c.nome} {c.sobrenome}
                                                </span>
                                                {c.referencia && (
                                                    <span className="text-sm secondary-text ml-2">
                                                        — {c.referencia}
                                                    </span>
                                                )}
                                                {c.telefone && (
                                                    <span className="text-xs secondary-text block">
                                                        {c.telefone}
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Badge de cliente selecionado */}
                                {clienteSelecionado && (
                                    <div className="mt-2 px-3 py-2 rounded-lg bg-[#2a2a3a] border border-zinc-600 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#E8624A]" />
                                        <span className="text-sm text-white font-medium">
                                            {clienteSelecionado.nome} {clienteSelecionado.sobrenome}
                                        </span>
                                        {clienteSelecionado.referencia && (
                                            <span className="text-xs secondary-text">
                                                · {clienteSelecionado.referencia}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </InputField>

                        <hr className="border-zinc-700" />

                        {/* ── DATAS ── */}
                        <div className="flex gap-4">
                            <InputField className="flex-1">
                                <span className="font-bold">Data da compra</span>
                                <TextField
                                    type="date"
                                    fullWidth
                                    variant="outlined"
                                    value={dataCompra}
                                    onChange={e => setDataCompra(e.target.value)}
                                    disabled={salvando}
                                />
                            </InputField>
                            <InputField className="flex-1">
                                <span className="font-bold">Vencimento <span className="secondary-text font-normal">(opcional)</span></span>
                                <TextField
                                    type="date"
                                    fullWidth
                                    variant="outlined"
                                    value={dataVencimento}
                                    onChange={e => setDataVencimento(e.target.value)}
                                    disabled={salvando}
                                />
                            </InputField>
                        </div>

                        <hr className="border-zinc-700" />

                        {/* ── PRODUTOS ── */}
                        <InputField>
                            <span className="font-bold text-xl">PRODUTOS</span>

                            <div className="flex flex-col gap-3">
                                {/* Cabeçalho da tabela */}
                                <div className="grid grid-cols-[1fr_100px_130px_40px] gap-3 px-1">
                                    <span className="text-sm secondary-text font-semibold">Descrição</span>
                                    <span className="text-sm secondary-text font-semibold text-center">Qtd.</span>
                                    <span className="text-sm secondary-text font-semibold text-right">Valor unit. (R$)</span>
                                    <span />
                                </div>

                                {/* Linhas de itens */}
                                {itens.map((item, idx) => (
                                    <div key={item.id} className="grid grid-cols-[1fr_100px_130px_40px] gap-3 items-center">
                                        <TextField
                                            variant="outlined"
                                            fullWidth
                                            placeholder={`Produto ${idx + 1}`}
                                            value={item.descricao}
                                            onChange={e => atualizarItem(item.id, 'descricao', e.target.value)}
                                            disabled={salvando}
                                        />
                                        <TextField
                                            variant="outlined"
                                            type="number"
                                            slotProps={{ min: 1 }}
                                            value={item.quantidade}
                                            onChange={e => atualizarItem(item.id, 'quantidade', e.target.value)}
                                            disabled={salvando}
                                        />
                                        <TextField
                                            variant="outlined"
                                            type="number"
                                            slotProps={{ min: 0, step: '0.01' }}
                                            value={item.valor_unitario === 0 ? '' : item.valor_unitario}
                                            placeholder="0,00"
                                            onChange={e => atualizarItem(item.id, 'valor_unitario', e.target.value)}
                                            disabled={salvando}
                                        />
                                        <IconButton
                                            onClick={() => removerItem(item.id)}
                                            disabled={itens.length === 1 || salvando}
                                            sx={{ color: '#E8624A', '&:disabled': { color: '#444' } }}
                                        >
                                            <FontAwesomeIcon icon={faTrash} size="sm" />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>

                            <Button
                                type="button"
                                variant="contained"
                                color="secondary"
                                startIcon={<FontAwesomeIcon icon={faPlus} />}
                                onClick={adicionarItem}
                                disabled={salvando}
                                sx={{ alignSelf: 'flex-start', border: '1px solid #2e2e3a' }}
                            >
                                <span className="font-bold">Adicionar produto</span>
                            </Button>
                        </InputField>

                        <hr className="border-zinc-700" />

                        {/* ── TOTAL ── */}
                        <div className="flex items-center primary-text text-2xl font-bold gap-2">
                            <span>Total gerado:</span>
                            <span>
                                R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>

                        {/* ── OBSERVAÇÕES ── */}
                        <InputField>
                            <span className="font-bold">Observações <span className="secondary-text font-normal">(opcional)</span></span>
                            <textarea
                                rows={4}
                                placeholder="Ex: Entregue em casa, combinou pagar na sexta..."
                                value={observacao}
                                onChange={e => setObservacao(e.target.value)}
                                disabled={salvando}
                                style={{
                                    background: '#13131A',
                                    border: '1px solid #2e2e3a',
                                    borderRadius: '10px',
                                    color: '#fff',
                                    padding: '12px 14px',
                                    fontSize: '14px',
                                    resize: 'vertical',
                                    outline: 'none',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    fontFamily: 'inherit',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={e => e.target.style.borderColor = '#E8624A'}
                                onBlur={e => e.target.style.borderColor = '#2e2e3a'}
                            />
                        </InputField>

                        {/* ── SALVAR ── */}
                        <div className="flex items-center justify-end">
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={salvando}
                                startIcon={
                                    salvando
                                        ? <CircularProgress size={16} color="inherit" />
                                        : <FontAwesomeIcon icon={faFloppyDisk} />
                                }
                            >
                                <span className="font-bold">
                                    {salvando ? 'Salvando...' : 'Salvar venda'}
                                </span>
                            </Button>
                        </div>

                    </GenericContainer>
                </form>
            </PageContainer>
        </>
    )
}

export default NovaVenda