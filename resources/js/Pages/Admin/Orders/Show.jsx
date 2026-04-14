import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import StatusBadge from '../../../Components/StatusBadge';

const STATUSES = ['pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled'];

const STATUS_LABELS = {
    pending:          'Pending',
    confirmed:        'Confirmed',
    out_for_delivery: 'Out for delivery',
    delivered:        'Delivered',
    cancelled:        'Cancelled',
};

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-PH', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true,
    });
}

export default function OrderShow({ order }) {
    const { flash } = usePage().props;
    const [status, setStatus] = useState(order.status);

    const updateStatus = () => {
        router.patch(`/admin/orders/${order.id}/status`, { status });
    };

    return (
        <AdminLayout title={`Order #${order.id}`}>
            <Head title={`Order #${order.id}`} />

            {flash?.success && <Alert severity="success" sx={{ mb: 2 }}>{flash.success}</Alert>}

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                {/* Details */}
                <Box sx={{
                    flex: 1, bgcolor: '#fff', border: '0.5px solid #E8ECF2',
                    borderRadius: '10px', p: 3,
                }}>
                    <Stack spacing={1.5} divider={<Divider />}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2">Order ID</Typography>
                            <Typography sx={{ fontWeight: 600 }}>#{order.id}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2">Date placed</Typography>
                            <Typography sx={{ fontSize: 13 }}>{formatDate(order.created_at)}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2">Status</Typography>
                            <StatusBadge status={order.status} />
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2">Customer</Typography>
                            <Typography>{order.customer_name}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2">Phone</Typography>
                            <Typography>{order.customer_phone}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2">Address</Typography>
                            <Typography sx={{ textAlign: 'right', maxWidth: 240 }}>
                                {order.customer_address}
                            </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2">Type</Typography>
                            <Typography sx={{ textTransform: 'capitalize' }}>{order.delivery_type}</Typography>
                        </Stack>
                        {order.notes && (
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2">Notes</Typography>
                                <Typography sx={{ textAlign: 'right', maxWidth: 240 }}>{order.notes}</Typography>
                            </Stack>
                        )}
                    </Stack>
                </Box>

                {/* Status update */}
                <Box sx={{
                    width: { xs: '100%', md: 260 },
                    bgcolor: '#fff', border: '0.5px solid #E8ECF2',
                    borderRadius: '10px', p: 3, alignSelf: 'flex-start',
                }}>
                    <Typography variant="h2" sx={{ mb: 2 }}>Update status</Typography>
                    <Select
                        fullWidth
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        size="small"
                        sx={{ mb: 2 }}
                    >
                        {STATUSES.map(s => (
                            <MenuItem key={s} value={s} sx={{ fontSize: 13 }}>
                                {STATUS_LABELS[s]}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={updateStatus}
                        disabled={status === order.status}
                    >
                        Save
                    </Button>
                </Box>
            </Stack>

            {/* Items */}
            <Box sx={{ mt: 3 }}>
                <Typography variant="h2" sx={{ mb: 2 }}>Items ordered</Typography>
                <TableContainer component={Paper} sx={{ border: '0.5px solid #E8ECF2', boxShadow: 'none', overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell align="center">Qty</TableCell>
                                <TableCell align="right">Unit price</TableCell>
                                <TableCell align="right">Subtotal</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.items?.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell sx={{ maxWidth: 320 }}>
                                        <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                                            {item.product_name}
                                        </Typography>
                                        {item.product?.description && (
                                            <Typography variant="body2" sx={{ color: '#8A94A6', mt: 0.25 }}>
                                                {item.product.description}
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">{item.qty}</TableCell>
                                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>₱{item.unit_price}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>₱{item.subtotal}</TableCell>
                                </TableRow>
                            ))}
                            {parseFloat(order.delivery_fee) > 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} sx={{ color: '#8A94A6' }}>Delivery fee</TableCell>
                                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>₱{order.delivery_fee}</TableCell>
                                </TableRow>
                            )}
                            <TableRow>
                                <TableCell colSpan={3} sx={{ fontWeight: 700 }}>Total</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: '#0B3D91', whiteSpace: 'nowrap' }}>
                                    ₱{order.total}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Button href="/admin/orders" sx={{ mt: 2 }}>← Back to orders</Button>
        </AdminLayout>
    );
}
