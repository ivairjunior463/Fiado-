
import { Link } from "react-router-dom"
import TextField from "@mui/material/TextField"
import { InputField } from "../../components/Inputs"
import { GenericContainer, PageContainer } from "../../components/Containers"
import { Header } from "../../components/General"
import MenuItem from "@mui/material/MenuItem"
import Select from '@mui/material/Select'
import Button from "@mui/material/Button"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faGear } from '@fortawesome/free-solid-svg-icons'

function index() {
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
            <PageContainer className='text-white'>
                <GenericContainer className='w-6xl rounded-2xl bg-[#181829] gap-5'>
                    <div>
                        <div className="flex items-center gap-2 text-xl">
                            <FontAwesomeIcon icon={faGear} />
                            <h1>Configurações</h1>
                        </div>
                        <span>Configure limites de crédito e comportamentos padrão.</span>
                    </div>

                    <hr />

                    <div>
                        <h2 className="text-xl">Limite de crédito padrão</h2>
                        <span className="secondary-text">Valor máximo de crédito para novos clientes. Exibido como alerta ao cadastrar uma venda. Deixe em branco para sem limite.</span>
                    </div>

                    <InputField>
                        <span className="secondary-text">Limite padrão</span>
                        <div className="flex items-center gap-5">
                            <TextField placeholder='Ex: 500 (Apenas números)' className="w-[90%]" />
                            <Button
                                variant="contained"
                                color="primary"
                            >
                                <span>Enviar</span>
                            </Button>
                        </div>
                    </InputField>                    
                </GenericContainer>
            </PageContainer>
        </>
    )
}

export default index
