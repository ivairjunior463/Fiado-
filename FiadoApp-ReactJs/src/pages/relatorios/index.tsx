
import { Link } from "react-router-dom"
import TextField from "@mui/material/TextField"
import { InputField } from "../../components/Inputs"
import { GenericContainer, PageContainer } from "../../components/Containers"
import { Header } from "../../components/General"
import MenuItem from "@mui/material/MenuItem"
import Select from '@mui/material/Select'
import Button from "@mui/material/Button"

function Configuracoes() {
    return (
        <>
            <Header />
            <PageContainer className='text-white'>
                <GenericContainer className='w-6xl rounded-2xl bg-[#181829] gap-3'>
                    <div className="flex flex-col gap-1">
                        <h1 className="font-bold text-xl">Relatorios</h1>
                        <span>Filtre e exporte suas vendas</span>
                    </div>

                    <div className='grid grid-cols-2 gap-3'>
                        <InputField>
                            <span>Data inicial</span>
                            <TextField type="date" />
                        </InputField>
                        <InputField>
                            <span>Data final</span>
                            <TextField type="date" />
                        </InputField>
                        <InputField>
                            <span>Status</span>
                            <Select
                                variant="outlined"
                                fullWidth
                            >
                                <MenuItem value='todos'>Todos</MenuItem>
                                <MenuItem value='ativos'>Ativos</MenuItem>
                                <MenuItem value='pagos'>Pagos</MenuItem>
                            </Select>
                        </InputField>
                        <InputField>
                            <span>Inicial do cliente</span>
                            <TextField placeholder="A-Z" />
                        </InputField>
                        <InputField>
                            <span>Buscar cliente específico:</span>
                            <TextField placeholder='Digite o nome do cliente' />
                        </InputField>
                    </div>
                    <Button variant="contained" color="primary">
                        <span>Buscar</span>
                    </Button>

                    <hr />

                    <div className="flex items-center justify-start">
                        <Button
                            component={Link}
                            to='/home'
                            variant="contained"
                            color="secondary"
                        >
                            <span className="">Voltar</span>
                        </Button>
                    </div>
                </GenericContainer>
            </PageContainer>
        </>
    )
}

export default Configuracoes
