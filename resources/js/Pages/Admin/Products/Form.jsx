import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

export default function ProductForm({ categories, product }) {
    const isEdit = !!product;

    const { data, setData, post, put, processing, errors } = useForm({
        category_id:  product?.category_id ?? '',
        name:         product?.name ?? '',
        description:  product?.description ?? '',
        price:        product?.price ?? '',
        stock_qty:    product?.stock_qty ?? '',
        is_available: product?.is_available ?? true,
        image:        null,
        _method:      isEdit ? 'PUT' : undefined,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(`/admin/products/${product.id}`, { forceFormData: true });
        } else {
            post('/admin/products', { forceFormData: true });
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Product' : 'Add Product'}>
            <Head title={isEdit ? 'Edit Product' : 'Add Product'} />

            <Box component="form" onSubmit={submit} sx={{ maxWidth: { xs: '100%', sm: 560 } }}>
                <Stack spacing={2}>
                    <TextField
                        select
                        label="Category"
                        value={data.category_id}
                        onChange={e => setData('category_id', e.target.value)}
                        error={!!errors.category_id}
                        helperText={errors.category_id}
                        required
                    >
                        {categories.map(cat => (
                            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Product name"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        required
                    />

                    <TextField
                        label="Description"
                        value={data.description}
                        onChange={e => setData('description', e.target.value)}
                        error={!!errors.description}
                        helperText={errors.description}
                        multiline
                        rows={3}
                    />

                    <TextField
                        label="Price (₱)"
                        type="number"
                        value={data.price}
                        onChange={e => setData('price', e.target.value)}
                        error={!!errors.price}
                        helperText={errors.price}
                        inputProps={{ min: 0, step: '0.01' }}
                        required
                    />

                    <TextField
                        label="Stock qty (leave blank for unlimited)"
                        type="number"
                        value={data.stock_qty}
                        onChange={e => setData('stock_qty', e.target.value)}
                        error={!!errors.stock_qty}
                        helperText={errors.stock_qty}
                        inputProps={{ min: 0 }}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={data.is_available}
                                onChange={e => setData('is_available', e.target.checked)}
                            />
                        }
                        label="Available for purchase"
                    />

                    <Box>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>Product image</Typography>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setData('image', e.target.files[0])}
                        />
                        {errors.image && (
                            <Typography color="error" variant="body2">{errors.image}</Typography>
                        )}
                        {isEdit && product.image_url && (
                            <Box
                                component="img"
                                src={product.image_url}
                                alt={product.name}
                                sx={{ mt: 1, width: 120, height: 80, objectFit: 'cover', borderRadius: '8px' }}
                            />
                        )}
                    </Box>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={processing}
                            fullWidth
                        >
                            {isEdit ? 'Update product' : 'Create product'}
                        </Button>
                        <Button href="/admin/products" variant="outlined" fullWidth>
                            Cancel
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </AdminLayout>
    );
}
