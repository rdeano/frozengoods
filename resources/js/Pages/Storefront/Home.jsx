import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '../../Layouts/StorefrontLayout';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import {
    LocalShipping as LocalShippingIcon,
    Verified as VerifiedIcon,
    Inventory2 as InventoryIcon,
} from '@mui/icons-material';

const CATEGORY_COLORS = {
    'processed-cured-meats': '#E24B4A',
    'fresh-meats':           '#BA7517',
    'seafood':               '#007A87',
    'ready-to-cook':         '#FF6B35',
    'vegetables':            '#1D9E75',
    'dairy-others':          '#0B3D91',
};

const FEATURES = [
    { icon: <VerifiedIcon sx={{ fontSize: 22, color: '#0B3D91' }} />, title: 'Freshness guaranteed', body: 'Frozen immediately after sourcing to lock in quality and nutrients.' },
    { icon: <LocalShippingIcon sx={{ fontSize: 22, color: '#0B3D91' }} />, title: 'Delivered to your door', body: 'Order online and we bring it straight to you — no need to leave home.' },
    { icon: <InventoryIcon sx={{ fontSize: 22, color: '#0B3D91' }} />, title: 'Always well-stocked', body: 'We rotate inventory regularly so you always get the freshest products.' },
];

export default function Home({ categories }) {
    return (
        <StorefrontLayout>
            <Head title="Home" />

            {/* ── Hero ── */}
            <Box sx={{ bgcolor: '#0B3D91' }}>
                <Container maxWidth="lg">
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        alignItems="center"
                        spacing={{ xs: 0, md: 6 }}
                        sx={{ py: { xs: 6, md: 9 } }}
                    >
                        {/* Copy */}
                        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                            <Box sx={{
                                display: 'inline-flex',
                                border: '0.5px solid rgba(0,194,212,0.45)',
                                borderRadius: '6px',
                                px: 1.5, py: 0.5, mb: { xs: 2.5, md: 3 },
                            }}>
                                <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#00C2D4', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                    Fresh · Frozen · Delivered
                                </Typography>
                            </Box>

                            <Typography sx={{
                                fontSize: { xs: 28, sm: 34, md: 40 },
                                fontWeight: 800, color: '#fff',
                                lineHeight: 1.15, letterSpacing: '-0.5px',
                                mb: 2,
                            }}>
                                Quality frozen goods<br />for your family
                            </Typography>

                            <Typography sx={{
                                fontSize: { xs: 14, md: 15 },
                                color: 'rgba(255,255,255,0.55)',
                                mb: { xs: 3.5, md: 4 },
                                lineHeight: 1.7,
                                maxWidth: 400,
                                mx: { xs: 'auto', md: 0 },
                            }}>
                                Meats, seafood, vegetables and more — sourced fresh and frozen at peak quality. Delivered right to your door.
                            </Typography>

                            <Stack direction="row" spacing={1.5} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                                <Button component={Link} href="/products" variant="contained" size="large"
                                    sx={{ bgcolor: '#FF6B35', fontWeight: 700, fontSize: 15, px: { xs: 3, md: 4 }, py: 1.5, '&:hover': { bgcolor: '#e55a26' } }}>
                                    Shop now
                                </Button>
                                <Button component={Link} href="/products" size="large"
                                    sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: 15, px: { xs: 2.5, md: 3 }, py: 1.5, border: '0.5px solid rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.07)', color: '#fff' } }}>
                                    Browse all
                                </Button>
                            </Stack>
                        </Box>

                        {/* Desktop preview grid */}
                        <Box sx={{ display: { xs: 'none', md: 'block' }, flexShrink: 0, width: 320 }}>
                            <Grid container spacing={1.5}>
                                {categories.slice(0, 6).map(cat => (
                                    <Grid key={cat.id} size={6}>
                                        <Box component={Link} href={`/products?category=${cat.slug}`}
                                            sx={{
                                                display: 'block', bgcolor: 'rgba(255,255,255,0.07)',
                                                border: '0.5px solid rgba(255,255,255,0.1)',
                                                borderRadius: '10px', p: 2, textDecoration: 'none',
                                                '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
                                            }}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: CATEGORY_COLORS[cat.slug] ?? '#8A94A6', mb: 1.5 }} />
                                            <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#fff', lineHeight: 1.3, mb: 0.25 }} noWrap>{cat.name}</Typography>
                                            <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.38)' }}>{cat.products_count} items</Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Stack>
                </Container>
            </Box>

            {/* ── Categories ── */}
            <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: { xs: 3, md: 4 } }}>
                    <Box>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#00C2D4', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 0.75 }}>
                            What we carry
                        </Typography>
                        <Typography variant="h1" sx={{ fontSize: { xs: 20, md: 24 } }}>Shop by category</Typography>
                    </Box>
                    <Button component={Link} href="/products"
                        sx={{ color: '#0B3D91', fontWeight: 600, fontSize: 13, '&:hover': { bgcolor: '#EEF3FF' } }}>
                        View all →
                    </Button>
                </Stack>

                <Grid container spacing={{ xs: 1.5, md: 2 }}>
                    {categories.map(cat => (
                        <Grid key={cat.id} size={{ xs: 6, sm: 4, md: 4 }}>
                            <Box component={Link} href={`/products?category=${cat.slug}`}
                                sx={{
                                    display: 'block', bgcolor: '#fff', borderRadius: '12px',
                                    border: '0.5px solid #E8ECF2', overflow: 'hidden',
                                    textDecoration: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
                                    '&:hover': { borderColor: CATEGORY_COLORS[cat.slug] ?? '#0B3D91', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' },
                                }}>
                                <Box sx={{ height: 4, bgcolor: CATEGORY_COLORS[cat.slug] ?? '#8A94A6' }} />
                                <Box sx={{ p: { xs: 2, md: 2.5 } }}>
                                    <Typography sx={{ fontSize: { xs: 13, md: 14 }, fontWeight: 700, color: '#3D4A5C', mb: 0.5, lineHeight: 1.3 }}>
                                        {cat.name}
                                    </Typography>
                                    <Typography sx={{ fontSize: 12, color: '#8A94A6' }}>
                                        {cat.products_count} {cat.products_count === 1 ? 'product' : 'products'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* ── Features ── */}
            <Box sx={{ bgcolor: '#fff', borderTop: '0.5px solid #E8ECF2', borderBottom: '0.5px solid #E8ECF2' }}>
                <Container maxWidth="lg">
                    <Grid container>
                        {FEATURES.map((f, i) => (
                            <Grid key={i} size={{ xs: 12, md: 4 }}>
                                <Stack direction="row" spacing={2} alignItems="flex-start"
                                    sx={{
                                        px: { xs: 0, md: 4 }, py: { xs: 3, md: 4 },
                                        borderBottom: { xs: i < 2 ? '0.5px solid #E8ECF2' : 'none', md: 'none' },
                                        borderRight: { md: i < 2 ? '0.5px solid #E8ECF2' : 'none' },
                                    }}>
                                    <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#EEF3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {f.icon}
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#3D4A5C', mb: 0.5 }}>{f.title}</Typography>
                                        <Typography sx={{ fontSize: 13, color: '#8A94A6', lineHeight: 1.6 }}>{f.body}</Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* ── CTA ── */}
            <Box sx={{ bgcolor: '#0B3D91', py: { xs: 6, md: 8 } }}>
                <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 800, color: '#fff', mb: 1.5, letterSpacing: '-0.3px' }}>
                        Ready to order?
                    </Typography>
                    <Typography sx={{ fontSize: { xs: 14, md: 15 }, color: 'rgba(255,255,255,0.5)', mb: 4, lineHeight: 1.7 }}>
                        Browse our full range of frozen goods and get it delivered to your door.
                    </Typography>
                    <Button component={Link} href="/products" variant="contained" size="large"
                        sx={{ bgcolor: '#FF6B35', fontWeight: 700, fontSize: 15, px: 5, py: 1.5, '&:hover': { bgcolor: '#e55a26' } }}>
                        Shop now
                    </Button>
                </Container>
            </Box>
        </StorefrontLayout>
    );
}
