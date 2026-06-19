import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
    palette: {
        primary: {
            main: '#E8624A',
        },
        secondary: {
            main: '#1E1E2E',
        },
        background: {
            default: '#16171d',
            paper: '#1f2028',
        },
        text: {
            primary: '#FFFF',
            secondary: '#EEEE',
        },
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 10,

                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2e2e3a',
                    },

                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E8624A',
                    },

                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E8624A',
                        borderWidth: 2,
                    },
                },

                input: {
                    padding: '12px 14px',
                    color: '#fff',
                },
            },
        },
        
    },
})