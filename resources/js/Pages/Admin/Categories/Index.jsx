import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Alert from '@mui/material/Alert';
import { useState } from 'react';

export default function CategoriesIndex({ categories }) {
    const { flash } = usePage().props;
    const [editingId, setEditingId] = useState(null);

    const createForm = useForm({ name: '', sort_order: categories.length + 1, is_active: true });
    const editForm   = useForm({ name: '', sort_order: 0, is_active: true });

    const startEdit = (cat) => {
        setEditingId(cat.id);
        editForm.setData({ name: cat.name, sort_order: cat.sort_order, is_active: cat.is_active });
    };

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post('/admin/categories', { onSuccess: () => createForm.reset() });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        editForm.put(`/admin/categories/${editingId}`, { onSuccess: () => setEditingId(null) });
    };

    const deleteCategory = (id) => {
        if (confirm('Delete this category?')) {
            router.delete(`/admin/categories/${id}`);
        }
    };

    return (
        <AdminLayout title="Categories">
            <Head title="Categories" />

            {flash?.success && <Alert severity="success" sx={{ mb: 2 }}>{flash.success}</Alert>}

            {/* Add form */}
            <Box component="form" onSubmit={submitCreate} sx={{ mb: 3 }}>
                <Typography variant="h2" sx={{ mb: 2 }}>Add category</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        label="Name"
                        value={createForm.data.name}
                        onChange={e => createForm.setData('name', e.target.value)}
                        error={!!createForm.errors.name}
                        helperText={createForm.errors.name}
                        required
                    />
                    <TextField
                        label="Sort order"
                        type="number"
                        value={createForm.data.sort_order}
                        onChange={e => createForm.setData('sort_order', e.target.value)}
                        sx={{ width: 120 }}
                    />
                    <Button type="submit" variant="contained" disabled={createForm.processing}>
                        Add
                    </Button>
                </Stack>
            </Box>

            <TableContainer component={Paper} sx={{ border: '0.5px solid #E8ECF2', boxShadow: 'none' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="center">Sort</TableCell>
                            <TableCell align="center">Products</TableCell>
                            <TableCell align="center">Active</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map(cat => (
                            editingId === cat.id ? (
                                <TableRow key={cat.id}>
                                    <TableCell>
                                        <TextField
                                            value={editForm.data.name}
                                            onChange={e => editForm.setData('name', e.target.value)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TextField
                                            type="number"
                                            value={editForm.data.sort_order}
                                            onChange={e => editForm.setData('sort_order', e.target.value)}
                                            size="small"
                                            sx={{ width: 70 }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">{cat.products_count}</TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            checked={editForm.data.is_active}
                                            onChange={e => editForm.setData('is_active', e.target.checked)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            variant="contained"
                                            onClick={submitEdit}
                                            disabled={editForm.processing}
                                            sx={{ mr: 1 }}
                                        >
                                            Save
                                        </Button>
                                        <Button size="small" onClick={() => setEditingId(null)}>
                                            Cancel
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <TableRow key={cat.id} hover>
                                    <TableCell sx={{ fontWeight: 500 }}>{cat.name}</TableCell>
                                    <TableCell align="center">{cat.sort_order}</TableCell>
                                    <TableCell align="center">{cat.products_count}</TableCell>
                                    <TableCell align="center">
                                        <Switch checked={cat.is_active} size="small" disabled />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={() => startEdit(cat)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => deleteCategory(cat.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </AdminLayout>
    );
}
