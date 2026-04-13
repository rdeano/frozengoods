import { Head, useForm } from '@inertiajs/react';
import StorefrontLayout from '../../Layouts/StorefrontLayout';
import { useCart } from '../../Contexts/CartContext';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import { Link } from '@inertiajs/react';

export default function Checkout({ deliveryFee, allowDelivery, allowPickup, deliveryAreas }) {
    const { items, total, clearCart } = useCart();

    const { data, setData, post, processing, errors } = useForm({
        customer_name:    '',
        customer_phone:   '',
        customer_address: '',
        delivery_type:    allowDelivery ? 'delivery' : 'pickup',
        notes:            '',
        website:          '',
        items:            items.map(i => ({ product_id: i.product_id, qty: i.qty })),
    });

    const fee = data.delivery_type === 'delivery' ? deliveryFee : 0;
    const grandTotal = total + fee;

    const submit = (e) => {
        e.preventDefault();
        post('/checkout', { onSuccess: () => clearCart() });
    };

    if (items.length === 0) {
        return (
            <StorefrontLayout>
                <Head title="Checkout" />
                <Container maxWidth="sm" sx={{ py: 6, textAlign: 'center' }}>
                    <Typography variant="h2" sx={{ mb: 1 }}>Your cart is empty</Typography>
                    <Typography sx={{ color: '#8A94A6', mb: 3 }}>Add some items before checking out.</Typography>
                    <Button component={Link} href="/products" variant="contained"
                        sx={{ bgcolor: '#FF6B35', fontWeight: 600, px: 4, '&:hover': { bgcolor: '#e55a26' } }}>
                        Browse products
                    </Button>
                </Container>
            </StorefrontLayout>
        );
    }

    return (
        <StorefrontLayout>
            <Head title="Checkout" />

            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#8A94A6', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 0.75 }}>
                    Almost there
                </Typography>
                <Typography variant="h1" sx={{ mb: { xs: 3, md: 4 } }}>Checkout</Typography>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 3, md: 4 }} alignItems="flex-start">

                    {/* Order summary — appears first on mobile */}
                    <Box sx={{
                        width: { xs: '100%', md: 300 }, flexShrink: 0,
                        bgcolor: '#fff', borderRadius: '12px',
                        border: '0.5px solid #E8ECF2', overflow: 'hidden',
                        order: { xs: -1, md: 1 },
                    }}>
                        <Box sx={{ px: 3, py: 2, bgcolor: '#F5F7FA', borderBottom: '0.5px solid #E8ECF2' }}>
                            <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#8A94A6', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Order summary
                            </Typography>
                        </Box>
                        <Stack spacing={0} sx={{ px: 3, py: 2 }} divider={<Divider sx={{ my: 1 }} />}>
                            {items.map(item => (
                                <Stack key={item.product_id} direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                                    <Typography sx={{ fontSize: 13, color: '#3D4A5C', flex: 1, lineHeight: 1.4 }}>
                                        {item.product_name}
                                        <Typography component="span" sx={{ color: '#8A94A6', fontSize: 12 }}> ×{item.qty}</Typography>
                                    </Typography>
                                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#3D4A5C', flexShrink: 0 }}>
                                        ₱{(item.unit_price * item.qty).toFixed(2)}
                                    </Typography>
                                </Stack>
                            ))}
                            {fee > 0 && (
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography sx={{ fontSize: 13, color: '#8A94A6' }}>Delivery fee</Typography>
                                    <Typography sx={{ fontSize: 13, color: '#8A94A6' }}>₱{fee.toFixed(2)}</Typography>
                                </Stack>
                            )}
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography sx={{ fontWeight: 800, fontSize: 15 }}>Total</Typography>
                                <Typography sx={{ fontWeight: 800, fontSize: 18, color: '#0B3D91' }}>
                                    ₱{grandTotal.toFixed(2)}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Box>

                    {/* Form */}
                    <Box component="form" onSubmit={submit} sx={{ flex: 1, order: { xs: 1, md: 0 } }}>
                        {/* Honeypot */}
                        <input type="text" name="website" value={data.website}
                            onChange={e => setData('website', e.target.value)}
                            style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                        <Stack spacing={2}>
                            <TextField
                                label="Full name"
                                value={data.customer_name}
                                onChange={e => setData('customer_name', e.target.value)}
                                error={!!errors.customer_name}
                                helperText={errors.customer_name}
                                fullWidth required
                                InputProps={{ sx: { bgcolor: '#fff' } }}
                            />
                            <TextField
                                label="Phone number"
                                value={data.customer_phone}
                                onChange={e => setData('customer_phone', e.target.value)}
                                error={!!errors.customer_phone}
                                helperText={errors.customer_phone}
                                fullWidth required
                                InputProps={{ sx: { bgcolor: '#fff' } }}
                            />
                            <TextField
                                label="Delivery address"
                                value={data.customer_address}
                                onChange={e => setData('customer_address', e.target.value)}
                                error={!!errors.customer_address}
                                helperText={errors.customer_address}
                                fullWidth required multiline rows={2}
                                InputProps={{ sx: { bgcolor: '#fff' } }}
                            />

                            {/* Delivery / Pickup */}
                            {allowDelivery && allowPickup && (
                                <Box>
                                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#3D4A5C', mb: 1 }}>
                                        Delivery option
                                    </Typography>
                                    <ToggleButtonGroup
                                        value={data.delivery_type}
                                        exclusive
                                        onChange={(_, val) => val && setData('delivery_type', val)}
                                        fullWidth
                                        sx={{ '& .MuiToggleButton-root': { py: 1.5, fontWeight: 600, fontSize: 14 } }}
                                    >
                                        <ToggleButton value="delivery">Delivery (+₱{deliveryFee})</ToggleButton>
                                        <ToggleButton value="pickup">Pickup (free)</ToggleButton>
                                    </ToggleButtonGroup>
                                    {data.delivery_type === 'delivery' && deliveryAreas && (
                                        <Typography sx={{ fontSize: 12, color: '#8A94A6', mt: 1 }}>{deliveryAreas}</Typography>
                                    )}
                                </Box>
                            )}

                            <TextField
                                label="Notes (optional)"
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                                fullWidth multiline rows={2}
                                InputProps={{ sx: { bgcolor: '#fff' } }}
                            />

                            <Alert severity="info" sx={{ fontSize: 13 }}>
                                After placing your order, you'll be asked to message us on Facebook Messenger to confirm payment and arrange delivery.
                            </Alert>

                            <Button type="submit" variant="contained" fullWidth disabled={processing}
                                sx={{ bgcolor: '#FF6B35', fontSize: 15, fontWeight: 700, py: 1.75, '&:hover': { bgcolor: '#e55a26' } }}>
                                {processing ? 'Placing order…' : `Place Order · ₱${grandTotal.toFixed(2)}`}
                            </Button>
                        </Stack>
                    </Box>
                </Stack>
            </Container>
        </StorefrontLayout>
    );
}
