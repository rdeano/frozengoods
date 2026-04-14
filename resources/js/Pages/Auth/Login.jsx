import { Head, useForm } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    Link,
    TextField,
    Typography,
} from '@mui/material';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: '#F5F7FA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
            }}
        >
            <Head title="Admin Login" />

            <Box
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    background: '#fff',
                    borderRadius: '16px',
                    border: '0.5px solid #E8ECF2',
                    p: { xs: 3, sm: 4 },
                }}
            >
                {/* Brand */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography
                        sx={{
                            fontSize: 22,
                            fontWeight: 700,
                            color: '#0B3D91',
                            letterSpacing: '-0.01em',
                            mb: 0.5,
                        }}
                    >
                        🧊 FrozenGoods
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: 11,
                            fontWeight: 500,
                            color: '#8A94A6',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Admin Panel
                    </Typography>
                </Box>

                {/* Status message (e.g. password reset link sent) */}
                {status && (
                    <Alert severity="success" sx={{ mb: 3, borderRadius: '10px' }}>
                        {status}
                    </Alert>
                )}

                <form onSubmit={submit} noValidate>
                    <TextField
                        label="Email address"
                        type="email"
                        id="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        autoComplete="username"
                        autoFocus
                        fullWidth
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        label="Password"
                        type="password"
                        id="password"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="current-password"
                        fullWidth
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                        sx={{ mb: 1 }}
                    />

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 3,
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                    sx={{
                                        color: '#8A94A6',
                                        '&.Mui-checked': { color: '#0B3D91' },
                                    }}
                                />
                            }
                            label={
                                <Typography sx={{ fontSize: 13, color: '#3D4A5C' }}>
                                    Remember me
                                </Typography>
                            }
                        />

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                underline="hover"
                                sx={{
                                    fontSize: 13,
                                    color: '#0B3D91',
                                    cursor: 'pointer',
                                }}
                            >
                                Forgot password?
                            </Link>
                        )}
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={processing}
                        sx={{
                            background: '#0B3D91',
                            fontSize: 14,
                            fontWeight: 600,
                            py: 1.25,
                            '&:hover': { background: '#072B6B' },
                            '&.Mui-disabled': {
                                background: '#E8ECF2',
                                color: '#8A94A6',
                            },
                        }}
                    >
                        {processing ? (
                            <CircularProgress size={18} sx={{ color: '#8A94A6' }} />
                        ) : (
                            'Sign in'
                        )}
                    </Button>
                </form>

                <Typography
                    sx={{
                        mt: 3,
                        textAlign: 'center',
                        fontSize: 12,
                        color: '#8A94A6',
                    }}
                >
                    Admin access only
                </Typography>
            </Box>
        </Box>
    );
}
