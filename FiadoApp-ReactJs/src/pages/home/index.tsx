import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { PageContainer, GenericContainer } from "../../components/Containers"
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faClipboard,
    faMagnifyingGlass,
    faChartLine,
    faChartColumn,
} from '@fortawesome/free-solid-svg-icons'

import PaidIcon from '@mui/icons-material/Paid'
import ReportProblem from '@mui/icons-material/ReportProblem'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import AddIcon from '@mui/icons-material/Add'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'

import { Header } from '../../components/General'
import api from '../../services/api'

function Home() {

    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        async function load() {

            try {
                const response = await api.get('/dashboard')
                setData(response.data)

            } catch (err) {
                console.error('Erro ao carregar dashboard:', err)
            } finally {
                setLoading(false)
            }
        }

        load()

    }, [])

    return (
        <>
            <Header />

            <PageContainer className='text-white'>

                <GenericContainer className='w-6xl rounded-2xl bg-[#181829]'>

                    {/* HEADER */}
                    <div className="flex flex-col gap-2 mb-2">

                        <div className="flex gap-1 text-2xl">
                            <span>Olá,</span>
                            <span className='primary-text font-bold'>
                                Usuário
                            </span>
                        </div>

                        <p className="secondary-text">
                            Gerencie suas vendas e acompanhe seus recebimentos.
                        </p>

                    </div>

                    <hr />

                    {/* CARDS */}
                    <div className='flex flex-col gap-3 my-3'>

                        <CardLine>

                            <PersonalTopCard
                                icon={<PaidIcon fontSize='small' />}
                                title='A receber'
                                data_display={
                                    loading
                                        ? '...'
                                        : `R$ ${data?.total_receber ?? 0}`
                                }
                                sub_label='Saldo em aberto'
                                // route='/relatorios'
                                route='/analytics'
                            />

                            <PersonalTopCard
                                icon={<FontAwesomeIcon icon={faClipboard} />}
                                title='Vendas ativas'
                                data_display={
                                    loading
                                        ? '...'
                                        : data?.total_ativas ?? 0
                                }
                                sub_label='Em andamento'
                                route='/clientes'
                            />

                        </CardLine>

                        <CardLine>

                            <PersonalTopCard
                                icon={<ReportProblem />}
                                title='Inadimplentes'
                                data_display={
                                    loading
                                        ? '...'
                                        : data?.total_inadimplentes ?? 0
                                }
                                sub_label='Vencidos sem pagar'
                                route='/clientes'
                                state={{ initialFilter: 'debt' }}
                            />

                            <PersonalTopCard
                                icon={<PeopleAltIcon />}
                                title='Clientes'
                                data_display={
                                    loading
                                        ? '...'
                                        : data?.total_clientes ?? 0
                                }
                                sub_label='Cadastrados'
                                route='/clientes'
                            />

                        </CardLine>

                        <hr />

                        <div className='grid grid-cols-2 gap-3'>

                            <PersonalBottomCard
                                icon={<AddIcon color='primary' />}
                                title='Nova venda'
                                sub_label='Registrar venda fiado'
                                iconClassName='bg-[rgba(232,98,74,0.40)]'
                                route='/nova-venda'
                            />

                            <PersonalBottomCard
                                icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
                                title='Consultar Clientes'
                                sub_label='Buscar e quitar clientes'
                                route='/clientes'
                            />

                            {/* <PersonalBottomCard
                                icon={<FontAwesomeIcon icon={faChartColumn} />}
                                title='Relatórios'
                                sub_label='Filtrar e explorar vendas'
                                route='/relatorios'
                            /> */}

                            <PersonalBottomCard
                                icon={<FontAwesomeIcon icon={faChartLine} />}
                                title='Analytics'
                                sub_label='Gráficos e insights'
                                route='/analytics'
                            />

                            <PersonalBottomCard
                                icon={<PersonAddAltIcon />}
                                title='Novo cliente'
                                sub_label='Registrar um novo cliente'
                                route='/novo-cliente'
                            />

                        </div>

                    </div>

                </GenericContainer>

            </PageContainer>
        </>
    )
}

/* ===== COMPONENTS ===== */

function CardLine({ children }) {
    return (
        <div className='flex items-center gap-3'>
            {children}
        </div>
    )
}

function PersonalTopCard({
    title,
    icon,
    data_display,
    route,
    sub_label,
    state
}) {
    return (
        <Card
            component={Link}
            to={route}
            state={state}
            sx={{
                flex: 1,
                backgroundColor: '#1E1E2E',
                borderRadius: 3,
                textDecoration: 'none',
                transition: '0.2s',
                '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-2px)',
                    cursor: 'pointer',
                },
            }}
        >
            <CardContent sx={{ padding: 1.5 }}>

                <div className='flex flex-col gap-1'>

                    <div className='flex items-center gap-2'>
                        {icon}
                        <h1 className='secondary-text font-bold text-xl'>
                            {title}
                        </h1>
                    </div>

                    <span className='text-2xl font-bold'>
                        {data_display}
                    </span>

                    <span className='secondary-text'>
                        {sub_label}
                    </span>

                </div>

            </CardContent>
        </Card>
    )
}

function PersonalBottomCard({
    title,
    icon,
    iconClassName = '',
    route,
    sub_label
}) {
    return (
        <Card
            component={Link}
            to={route}
            sx={{
                flex: 1,
                backgroundColor: '#1E1E2E',
                borderRadius: 3,
                textDecoration: 'none',
                transition: '0.2s',
                '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-2px)',
                    cursor: 'pointer',
                },
            }}
        >
            <CardContent sx={{ padding: 1.5 }}>

                <div className='flex items-center gap-3'>

                    <div className={`p-2 rounded-md ${iconClassName}`}>
                        {icon}
                    </div>

                    <div>
                        <h1 className='secondary-text font-bold text-xl'>
                            {title}
                        </h1>
                        <span className='secondary-text'>
                            {sub_label}
                        </span>
                    </div>

                </div>

            </CardContent>
        </Card>
    )
}

export default Home