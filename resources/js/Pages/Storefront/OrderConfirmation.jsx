import { Head } from '@inertiajs/react';
import StorefrontLayout from '../../Layouts/StorefrontLayout';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import { CheckCircleOutlined as CheckCircleOutlineIcon } from '@mui/icons-material';
import StatusBadge from '../../Components/StatusBadge';

export default function OrderConfirmation({ order, fbPageUsername, fbPageId }) {
    const messengerUrl = fbPageUsername
        ? `https://m.me/${fbPageUsername}?text=${encodeURIComponent(
            `Hi! I just placed Order #${order.id} on your website.`
        )}`
        : null;

    return (
        <StorefrontLayout>
            <Head title={`Order #${order.id} Confirmed`} />

            <Container maxWidth="sm" sx={{ py: { xs: 4, md: 6 } }}>

                {/* Success header */}
                <Stack alignItems="center" spacing={1.5} sx={{ mb: 4, textAlign: 'center' }}>
                    <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#E8F8F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircleOutlineIcon sx={{ fontSize: 36, color: '#1D9E75' }} />
                    </Box>
                    <Typography variant="h1" sx={{ color: '#1D9E75', fontSize: { xs: 22, md: 26 } }}>Order placed!</Typography>
                    <Typography sx={{ color: '#3D4A5C', fontSize: 15 }}>
                        Your order <strong>#{order.id}</strong> has been received.
                    </Typography>
                    <StatusBadge status={order.status} />
                </Stack>

                {/* Contact prompt */}
                <Box sx={{
                    bgcolor: '#fff',
                    border: '0.5px solid #E8ECF2',
                    borderRadius: '12px',
                    p: { xs: 2.5, md: 3 },
                    mb: 2.5,
                }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#3D4A5C', mb: 0.75 }}>Next step</Typography>
                    <Typography sx={{ fontSize: 14, color: '#8A94A6', mb: 2.5, lineHeight: 1.6 }}>
                        Message us on Messenger to confirm your payment and arrange delivery or pickup.
                    </Typography>

                    {messengerUrl ? (
                        <Stack spacing={1.5}>
                            <Button
                                href={messengerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="contained"
                                fullWidth
                                sx={{
                                    background: '#1877F2',
                                    fontSize: 15,
                                    fontWeight: 600,
                                    py: 1.5,
                                    '&:hover': { background: '#1464d8' },
                                }}
                            >
                                Message us on Messenger
                            </Button>
                            {fbPageId && (
                                <Typography sx={{ fontSize: 12, color: '#8A94A6', textAlign: 'center' }}>
                                    You can also use the chat bubble at the bottom-right corner.
                                </Typography>
                            )}
                        </Stack>
                    ) : fbPageId ? (
                        <Alert severity="info" sx={{ fontSize: 13 }}>
                            Use the chat bubble at the bottom-right corner of this page to message us on Messenger.
                        </Alert>
                    ) : (
                        <Alert severity="info" sx={{ fontSize: 13 }}>
                            Please contact us directly to confirm your order and arrange payment.
                        </Alert>
                    )}
                </Box>

                {/* Order details */}
                <Box sx={{
                    bgcolor: '#fff',
                    border: '0.5px solid #E8ECF2',
                    borderRadius: '12px',
                    overflow: 'hidden',
                }}>
                    <Box sx={{ px: 3, py: 2, bgcolor: '#F5F7FA', borderBottom: '0.5px solid #E8ECF2' }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#8A94A6', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Order summary
                        </Typography>
                    </Box>
                    <Stack spacing={0} sx={{ px: 3, py: 2 }} divider={<Divider sx={{ my: 1 }} />}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography sx={{ fontSize: 13, color: '#8A94A6' }}>Name</Typography>
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#3D4A5C' }}>{order.customer_name}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography sx={{ fontSize: 13, color: '#8A94A6' }}>Phone</Typography>
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#3D4A5C' }}>{order.customer_phone}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography sx={{ fontSize: 13, color: '#8A94A6' }}>Type</Typography>
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#3D4A5C', textTransform: 'capitalize' }}>
                                {order.delivery_type}
                            </Typography>
                        </Stack>
                        {order.items?.map(item => (
                            <Stack key={item.id} direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                                <Typography sx={{ fontSize: 13, color: '#3D4A5C', flex: 1, lineHeight: 1.4 }}>
                                    {item.product_name}
                                    <Typography component="span" sx={{ color: '#8A94A6', fontSize: 12 }}> ×{item.qty}</Typography>
                                </Typography>
                                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#3D4A5C', flexShrink: 0 }}>
                                    ₱{parseFloat(item.subtotal).toFixed(2)}
                                </Typography>
                            </Stack>
                        ))}
                        {parseFloat(order.delivery_fee) > 0 && (
                            <Stack direction="row" justifyContent="space-between">
                                <Typography sx={{ fontSize: 13, color: '#8A94A6' }}>Delivery fee</Typography>
                                <Typography sx={{ fontSize: 13, color: '#8A94A6' }}>₱{parseFloat(order.delivery_fee).toFixed(2)}</Typography>
                            </Stack>
                        )}
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography sx={{ fontWeight: 800, fontSize: 15 }}>Total</Typography>
                            <Typography sx={{ fontWeight: 800, fontSize: 18, color: '#0B3D91' }}>
                                ₱{parseFloat(order.total).toFixed(2)}
                            </Typography>
                        </Stack>
                    </Stack>
                </Box>

            </Container>
        </StorefrontLayout>
    );
}
