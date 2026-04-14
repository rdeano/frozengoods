import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    TrendingFlat as TrendingFlatIcon,
    Add as AddIcon,
    ReceiptLong as ReceiptLongIcon,
    BarChart as BarChartIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import StatusBadge from '../../Components/StatusBadge';

// ─── helpers ──────────────────────────────────────────────────────────────────
function trend(current, previous) {
    if (previous === 0 && current === 0) return { dir: 'flat', label: 'Same as before', color: '#8A94A6' };
    if (previous === 0) return { dir: 'up', label: `+${current} from before`, color: '#1D9E75' };
    const diff = current - previous;
    if (diff === 0) return { dir: 'flat', label: 'Same as yesterday', color: '#8A94A6' };
    return diff > 0
        ? { dir: 'up',   label: `+${diff} from yesterday`, color: '#1D9E75' }
        : { dir: 'down', label: `${diff} from yesterday`,  color: '#E24B4A' };
}

function trendRevenue(current, previous) {
    const curr = parseFloat(current.replace(/,/g, ''));
    const prev = parseFloat(previous.replace(/,/g, ''));
    if (prev === 0 && curr === 0) return { dir: 'flat', label: 'Same as yesterday', color: '#8A94A6' };
    if (prev === 0) return { dir: 'up', label: `+₱${current} from yesterday`, color: '#1D9E75' };
    const diff = curr - prev;
    if (diff === 0) return { dir: 'flat', label: 'Same as yesterday', color: '#8A94A6' };
    return diff > 0
        ? { dir: 'up',   label: `+₱${Math.abs(diff).toFixed(2)} from yesterday`, color: '#1D9E75' }
        : { dir: 'down', label: `-₱${Math.abs(diff).toFixed(2)} from yesterday`, color: '#E24B4A' };
}

function weekTrendRevenue(current, previous) {
    const curr = parseFloat(current.replace(/,/g, ''));
    const prev = parseFloat(previous.replace(/,/g, ''));
    if (prev === 0 && curr === 0) return { dir: 'flat', label: 'Same as last week', color: '#8A94A6' };
    if (prev === 0) return { dir: 'up', label: 'More than last week', color: '#1D9E75' };
    const diff = curr - prev;
    if (diff === 0) return { dir: 'flat', label: 'Same as last week', color: '#8A94A6' };
    return diff > 0
        ? { dir: 'up',   label: `+₱${Math.abs(diff).toFixed(2)} vs last week`, color: '#1D9E75' }
        : { dir: 'down', label: `-₱${Math.abs(diff).toFixed(2)} vs last week`, color: '#E24B4A' };
}

function TrendIcon({ dir, color }) {
    const sx = { fontSize: 14, color };
    if (dir === 'up')   return <TrendingUpIcon sx={sx} />;
    if (dir === 'down') return <TrendingDownIcon sx={sx} />;
    return <TrendingFlatIcon sx={sx} />;
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-PH', {
        month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true,
    });
}

