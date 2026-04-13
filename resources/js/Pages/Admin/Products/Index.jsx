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
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import Alert from '@mui/material/Alert';

export default function ProductsIndex({ products }) {
    const { flash } = usePage().props;

    const archive = (id) => {
        if (confirm('Archive this product?')) {
            router.delete(`/admin/products/${id}`);
        }
    };

    return (
        <AdminLayout title="Products">
            <Head title="Products" />

            {flash?.success && <Alert severity="success" sx={{ mb: 2 }}>{flash.success}</Alert>}

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h2">All products</Typography>
                <Button
                    component={Link}
                    href="/admin/products/create"
                    variant="contained"
                    startIcon={<AddIcon />}
                    size="small"
                >
                    Add product
                </Button>
            </Stack>

            <TableContainer component={Paper} sx={{ border: '0.5px solid #E8ECF2', boxShadow: 'none' }}>
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
                        {products.map(product => (
                            <TableRow key={product.id} hover>
                                <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
                                <TableCell sx={{ color: '#8A94A6', fontSize: 12 }}>
                                    {product.category?.name}
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: '#0B3D91' }}>
                                    ₱{product.price}
                                </TableCell>
                                <TableCell align="center">
                                    {product.stock_qty === null ? (
                                        <Chip label="∞" size="small" sx={{ fontSize: 11 }} />
                                    ) : product.stock_qty <= 5 ? (
                                        <Chip
                                            label={product.stock_qty}
                                            size="small"
                                            sx={{ background: '#FFF0EB', color: '#854F0B', fontWeight: 500 }}
                                        />
                                    ) : (
                                        <span>{product.stock_qty}</span>
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={product.is_available ? 'Available' : 'Unavailable'}
                                        size="small"
                                        sx={product.is_available
                                            ? { background: '#E1F5EE', color: '#0F6E56', fontWeight: 500 }
                                            : { background: '#FCEBEB', color: '#A32D2D', fontWeight: 500 }
                                        }
                                    />
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
        </AdminLayout>
    );
}
