
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import logo from '../assets/images/fiadoapp_logo.png'
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom'

export function Header({ className }) {

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }

    return (
        <header className={`flex justify-between items-center px-6 py-4 text-white secondary-background ${className}`}>
            <div className='flex items-center gap-2 font-bold'>
                <img src={logo} alt="Logotipo FiadoApp" className='w-7.5' />
                <span>FiadoApp</span>
            </div>
            <div className='flex items-center gap-3'>
                <Button
                    onClick={handleLogout}
                    component={Link}
                    to='/'
                    variant="contained"
                    color="primary"
                >
                    <LogoutIcon />
                    <span>Sair</span>
                </Button>
            </div>
        </header>
    )
}
