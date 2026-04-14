import { useState } from 'react';
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
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Pagination from '@mui/material/Pagination';
import InputAdornment from '@mui/material/InputAdornment';
import { Search as SearchIcon } from '@mui/icons-material';
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

export default function OrdersIndex({ orders, filters, statusCounts }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search ?? '');

    const applyFilters = (overrides = {}) => {
        router.get('/admin/orders', { search, status: filters.status, ...overrides }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const handleStatusFilter = (status) => {
        applyFilters({ status, page: 1 });
    };

    const handlePageChange = (_, page) => {
        applyFilters({ page });
    };

    const updateStatus = (orderId, status) => {
        router.patch(`/admin/orders/${orderId}/status`, { status });
    };

    const rows = orders.data;
    const totalAll = Object.values(statusCounts).reduce((a, b) => a + b, 0);

    return (
        <AdminLayout title="Orders">
            <Head title="Orders" />

            {flash?.success && <Alert severity="success" sx={{ mb: 2 }}>{flash.success}</Alert>}

            {/* Status filter tabs */}
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Chip
                    label={`All (${totalAll})`}
                    onClick={() => handleStatusFilter('')}
                    sx={!filters.status ? {
                        background: '#0B3D91', color: '#fff', fontWeight: 600,
                    } : {
                        background: '#F5F7FA', color: '#8A94A6',
                    }}
                />
                {STATUSES.map(s => (
                    <Chip
                        key={s}
                        label={`${STATUS_LABELS[s]} (${statusCounts[s] ?? 0})`}
                        onClick={() => handleStatusFilter(s)}
                        sx={filters.status === s ? {
                            background: '#0B3D91', color: '#fff', fontWeight: 600,
                        } : {
                            background: '#F5F7FA', color: '#8A94A6',
                        }}
                    />
                ))}
            </Stack>

            {/* Search */}
            <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 1, mb: 2, maxWidth: 400 }}>
                <TextField
                    size="small"
                    placeholder="Search by name or order #…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" sx={{ color: '#8A94A6' }} />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button type="submit" variant="contained" size="small" sx={{ whiteSpace: 'nowrap' }}>
                    Search
                </Button>
            </Box>

            {/* Desktop table */}
            <TableContainer
                component={Paper}
                sx={{ border: '0.5px solid #E8ECF2', boxShadow: 'none', display: { xs: 'none', md: 'block' } }}
            >
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Order</TableCell>
                            <TableCell>Date placed</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Items ordered</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell>Update status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} align="center" sx={{ color: '#8A94A6', py: 4 }}>
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        )}
                        {rows.map(order => (
                            <TableRow key={order.id} hover>
                                <TableCell
                                    component={Link}
                                    href={`/admin/orders/${order.id}`}
                                    sx={{ fontWeight: 700, color: '#0B3D91', textDecoration: 'none' }}
                                >
                                    #{order.id}
                                </TableCell>
                                <TableCell sx={{ color: '#8A94A6', fontSize: 12, whiteSpace: 'nowrap' }}>
                                    {formatDate(order.created_at)}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 500 }}>{order.customer_name}</TableCell>
                                <TableCell sx={{ color: '#3D4A5C', fontSize: 13 }}>{order.customer_phone}</TableCell>
                                <TableCell sx={{ color: '#8A94A6', fontSize: 12, textTransform: 'capitalize' }}>
                                    {order.delivery_type}
                                </TableCell>
                                <TableCell sx={{ maxWidth: 220 }}>
                                    {order.items?.map(item => (
                                        <Typography key={item.id} sx={{ fontSize: 12, color: '#3D4A5C', lineHeight: 1.5 }}>
                                            {item.product_name} <span style={{ color: '#8A94A6' }}>×{item.qty}</span>
                                        </Typography>
                                    ))}
                                </TableCell>
                                <TableCell><StatusBadge status={order.status} /></TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: '#0B3D91' }}>
                                    ₱{order.total}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={order.status}
                                        onChange={e => updateStatus(order.id, e.target.value)}
                                        size="small"
                                        sx={{ fontSize: 12, minWidth: 150 }}
                                    >
                                        {STATUSES.map(s => (
                                            <MenuItem key={s} value={s} sx={{ fontSize: 12 }}>
                                                {STATUS_LABELS[s]}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Mobile cards */}
            <Stack spacing={1.5} sx={{ display: { xs: 'flex', md: 'none' } }}>
                {rows.length === 0 && (
                    <Typography sx={{ color: '#8A94A6', textAlign: 'center', py: 4 }}>
                        No orders found.
                    </Typography>
                )}
                {rows.map(order => (
                    <Card key={order.id} sx={{ borderRadius: '10px' }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                                <Typography
                                    component={Link}
                                    href={`/admin/orders/${order.id}`}
                                    sx={{ fontWeight: 700, color: '#0B3D91', textDecoration: 'none', fontSize: 15 }}
                                >
                                    #{order.id}
                                </Typography>
                                <StatusBadge status={order.status} />
                            </Stack>

                            <Typography sx={{ fontSize: 11, color: '#8A94A6', mb: 1 }}>
                                {formatDate(order.created_at)}
                            </Typography>

                            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{order.customer_name}</Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>{order.customer_phone}</Typography>

                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                                <Box sx={{ flex: 1, mr: 1 }}>
                                    <Chip
                                        label={order.delivery_type}
                                        size="small"
                                        sx={{ fontSize: 11, textTransform: 'capitalize', background: '#F5F7FA', color: '#3D4A5C', mb: 1 }}
                                    />
                                    {order.items?.map(item => (
                                        <Typography key={item.id} sx={{ fontSize: 12, color: '#3D4A5C', lineHeight: 1.6 }}>
                                            {item.product_name} <span style={{ color: '#8A94A6' }}>×{item.qty}</span>
                                        </Typography>
                                    ))}
                                </Box>
                                <Typography sx={{ fontWeight: 700, color: '#0B3D91', fontSize: 15, whiteSpace: 'nowrap' }}>
                                    ₱{order.total}
                                </Typography>
                            </Stack>

                            <Select
                                value={order.status}
                                onChange={e => updateStatus(order.id, e.target.value)}
                                size="small"
                                fullWidth
                                sx={{ fontSize: 13 }}
                            >
                                {STATUSES.map(s => (
                                    <MenuItem key={s} value={s} sx={{ fontSize: 13 }}>
                                        {STATUS_LABELS[s]}
                                    </MenuItem>
                                ))}
                            </Select>
                        </CardContent>
                    </Card>
                ))}
            </Stack>

            {/* Pagination */}
            {orders.last_page > 1 && (
                <Stack alignItems="center" sx={{ mt: 3 }}>
                    <Pagination
                        count={orders.last_page}
                        page={orders.current_page}
                        onChange={handlePageChange}
                        color="primary"
                        shape="rounded"
                        size="small"
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        {orders.from}–{orders.to} of {orders.total} orders
                    </Typography>
                </Stack>
            )}
        </AdminLayout>
    );
}
