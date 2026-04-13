import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '../../Layouts/StorefrontLayout';
import { useCart } from '../../Contexts/CartContext';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { DeleteOutlined as DeleteIcon } from '@mui/icons-material';

export default function Cart() {
    const { items, updateQty, removeFromCart, total } = useCart();

    return (
        <StorefrontLayout>
            <Head title="Cart" />

            <Container maxWidth="lg" sx={{ py: 5 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#8A94A6', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 0.75 }}>
                    Your order
                </Typography>
                <Typography variant="h1" sx={{ mb: 4 }}>Shopping Cart</Typography>

                {items.length === 0 ? (
                    <Box sx={{
                        bgcolor: '#fff', borderRadius: '12px',
                        border: '0.5px solid #E8ECF2',
                        py: 10, textAlign: 'center',
                    }}>
                        <Typography sx={{ fontSize: 15, color: '#8A94A6', mb: 3 }}>
                            Your cart is empty.
                        </Typography>
                        <Button
                            component={Link}
                            href="/products"
                            variant="contained"
                            sx={{ bgcolor: '#FF6B35', fontWeight: 600, px: 4, '&:hover': { bgcolor: '#e55a26' } }}
                        >
                            Browse products
                        </Button>
                    </Box>
                ) : (
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">

                        {/* Items list */}
                        <Box sx={{ flex: 1, bgcolor: '#fff', borderRadius: '12px', border: '0.5px solid #E8ECF2', overflow: 'hidden' }}>
                            {/* Header */}
                            <Box sx={{ px: 3, py: 2, bgcolor: '#F5F7FA', borderBottom: '0.5px solid #E8ECF2' }}>
                                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#8A94A6', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    {items.length} {items.length === 1 ? 'item' : 'items'}
                                </Typography>
                            </Box>

                            <Stack divider={<Divider />}>
                                {items.map(item => (
                                    <Box key={item.product_id} sx={{ px: 3, py: 2.5 }}>
                                        {/* Top row: thumbnail + name + remove */}
                                        <Stack direction="row" spacing={2} alignItems="flex-start">
                                            {/* Thumbnail */}
                                            <Box sx={{
                                                width: 64, height: 64, borderRadius: '8px',
                                                overflow: 'hidden', flexShrink: 0,
                                                border: '0.5px solid #E8ECF2',
                                                bgcolor: '#F5F7FA',
                                            }}>
                                                {item.image_url ? (
                                                    <Box
                                                        component="img"
                                                        src={item.image_url}
                                                        alt={item.product_name}
                                                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <Box sx={{ width: '100%', height: '100%', bgcolor: '#E8ECF2' }} />
                                                )}
                                            </Box>

                                            {/* Name + unit price */}
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#3D4A5C', mb: 0.25, lineHeight: 1.4, wordBreak: 'break-word' }}>
                                                    {item.product_name}
                                                </Typography>
                                                <Typography sx={{ fontSize: 13, color: '#8A94A6' }}>
                                                    ₱{item.unit_price} each
                                                </Typography>
                                            </Box>

                                            {/* Remove — always visible */}
                                            <IconButton
                                                size="small"
                                                onClick={() => removeFromCart(item.product_id)}
                                                sx={{ color: '#8A94A6', flexShrink: 0, '&:hover': { color: '#E24B4A', bgcolor: '#FCEBEB' } }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>

                                        {/* Bottom row: qty + subtotal */}
                                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1.5, pl: { xs: 0, sm: '80px' } }}>
                                            <TextField
                                                type="number"
                                                value={item.qty}
                                                onChange={e => updateQty(item.product_id, parseInt(e.target.value) || 0)}
                                                inputProps={{ min: 1 }}
                                                size="small"
                                                sx={{ width: 80, '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                                            />
                                            <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#0B3D91' }}>
                                                ₱{(item.unit_price * item.qty).toFixed(2)}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>

                        {/* Order summary */}
                        <Box sx={{
                            width: { xs: '100%', md: 300 },
                            bgcolor: '#fff',
                            borderRadius: '12px',
                            border: '0.5px solid #E8ECF2',
                            overflow: 'hidden',
                            flexShrink: 0,
                        }}>
                            <Box sx={{ px: 3, py: 2, bgcolor: '#F5F7FA', borderBottom: '0.5px solid #E8ECF2' }}>
                                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#8A94A6', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    Order summary
                                </Typography>
                            </Box>

                            <Stack spacing={0} sx={{ px: 3, py: 2.5 }} divider={<Divider sx={{ my: 1.5 }} />}>
                                {items.map(item => (
                                    <Stack key={item.product_id} direction="row" justifyContent="space-between">
                                        <Typography sx={{ fontSize: 13, color: '#3D4A5C', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.product_name} ×{item.qty}
                                        </Typography>
                                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#3D4A5C', flexShrink: 0, ml: 1 }}>
                                            ₱{(item.unit_price * item.qty).toFixed(2)}
                                        </Typography>
                                    </Stack>
                                ))}
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography sx={{ fontSize: 15, fontWeight: 800, color: '#3D4A5C' }}>Total</Typography>
                                    <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#0B3D91' }}>
                                        ₱{total.toFixed(2)}
                                    </Typography>
                                </Stack>
                            </Stack>

                            <Box sx={{ px: 3, pb: 3 }}>
                                <Button
                                    component={Link}
                                    href="/checkout"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        bgcolor: '#FF6B35',
                                        fontSize: 15, fontWeight: 700,
                                        py: 1.5,
                                        '&:hover': { bgcolor: '#e55a26' },
                                    }}
                                >
                                    Proceed to checkout
                                </Button>
                                <Button
                                    component={Link}
                                    href="/products"
                                    fullWidth
                                    sx={{ mt: 1, color: '#8A94A6', fontSize: 13 }}
                                >
                                    Continue shopping
                                </Button>
                            </Box>
                        </Box>

                    </Stack>
                )}
            </Container>
        </StorefrontLayout>
    );
}
