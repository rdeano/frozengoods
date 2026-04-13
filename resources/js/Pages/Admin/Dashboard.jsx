import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

function StatCard({ label, value, sub, subColor }) {
    return (
        <Card sx={{ p: 2, minWidth: 130, borderRadius: '10px' }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                {label}
            </Typography>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#0B3D91' }}>
                {value}
            </Typography>
            {sub && (
                <Typography variant="body2" sx={{ color: subColor ?? 'text.secondary', mt: 0.5 }}>
                    {sub}
                </Typography>
            )}
        </Card>
    );
}

export default function Dashboard({ stats, lowStockProducts, fbConfigured }) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            {!fbConfigured && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    Facebook Messenger is not configured. Go to{' '}
                    <Link href="/admin/settings">Settings</Link> to add your FB Page ID and username.
                </Alert>
            )}

            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <StatCard label="Orders today" value={stats.ordersToday} />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <StatCard label="Orders this week" value={stats.ordersWeek} />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <StatCard
                        label="Pending orders"
                        value={stats.pendingOrders}
                        sub={stats.pendingOrders > 0 ? 'Need attention' : 'All clear'}
                        subColor={stats.pendingOrders > 0 ? '#BA7517' : '#1D9E75'}
                    />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <StatCard
                        label="Out of stock"
                        value={stats.outOfStock}
                        sub={stats.outOfStock > 0 ? 'Items unavailable' : 'All available'}
                        subColor={stats.outOfStock > 0 ? '#E24B4A' : '#1D9E75'}
                    />
                </Grid>
            </Grid>

            {lowStockProducts.length > 0 && (
                <Box>
                    <Typography variant="h2" sx={{ mb: 2 }}>Low stock alerts</Typography>
                    <Stack spacing={1}>
                        {lowStockProducts.map(product => (
                            <Card key={product.id} sx={{ borderRadius: '10px' }}>
                                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                                        <Box>
                                            <Typography variant="h3">{product.name}</Typography>
                                            <Typography variant="body2">{product.category?.name}</Typography>
                                        </Box>
                                        <Chip
                                            label={`${product.stock_qty} left`}
                                            size="small"
                                            sx={{ background: '#FFF0EB', color: '#854F0B', fontWeight: 500 }}
                                        />
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                </Box>
            )}
        </AdminLayout>
    );
}
