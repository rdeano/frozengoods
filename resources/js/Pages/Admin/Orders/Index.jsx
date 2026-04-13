import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import StatusBadge from '../../../Components/StatusBadge';

const STATUSES = ['pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled'];

export default function OrdersIndex({ orders }) {
    const { flash } = usePage().props;

    const updateStatus = (orderId, status) => {
        router.patch(`/admin/orders/${orderId}/status`, { status });
    };

    return (
        <AdminLayout title="Orders">
            <Head title="Orders" />

            {flash?.success && <Alert severity="success" sx={{ mb: 2 }}>{flash.success}</Alert>}

            <TableContainer component={Paper} sx={{ border: '0.5px solid #E8ECF2', boxShadow: 'none' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Order</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell>Update</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map(order => (
                            <TableRow key={order.id} hover sx={{ cursor: 'pointer' }}>
                                <TableCell
                                    component={Link}
                                    href={`/admin/orders/${order.id}`}
                                    sx={{ fontWeight: 600, color: '#0B3D91', textDecoration: 'none' }}
                                >
                                    #{order.id}
                                </TableCell>
                                <TableCell>{order.customer_name}</TableCell>
                                <TableCell sx={{ color: '#8A94A6', fontSize: 12, textTransform: 'capitalize' }}>
                                    {order.delivery_type}
                                </TableCell>
                                <TableCell><StatusBadge status={order.status} /></TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>₱{order.total}</TableCell>
                                <TableCell>
                                    <Select
                                        value={order.status}
                                        onChange={e => updateStatus(order.id, e.target.value)}
                                        size="small"
                                        sx={{ fontSize: 12, minWidth: 140 }}
                                    >
                                        {STATUSES.map(s => (
                                            <MenuItem key={s} value={s} sx={{ fontSize: 12 }}>
                                                {s.replace(/_/g, ' ')}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </AdminLayout>
    );
}