// ─── stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, trendData, accent = false, warning = false }) {
    return (
        <Card sx={{
            borderRadius: '10px',
            borderColor: warning ? '#BA7517' : accent ? '#0B3D91' : undefined,
            borderWidth: warning || accent ? '0.5px' : undefined,
        }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography sx={{
                    fontSize: 11, fontWeight: 500, color: '#8A94A6',
                    textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5,
                }}>
                    {label}
                </Typography>
                <Typography sx={{ fontSize: 28, fontWeight: 700, color: accent ? '#0B3D91' : '#3D4A5C', lineHeight: 1.1 }}>
                    {value}
                </Typography>
                {trendData && (
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.75 }}>
                        <TrendIcon dir={trendData.dir} color={trendData.color} />
                        <Typography sx={{ fontSize: 12, color: trendData.color }}>{trendData.label}</Typography>
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function Dashboard({ stats, recentOrders, lowStockProducts, fbConfigured }) {
    const todayTrend       = trend(stats.ordersToday, stats.ordersYesterday);
    const weekTrend        = { dir: stats.ordersWeek >= stats.ordersLastWeek ? (stats.ordersWeek > stats.ordersLastWeek ? 'up' : 'flat') : 'down',
                               label: `${stats.ordersLastWeek} last week`,
                               color: stats.ordersWeek >= stats.ordersLastWeek ? '#1D9E75' : '#E24B4A' };
    const revTodayTrend    = trendRevenue(stats.revenueToday, stats.revenueYesterday);
    const revWeekTrend     = weekTrendRevenue(stats.revenueWeek, stats.revenueLastWeek);

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            {/* Alerts */}
            {!fbConfigured && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Facebook Messenger is not configured.{' '}
                    <Link href="/admin/settings" style={{ color: 'inherit', fontWeight: 600 }}>Go to Settings</Link> to add your FB Page ID and username.
                </Alert>
            )}
            {stats.outOfStock > 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {stats.outOfStock} product{stats.outOfStock !== 1 ? 's are' : ' is'} out of stock and hidden from the storefront.{' '}
                    <Link href="/admin/products" style={{ color: 'inherit', fontWeight: 600 }}>View products</Link>
                </Alert>
            )}

            {/* ── Stat cards ──────────────────────────────────────────── */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                    <StatCard
                        label="Orders today"
                        value={stats.ordersToday}
                        trendData={todayTrend}
                        accent
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                    <StatCard
                        label="Orders this week"
                        value={stats.ordersWeek}
                        trendData={weekTrend}
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                    <StatCard
                        label="Pending"
                        value={stats.pendingOrders}
                        trendData={stats.pendingOrders > 0
                            ? { dir: 'up', label: 'Need attention', color: '#BA7517' }
                            : { dir: 'flat', label: 'All clear', color: '#1D9E75' }
                        }
                        warning={stats.pendingOrders > 0}
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                    <StatCard
                        label="Revenue today"
                        value={`₱${stats.revenueToday}`}
                        trendData={revTodayTrend}
                        accent
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                    <StatCard
                        label="Revenue this week"
                        value={`₱${stats.revenueWeek}`}
                        trendData={revWeekTrend}
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                    <StatCard
                        label="Out of stock"
                        value={stats.outOfStock}
                        trendData={stats.outOfStock > 0
                            ? { dir: 'down', label: 'Items unavailable', color: '#E24B4A' }
                            : { dir: 'flat', label: 'All available', color: '#1D9E75' }
                        }
                        warning={stats.outOfStock > 0}
                    />
                </Grid>
            </Grid>

            {/* ── Quick actions ────────────────────────────────────────── */}
            <Stack direction="row" spacing={1.5} sx={{ mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
                <Button
                    component={Link}
                    href="/admin/products/create"
                    variant="contained"
                    startIcon={<AddIcon />}
                    size="small"
                >
                    Add product
                </Button>
                <Button
                    component={Link}
                    href="/admin/orders"
                    variant="outlined"
                    startIcon={<ReceiptLongIcon />}
                    size="small"
                    sx={{ borderColor: '#E8ECF2', color: '#3D4A5C' }}
                >
                    View all orders
                </Button>
                <Button
                    component={Link}
                    href="/admin/reports"
                    variant="outlined"
                    startIcon={<BarChartIcon />}
                    size="small"
                    sx={{ borderColor: '#E8ECF2', color: '#3D4A5C' }}
                >
                    Reports
                </Button>
            </Stack>

            {/* ── Main content ─────────────────────────────────────────── */}
            <Grid container spacing={2} alignItems="flex-start">

                {/* Recent orders */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card sx={{ borderRadius: '10px' }}>
                        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                <Typography variant="h2">Recent orders</Typography>
                                <Button
                                    component={Link}
                                    href="/admin/orders"
                                    size="small"
                                    sx={{ color: '#0B3D91', fontSize: 13 }}
                                >
                                    View all →
                                </Button>
                            </Stack>

                            {recentOrders.length === 0 ? (
                                <Typography variant="body2" sx={{ py: 2, textAlign: 'center' }}>
                                    No orders yet.
                                </Typography>
                            ) : (
                                <>
                                    {/* Desktop table */}
                                    <TableContainer
                                        component={Paper}
                                        sx={{ border: '0.5px solid #E8ECF2', boxShadow: 'none', display: { xs: 'none', sm: 'block' } }}
                                    >
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Order</TableCell>
                                                    <TableCell>Customer</TableCell>
                                                    <TableCell>Date</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    <TableCell align="right">Total</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {recentOrders.map(order => (
                                                    <TableRow key={order.id} hover>
                                                        <TableCell
                                                            component={Link}
                                                            href={`/admin/orders/${order.id}`}
                                                            sx={{ fontWeight: 700, color: '#0B3D91', textDecoration: 'none' }}
                                                        >
                                                            #{order.id}
                                                        </TableCell>
                                                        <TableCell sx={{ fontWeight: 500 }}>{order.customer_name}</TableCell>
                                                        <TableCell sx={{ color: '#8A94A6', fontSize: 12 }}>
                                                            {formatDate(order.created_at)}
                                                        </TableCell>
                                                        <TableCell><StatusBadge status={order.status} /></TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 600, color: '#0B3D91' }}>
                                                            ₱{order.total}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    {/* Mobile list */}
                                    <Stack spacing={1} sx={{ display: { xs: 'flex', sm: 'none' } }}>
                                        {recentOrders.map(order => (
                                            <Box
                                                key={order.id}
                                                component={Link}
                                                href={`/admin/orders/${order.id}`}
                                                sx={{
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    p: 1.5, border: '0.5px solid #E8ECF2', borderRadius: '8px',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                <Box>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Typography sx={{ fontWeight: 700, color: '#0B3D91', fontSize: 14 }}>
                                                            #{order.id}
                                                        </Typography>
                                                        <StatusBadge status={order.status} />
                                                    </Stack>
                                                    <Typography sx={{ fontSize: 13, color: '#3D4A5C', mt: 0.25 }}>
                                                        {order.customer_name}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: 11, color: '#8A94A6' }}>
                                                        {formatDate(order.created_at)}
                                                    </Typography>
                                                </Box>
                                                <Typography sx={{ fontWeight: 700, color: '#0B3D91', fontSize: 15 }}>
                                                    ₱{order.total}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right column */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Stack spacing={2}>

                        {/* Low stock */}
                        {lowStockProducts.length > 0 && (
                            <Card sx={{ borderRadius: '10px', borderColor: '#BA7517' }}>
                                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                        <WarningIcon sx={{ fontSize: 16, color: '#BA7517' }} />
                                        <Typography variant="h2">Low stock</Typography>
                                    </Stack>
                                    <Stack spacing={0} divider={<Divider />}>
                                        {lowStockProducts.map(product => (
                                            <Stack
                                                key={product.id}
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                sx={{ py: 1.25 }}
                                            >
                                                <Box sx={{ minWidth: 0, mr: 1 }}>
                                                    <Typography sx={{ fontSize: 13, fontWeight: 500 }} noWrap>
                                                        {product.name}
                                                    </Typography>
                                                    <Typography variant="body2" noWrap>{product.category?.name}</Typography>
                                                </Box>
                                                <Chip
                                                    label={`${product.stock_qty} left`}
                                                    size="small"
                                                    sx={{ background: '#FFF0EB', color: '#854F0B', fontWeight: 600, flexShrink: 0 }}
                                                />
                                            </Stack>
                                        ))}
                                    </Stack>
                                    <Button
                                        component={Link}
                                        href="/admin/products"
                                        size="small"
                                        fullWidth
                                        variant="outlined"
                                        sx={{ mt: 1.5, borderColor: '#E8ECF2', color: '#3D4A5C', fontSize: 12 }}
                                    >
                                        Manage products
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Revenue note */}
                        <Card sx={{ borderRadius: '10px', bgcolor: '#F5F7FA' }}>
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Typography sx={{ fontSize: 12, color: '#8A94A6', lineHeight: 1.6 }}>
                                    Revenue figures include <strong>delivered orders only</strong>. Pending and in-progress orders are not counted.
                                </Typography>
                            </CardContent>
                        </Card>

                    </Stack>
                </Grid>

            </Grid>
        </AdminLayout>
    );
}
