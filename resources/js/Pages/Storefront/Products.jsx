import { Head, Link, router } from '@inertiajs/react';
import StorefrontLayout from '../../Layouts/StorefrontLayout';
import { useCart } from '../../Contexts/CartContext';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { useState } from 'react';

function ProductImage({ src, alt }) {
    if (src) {
        return (
            <Box
                component="img"
                src={src}
                alt={alt}
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
        );
    }
    return (
        <Box sx={{
            width: '100%', height: '100%',
            bgcolor: '#E8ECF2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <Typography sx={{ fontSize: 12, color: '#8A94A6', fontWeight: 500 }}>No image</Typography>
        </Box>
    );
}

function ProductCard({ product, onAdd }) {
    return (
        <Box sx={{
            bgcolor: '#fff',
            borderRadius: '12px',
            border: '0.5px solid #E8ECF2',
            overflow: 'hidden',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'border-color 0.15s, box-shadow 0.15s',
            '&:hover': {
                borderColor: '#0B3D91',
                boxShadow: '0 4px 20px rgba(11,61,145,0.08)',
            },
        }}>
            {/* Image */}
            <Box
                component={Link}
                href={`/products/${product.slug}`}
                sx={{ display: 'block', height: 180, overflow: 'hidden', flexShrink: 0, position: 'relative' }}
            >
                <ProductImage src={product.image_url} alt={product.name} />
                {!product.is_available && (
                    <Box sx={{
                        position: 'absolute', inset: 0,
                        bgcolor: 'rgba(255,255,255,0.75)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Typography sx={{
                            fontSize: 11, fontWeight: 700, color: '#A32D2D',
                            letterSpacing: '0.06em', textTransform: 'uppercase',
                            bgcolor: '#FCEBEB', px: 1.5, py: 0.5, borderRadius: '6px',
                        }}>
                            Out of stock
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Content */}
            <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontSize: 11, color: '#8A94A6', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {product.category?.name}
                </Typography>
                <Typography
                    component={Link}
                    href={`/products/${product.slug}`}
                    sx={{
                        fontSize: 14, fontWeight: 700, color: '#3D4A5C',
                        textDecoration: 'none', mb: 'auto', pb: 1.5,
                        display: 'block', lineHeight: 1.35,
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        '&:hover': { color: '#0B3D91' },
                    }}
                >
                    {product.name}
                </Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontSize: 17, fontWeight: 800, color: '#0B3D91' }}>
                        ₱{product.price}
                    </Typography>
                    {product.is_available && (
                        <IconButton
                            size="small"
                            onClick={() => onAdd(product)}
                            sx={{
                                bgcolor: '#FF6B35', color: '#fff',
                                width: 32, height: 32,
                                borderRadius: '8px',
                                '&:hover': { bgcolor: '#e55a26' },
                            }}
                        >
                            <AddIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    )}
                </Stack>
            </Box>
        </Box>
    );
}

export default function Products({ products, categories, filters }) {
    const { addToCart } = useCart();
    const [search, setSearch] = useState(filters.search || '');

    const applyFilter = (params) => {
        router.get('/products', { ...filters, ...params }, { preserveState: true, replace: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilter({ search });
    };

    const activeCategory = categories.find(c => c.slug === filters.category);

    return (
        <StorefrontLayout>
            <Head title={activeCategory ? activeCategory.name : 'Products'} />

            <Container maxWidth="lg" sx={{ py: 5 }}>

                {/* Page heading */}
                <Box sx={{ mb: 4 }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#8A94A6', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 0.75 }}>
                        {activeCategory ? 'Category' : 'Catalog'}
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'flex-end' }} spacing={1}>
                        <Typography variant="h1">
                            {activeCategory ? activeCategory.name : 'All Products'}
                        </Typography>
                        <Typography sx={{ fontSize: 13, color: '#8A94A6' }}>
                            {products.length} {products.length === 1 ? 'item' : 'items'} found
                        </Typography>
                    </Stack>
                </Box>

                {/* Filters row */}
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    alignItems={{ sm: 'center' }}
                    sx={{ mb: 4, pb: 4, borderBottom: '0.5px solid #E8ECF2' }}
                >
                    <Box component="form" onSubmit={handleSearch} sx={{ width: { xs: '100%', sm: 240 }, flexShrink: 0 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search products…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ fontSize: 16, color: '#8A94A6' }} />
                                    </InputAdornment>
                                ),
                                sx: { bgcolor: '#fff' },
                            }}
                        />
                    </Box>

                    <Stack direction="row" gap={1} flexWrap="wrap">
                        <Chip
                            label="All"
                            size="small"
                            onClick={() => applyFilter({ category: '', search: '' })}
                            sx={!filters.category
                                ? { bgcolor: '#0B3D91', color: '#fff', fontWeight: 600, border: 'none' }
                                : { bgcolor: '#fff', color: '#8A94A6', border: '0.5px solid #E8ECF2', fontWeight: 500 }
                            }
                        />
                        {categories.map(cat => (
                            <Chip
                                key={cat.id}
                                label={cat.name}
                                size="small"
                                onClick={() => applyFilter({ category: cat.slug })}
                                sx={filters.category === cat.slug
                                    ? { bgcolor: '#0B3D91', color: '#fff', fontWeight: 600, border: 'none' }
                                    : { bgcolor: '#fff', color: '#8A94A6', border: '0.5px solid #E8ECF2', fontWeight: 500 }
                                }
                            />
                        ))}
                    </Stack>
                </Stack>

                {/* Grid */}
                {products.length === 0 ? (
                    <Box sx={{ py: 10, textAlign: 'center' }}>
                        <Typography variant="h2" sx={{ mb: 1 }}>No products found</Typography>
                        <Typography sx={{ color: '#8A94A6', mb: 3 }}>Try a different category or clear the search.</Typography>
                        <Button
                            onClick={() => applyFilter({ category: '', search: '' })}
                            variant="outlined"
                            sx={{ borderColor: '#0B3D91', color: '#0B3D91', fontWeight: 600 }}
                        >
                            Clear filters
                        </Button>
                    </Box>
                ) : (
                    <Grid container spacing={2.5}>
                        {products.map(product => (
                            <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3 }}>
                                <ProductCard product={product} onAdd={addToCart} />
                            </Grid>
                        ))}
                    </Grid>
                )}

            </Container>
        </StorefrontLayout>
    );
}
