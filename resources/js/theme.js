import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main:         '#0B3D91',
            light:        '#1A56C4',
            dark:         '#072B6B',
            contrastText: '#ffffff',
        },
        secondary: {
            main:         '#00C2D4',
            light:        '#E0F9FB',
            dark:         '#007A87',
            contrastText: '#072B6B',
        },
        error:   { main: '#E24B4A' },
        warning: { main: '#BA7517' },
        success: { main: '#1D9E75' },
        background: {
            default: '#F5F7FA',
            paper:   '#FFFFFF',
        },
        text: {
            primary:   '#3D4A5C',
            secondary: '#8A94A6',
        },
    },
    typography: {
        fontFamily: 'Inter, Roboto, system-ui, sans-serif',
        h1: { fontSize: '24px', fontWeight: 700, color: '#0B3D91', lineHeight: 1.3 },
        h2: { fontSize: '18px', fontWeight: 600, color: '#3D4A5C', lineHeight: 1.3 },
        h3: { fontSize: '15px', fontWeight: 600, color: '#3D4A5C', lineHeight: 1.3 },
        body1: { fontSize: '14px', fontWeight: 400, lineHeight: 1.6 },
        body2: { fontSize: '12px', fontWeight: 400, color: '#8A94A6', lineHeight: 1.6 },
        caption: { fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' },
    },
    shape: {
        borderRadius: 10,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: '10px',
                    boxShadow: 'none',
                    '&:hover': { boxShadow: 'none' },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    border: '0.5px solid #E8ECF2',
                    boxShadow: 'none',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: { boxShadow: 'none' },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: { borderRadius: '9999px', fontWeight: 500, lineHeight: 1 },
            },
        },
        MuiTextField: {
            defaultProps: { size: 'small' },
            styleOverrides: {
                root: { borderRadius: '10px' },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                    fontSize: '12px',
                    color: '#8A94A6',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    backgroundColor: '#F5F7FA',
                },
            },
        },
    },
});

export default theme;
