import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

// ─── colour config ────────────────────────────────────────────────────────────
const STATUS_COLORS = {
    pending:          '#BA7517',
    confirmed:        '#007A87',
    out_for_delivery: '#0B3D91',
    delivered:        '#1D9E75',
    cancelled:        '#E24B4A',
};
const STATUS_BG = {
    pending:          '#FAEEDA',
    confirmed:        '#E0F9FB',
    out_for_delivery: '#E6F0FF',
    delivered:        '#E1F5EE',
    cancelled:        '#FCEBEB',
};
const STATUS_LABELS = {
    pending:          'Pending',
    confirmed:        'Confirmed',
    out_for_delivery: 'Out for delivery',
    delivered:        'Delivered',
    cancelled:        'Cancelled',
};
const RANGE_OPTIONS = [
    { value: 'today',      label: 'Today' },
    { value: 'this_week',  label: 'This week' },
    { value: 'last_week',  label: 'Last week' },
    { value: 'this_month', label: 'This month' },
    { value: 'last_month', label: 'Last month' },
    { value: 'this_year',  label: 'This year' },
    { value: 'custom',     label: 'Custom range' },
];

// ─── tiny helpers ─────────────────────────────────────────────────────────────
function formatDate(d) {
    return new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
}

// ─── reusable bar row ─────────────────────────────────────────────────────────
function BarRow({ label, value, max, color = '#0B3D91', suffix = '', chipBg, chipColor }) {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
        <Stack spacing={0.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                {chipBg ? (
                    <Chip label={label} size="small" sx={{ background: chipBg, color: chipColor, fontWeight: 500, fontSize: 12 }} />
                ) : (
                    <Typography sx={{ fontSize: 13, color: '#3D4A5C' }} noWrap>{label}</Typography>
                )}
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#3D4A5C', ml: 1, whiteSpace: 'nowrap' }}>
                    {value}{suffix}
                </Typography>
            </Stack>
            <Box sx={{ height: 7, bgcolor: '#F5F7FA', borderRadius: '4px', overflow: 'hidden' }}>
                <Box sx={{ width: `${pct}%`, height: '100%', bgcolor: color, borderRadius: '4px', transition: 'width 0.4s ease' }} />
            </Box>
        </Stack>
    );
}

