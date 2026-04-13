import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '../../Layouts/StorefrontLayout';
import { useCart } from '../../Contexts/CartContext';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function ProductDetail({ product }) {
    const { addToCart } = useCart();
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addToCart(product, qty);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    return (
        <StorefrontLayout>
            <Head title={product.name} />

            <Container maxWidth="lg" sx={{ py: 5 }}>
                {/* Breadcrumb */}
                <Breadcrumbs
                    separator={<NavigateNextIcon sx={{ fontSize: 14 }} />}
                    sx={{ mb: 4 }}
                >
                    <Link href="/" style={{ fontSize: 13, color: '#8A94A6', textDecoration: 'none' }}>Home</Link>
                    <Link href="/products" style={{ fontSize: 13, color: '#8A94A6', textDecoration: 'none' }}>Products</Link>
                    <Typography sx={{ fontSize: 13, color: '#3D4A5C', fontWeight: 500 }}>{product.name}</Typography>
                </Breadcrumbs>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 3, md: 6 }}>
                    {/* Image */}
                    <Box sx={{
                        width: { xs: '100%', md: 400 },
                        flexShrink: 0,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '0.5px solid #E8ECF2',
                        bgcolor: product.image_url ? 'transparent' : '#E8ECF2',
                        aspectRatio: '4/3',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {product.image_url ? (
                            <Box
                                component="img"
                                src={product.image_url}
                                alt={product.name}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        ) : (
                            <Typography sx={{ fontSize: 13, color: '#8A94A6', fontWeight: 500 }}>No image available</Typography>
                        )}
                    </Box>

                    {/* Info */}
                    <Box sx={{ flex: 1, py: { md: 1 } }}>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#8A94A6', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1 }}>
                            {product.category?.name}
                        </Typography>

                        <Typography sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 800, color: '#3D4A5C', lineHeight: 1.2, mb: 2, letterSpacing: '-0.3px' }}>
                            {product.name}
                        </Typography>

                        <Typography sx={{ fontSize: 28, fontWeight: 800, color: '#0B3D91', mb: 3 }}>
                            ₱{product.price}
                        </Typography>

                        {product.description && (
                            <>
                                <Divider sx={{ mb: 3 }} />
                                <Typography sx={{ fontSize: 14, color: '#3D4A5C', lineHeight: 1.75, mb: 3 }}>
                                    {product.description}
                                </Typography>
                            </>
                        )}

                        <Divider sx={{ mb: 3 }} />

                        {product.is_available ? (
                            <Stack spacing={2}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#3D4A5C', minWidth: 60 }}>
                                        Quantity
                                    </Typography>
                                    <TextField
                                        type="number"
                                        value={qty}
                                        onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                                        inputProps={{ min: 1 }}
                                        size="small"
                                        sx={{ width: 90, '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                                    />
                                </Stack>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleAdd}
                                    sx={{
                                        bgcolor: added ? '#1D9E75' : '#FF6B35',
                                        fontWeight: 700,
                                        fontSize: 15,
                                        py: 1.5,
                                        alignSelf: 'flex-start',
                                        px: 5,
                                        transition: 'background 0.2s',
                                        '&:hover': { bgcolor: added ? '#1D9E75' : '#e55a26' },
                                    }}
                                >
                                    {added ? 'Added to cart ✓' : 'Add to cart'}
                                </Button>
                            </Stack>
                        ) : (
                            <Box sx={{
                                display: 'inline-flex',
                                bgcolor: '#FCEBEB',
                                borderRadius: '8px',
                                px: 2, py: 1,
                            }}>
                                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#A32D2D' }}>
                                    Currently out of stock
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Stack>
            </Container>
        </StorefrontLayout>
    );
}
