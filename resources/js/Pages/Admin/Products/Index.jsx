import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import InputAdornment from '@mui/material/InputAdornment';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import Alert from '@mui/material/Alert';

function StockDisplay({ product }) {
    if (product.stock_qty === null)
        return <Chip label="∞" size="small" sx={{ fontSize: 11 }} />;
    if (product.stock_qty <= 5)
        return (
            <Chip
                label={product.stock_qty}
                size="small"
                sx={{ background: '#FFF0EB', color: '#854F0B', fontWeight: 500 }}
            />
        );
    return <span>{product.stock_qty}</span>;
}

function AvailabilityChip({ available }) {
    return (
        <Chip
            label={available ? 'Available' : 'Unavailable'}
            size="small"
            sx={available
                ? { background: '#E1F5EE', color: '#0F6E56', fontWeight: 500 }
                : { background: '#FCEBEB', color: '#A32D2D', fontWeight: 500 }
            }
        />
    );
}

export default function ProductsIndex({ products, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/products', { search }, { preserveState: true, replace: true });
    };

    const handlePageChange = (_, page) => {
        router.get('/admin/products', { search, page }, { preserveState: true, replace: true });
    };

    const archive = (id) => {
        if (confirm('Archive this product?')) {
            router.delete(`/admin/products/${id}`);
        }
    };

    const rows = products.data;

    return (
        <AdminLayout title="Products">
            <Head title="Products" />

            {flash?.success && <Alert severity="success" sx={{ mb: 2 }}>{flash.success}</Alert>}

            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ sm: 'center' }}
                spacing={2}
                sx={{ mb: 2 }}
            >
                <Box
                    component="form"
                    onSubmit={handleSearch}
                    sx={{ display: 'flex', gap: 1, flex: 1, maxWidth: { sm: 360 } }}
                >
                    <TextField
                        size="small"
                        placeholder="Search products…"
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

                <Button
                    component={Link}
                    href="/admin/products/create"
                    variant="contained"
                    startIcon={<AddIcon />}
                    size="small"
                    sx={{ whiteSpace: 'nowrap', alignSelf: { xs: 'flex-start', sm: 'auto' } }}
                >
                    Add product
                </Button>
            </Stack>

            {/* Desktop table */}
            <TableContainer
                component={Paper}
                sx={{ border: '0.5px solid #E8ECF2', boxShadow: 'none', display: { xs: 'none', md: 'block' } }}
            >
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Stock</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ color: '#8A94A6', py: 4 }}>
                                    No products found.
                                </TableCell>
                            </TableRow>
                        )}
                        {rows.map(product => (
                            <TableRow key={product.id} hover>
                                <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
                                <TableCell sx={{ color: '#8A94A6', fontSize: 12 }}>
                                    {product.category?.name}
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: '#0B3D91' }}>
                                    ₱{product.price}
                                </TableCell>
                                <TableCell align="center">
                                    <StockDisplay product={product} />
                                </TableCell>
                                <TableCell align="center">
                                    <AvailabilityChip available={product.is_available} />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        component={Link}
                                        href={`/admin/products/${product.id}/edit`}
                                        size="small"
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => archive(product.id)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
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
                        No products found.
                    </Typography>
                )}
                {rows.map(product => (
                    <Card key={product.id} sx={{ borderRadius: '10px' }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
                                    <Typography sx={{ fontWeight: 600, fontSize: 14 }} noWrap>
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        {product.category?.name}
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={0.5}>
                                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0B3D91' }}>
                                            ₱{product.price}
                                        </Typography>
                                        <AvailabilityChip available={product.is_available} />
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Typography variant="body2">Stock:</Typography>
                                            <StockDisplay product={product} />
                                        </Box>
                                    </Stack>
                                </Box>
                                <Stack direction="row">
                                    <IconButton
                                        component={Link}
                                        href={`/admin/products/${product.id}/edit`}
                                        size="small"
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => archive(product.id)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Stack>

            {/* Pagination */}
            {products.last_page > 1 && (
                <Stack alignItems="center" sx={{ mt: 3 }}>
                    <Pagination
                        count={products.last_page}
                        page={products.current_page}
                        onChange={handlePageChange}
                        color="primary"
                        shape="rounded"
                        size="small"
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        {products.from}–{products.to} of {products.total} products
                    </Typography>
                </Stack>
            )}
        </AdminLayout>
    );
}