// ─── summary stat card ────────────────────────────────────────────────────────
function StatCard({ label, value, sub }) {
    return (
        <Card sx={{ borderRadius: '10px' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography sx={{ fontSize: 11, fontWeight: 500, color: '#8A94A6', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>
                    {label}
                </Typography>
                <Typography sx={{ fontSize: 26, fontWeight: 700, color: '#0B3D91', lineHeight: 1.2 }}>
                    {value}
                </Typography>
                {sub && (
                    <Typography sx={{ fontSize: 12, color: '#8A94A6', mt: 0.5 }}>{sub}</Typography>
                )}
            </CardContent>
        </Card>
    );
}

// ─── section card wrapper ─────────────────────────────────────────────────────
function Section({ title, children }) {
    return (
        <Card sx={{ borderRadius: '10px' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Typography variant="h2" sx={{ mb: 2 }}>{title}</Typography>
                <Divider sx={{ mb: 2 }} />
                {children}
            </CardContent>
        </Card>
    );
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function Reports({ summary, by_status, by_type, top_products, daily_revenue, filters }) {
    const [range, setRange]   = useState(filters.range);
    const [fromDate, setFrom] = useState(filters.from);
    const [toDate, setTo]     = useState(filters.to);

    const apply = (overrides = {}) => {
        const params = { range, from: fromDate, to: toDate, ...overrides };
        router.get('/admin/reports', params, { preserveState: true, replace: true });
    };

    const handleRangeChange = (val) => {
        setRange(val);
        if (val !== 'custom') apply({ range: val });
    };

    // derived maximums for bar charts
    const maxStatusCount  = Math.max(...Object.values(by_status).map(Number), 1);
    const maxProductQty   = top_products.length > 0 ? top_products[0].total_qty : 1;
    const maxDailyRevenue = daily_revenue.length > 0 ? Math.max(...daily_revenue.map(d => d.revenue), 1) : 1;

    const periodLabel = `${filters.from} – ${filters.to}`;

    return (
        <AdminLayout title="Reports">
            <Head title="Reports" />

            {/* ── Date range selector ─────────────────────────────────── */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} sx={{ mb: 3 }}>
                <Select
                    value={range}
                    onChange={e => handleRangeChange(e.target.value)}
                    size="small"
                    sx={{ minWidth: 160 }}
                >
                    {RANGE_OPTIONS.map(o => (
                        <MenuItem key={o.value} value={o.value} sx={{ fontSize: 13 }}>{o.label}</MenuItem>
                    ))}
                </Select>

                {range === 'custom' && (
                    <>
                        <TextField
                            type="date"
                            size="small"
                            label="From"
                            value={fromDate}
                            onChange={e => setFrom(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ width: 155 }}
                        />
                        <TextField
                            type="date"
                            size="small"
                            label="To"
                            value={toDate}
                            onChange={e => setTo(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ width: 155 }}
                        />
                        <Button variant="contained" size="small" onClick={() => apply()}>
                            Apply
                        </Button>
                    </>
                )}

                <Typography variant="body2" sx={{ color: '#8A94A6' }}>
                    {periodLabel}
                </Typography>
            </Stack>

            {/* ── Summary cards ───────────────────────────────────────── */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <StatCard label="Revenue" value={`₱${summary.total_revenue}`} sub="Delivered orders only" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <StatCard label="Active orders" value={summary.total_orders} sub="Excl. cancelled" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <StatCard label="Avg order value" value={`₱${summary.avg_order_value}`} sub="Delivered orders only" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                    <StatCard label="Items sold" value={summary.total_items_sold} sub="Delivered orders only" />
                </Grid>
            </Grid>

            {/* ── Main content grid ───────────────────────────────────── */}
            <Grid container spacing={2}>

                {/* Revenue by day */}
                {daily_revenue.length > 0 && (
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Section title="Revenue by day">
                            {daily_revenue.length === 1 ? (
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography sx={{ fontSize: 13, color: '#3D4A5C' }}>
                                        {formatDate(daily_revenue[0].date)}
                                    </Typography>
                                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#0B3D91' }}>
                                        ₱{daily_revenue[0].revenue.toLocaleString()}
                                    </Typography>
                                </Stack>
                            ) : (
                                <Box>
                                    {/* Vertical bar chart */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                            gap: '3px',
                                            height: 100,
                                            mb: 1,
                                        }}
                                    >
                                        {daily_revenue.map(day => {
                                            const heightPct = maxDailyRevenue > 0
                                                ? Math.max((day.revenue / maxDailyRevenue) * 100, 4)
                                                : 4;
                                            return (
                                                <Box
                                                    key={day.date}
                                                    title={`${formatDate(day.date)}: ₱${day.revenue.toLocaleString()} (${day.orders} order${day.orders !== 1 ? 's' : ''})`}
                                                    sx={{
                                                        flex: 1,
                                                        height: `${heightPct}%`,
                                                        bgcolor: '#0B3D91',
                                                        borderRadius: '3px 3px 0 0',
                                                        cursor: 'default',
                                                        opacity: 0.85,
                                                        '&:hover': { opacity: 1 },
                                                        minWidth: 4,
                                                    }}
                                                />
                                            );
                                        })}
                                    </Box>
                                    {/* X-axis labels — first, middle, last only to avoid overlap */}
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography sx={{ fontSize: 11, color: '#8A94A6' }}>
                                            {formatDate(daily_revenue[0].date)}
                                        </Typography>
                                        {daily_revenue.length > 2 && (
                                            <Typography sx={{ fontSize: 11, color: '#8A94A6' }}>
                                                {formatDate(daily_revenue[Math.floor(daily_revenue.length / 2)].date)}
                                            </Typography>
                                        )}
                                        <Typography sx={{ fontSize: 11, color: '#8A94A6' }}>
                                            {formatDate(daily_revenue[daily_revenue.length - 1].date)}
                                        </Typography>
                                    </Stack>
                                    <Divider sx={{ my: 1.5 }} />
                                    {/* Totals footer */}
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2">
                                            Peak day: <strong>₱{Math.max(...daily_revenue.map(d => d.revenue)).toLocaleString()}</strong>
                                        </Typography>
                                        <Typography variant="body2">
                                            {daily_revenue.length} active day{daily_revenue.length !== 1 ? 's' : ''}
                                        </Typography>
                                    </Stack>
                                </Box>
                            )}
                        </Section>
                    </Grid>
                )}

                {/* Orders by status */}
                <Grid size={{ xs: 12, md: daily_revenue.length > 0 ? 5 : 6 }}>
                    <Section title="Orders by status">
                        {Object.keys(STATUS_LABELS).length > 0 ? (
                            <Stack spacing={2}>
                                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                                    <BarRow
                                        key={key}
                                        label={label}
                                        value={by_status[key] ?? 0}
                                        max={maxStatusCount}
                                        color={STATUS_COLORS[key]}
                                        chipBg={STATUS_BG[key]}
                                        chipColor={STATUS_COLORS[key]}
                                    />
                                ))}
                            </Stack>
                        ) : (
                            <Typography variant="body2">No orders in this period.</Typography>
                        )}
                    </Section>
                </Grid>

                {/* Top products */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Section title="Top 10 products by qty sold">
                        {top_products.length === 0 ? (
                            <Typography variant="body2">No sales in this period.</Typography>
                        ) : (
                            <Stack spacing={2}>
                                {top_products.map((p, i) => (
                                    <Stack key={p.product_name} spacing={0.5}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                                            <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flex: 1, mr: 1 }}>
                                                <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#8A94A6', minWidth: 16 }}>
                                                    {i + 1}
                                                </Typography>
                                                <Typography sx={{ fontSize: 13, color: '#3D4A5C' }} noWrap>
                                                    {p.product_name}
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={2} alignItems="baseline">
                                                <Typography sx={{ fontSize: 12, color: '#8A94A6', whiteSpace: 'nowrap' }}>
                                                    {p.total_qty} sold
                                                </Typography>
                                                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#0B3D91', whiteSpace: 'nowrap' }}>
                                                    ₱{p.total_revenue.toLocaleString()}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        <Box sx={{ height: 6, bgcolor: '#F5F7FA', borderRadius: '3px', overflow: 'hidden' }}>
                                            <Box sx={{
                                                width: `${Math.round((p.total_qty / maxProductQty) * 100)}%`,
                                                height: '100%',
                                                bgcolor: i === 0 ? '#0B3D91' : '#1A56C4',
                                                opacity: 1 - i * 0.07,
                                                borderRadius: '3px',
                                                transition: 'width 0.4s ease',
                                            }} />
                                        </Box>
                                    </Stack>
                                ))}
                            </Stack>
                        )}
                    </Section>
                </Grid>

                {/* Delivery vs Pickup */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Section title="Delivery vs pickup (delivered)">
                        {by_type.length === 0 ? (
                            <Typography variant="body2">No orders in this period.</Typography>
                        ) : (
                            <Stack spacing={2}>
                                {by_type.map(t => (
                                    <Box
                                        key={t.type}
                                        sx={{
                                            p: 2,
                                            border: '0.5px solid #E8ECF2',
                                            borderRadius: '10px',
                                        }}
                                    >
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                            <Typography sx={{ fontSize: 14, fontWeight: 600, textTransform: 'capitalize', color: '#3D4A5C' }}>
                                                {t.type}
                                            </Typography>
                                            <Chip
                                                label={`${t.count} order${t.count !== 1 ? 's' : ''}`}
                                                size="small"
                                                sx={{ background: '#EEF3FF', color: '#0B3D91', fontWeight: 500 }}
                                            />
                                        </Stack>
                                        <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#0B3D91' }}>
                                            ₱{t.revenue.toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            avg ₱{t.count > 0 ? (t.revenue / t.count).toFixed(2) : '0.00'} per order
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </Section>
                </Grid>

            </Grid>
        </AdminLayout>
    );
}
