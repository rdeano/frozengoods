import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { ShoppingCart as ShoppingCartIcon, Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { useCart } from '../Contexts/CartContext';

export default function StorefrontLayout({ children }) {
    const { appName, fbPageId } = usePage().props;
    const { count } = useCart();
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        if (!fbPageId) return;
        window.fbAsyncInit = function () {
            FB.init({ xfbml: true, version: 'v19.0' });
        };
        const script = document.createElement('script');
        script.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
        script.async = true;
        document.body.appendChild(script);
    }, [fbPageId]);

    const navLinks = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F5F7FA', display: 'flex', flexDirection: 'column' }}>

            {/* Top bar — hidden on very small screens */}
            <Box sx={{ bgcolor: '#072B6B', py: 0.75, display: { xs: 'none', sm: 'block' } }}>
                <Typography sx={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.03em' }}>
                    Free delivery on orders above ₱500 &nbsp;·&nbsp; Order by 5PM for same-day dispatch
                </Typography>
            </Box>

            {/* Navbar */}
            <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#fff', borderBottom: '0.5px solid #E8ECF2' }}>
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ minHeight: { xs: 56, md: 64 }, gap: 1 }}>

                        {/* Brand */}
                        <Box component={Link} href="/" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 1, flexGrow: { xs: 1, md: 0 }, mr: { md: 4 } }}>
                            <Box sx={{
                                width: 30, height: 30, borderRadius: '8px', bgcolor: '#0B3D91',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                                <Typography sx={{ color: '#fff', fontSize: 15, lineHeight: 1 }}>❄</Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 800, fontSize: { xs: 15, md: 17 }, color: '#0B3D91', letterSpacing: '-0.3px' }}>
                                {appName}
                            </Typography>
                        </Box>

                        {/* Desktop nav links */}
                        <Stack direction="row" sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {navLinks.map(n => (
                                <Button key={n.href} component={Link} href={n.href}
                                    sx={{ color: '#3D4A5C', fontWeight: 500, fontSize: 14, px: 1.5, '&:hover': { bgcolor: 'transparent', color: '#0B3D91' } }}>
                                    {n.label}
                                </Button>
                            ))}
                        </Stack>

                        {/* Cart button */}
                        <Button
                            component={Link}
                            href="/cart"
                            variant="contained"
                            startIcon={<ShoppingCartIcon sx={{ fontSize: '18px !important' }} />}
                            sx={{
                                bgcolor: '#FF6B35', fontWeight: 600, fontSize: 14,
                                px: { xs: 1.5, md: 2.5 }, height: { xs: 40, md: 40 },
                                minWidth: 'auto',
                                '&:hover': { bgcolor: '#e55a26' },
                            }}
                        >
                            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Cart</Box>
                            {count > 0 && <Box component="span" sx={{ ml: { xs: 0, sm: 0.5 } }}>({count})</Box>}
                        </Button>

                        {/* Mobile hamburger */}
                        <IconButton
                            onClick={() => setDrawerOpen(true)}
                            sx={{ display: { xs: 'flex', md: 'none' }, color: '#3D4A5C', ml: 0.5 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile drawer */}
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
                PaperProps={{ sx: { width: 260 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5, borderBottom: '0.5px solid #E8ECF2' }}>
                    <Typography sx={{ fontWeight: 800, fontSize: 15, color: '#0B3D91' }}>Menu</Typography>
                    <IconButton onClick={() => setDrawerOpen(false)} size="small">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                <List disablePadding>
                    {navLinks.map(n => (
                        <ListItemButton
                            key={n.href}
                            component={Link}
                            href={n.href}
                            onClick={() => setDrawerOpen(false)}
                            sx={{ py: 1.5, px: 2.5 }}
                        >
                            <ListItemText
                                primary={n.label}
                                primaryTypographyProps={{ fontWeight: 600, fontSize: 15, color: '#3D4A5C' }}
                            />
                        </ListItemButton>
                    ))}
                    <Divider />
                    <ListItemButton
                        component={Link}
                        href="/cart"
                        onClick={() => setDrawerOpen(false)}
                        sx={{ py: 1.5, px: 2.5 }}
                    >
                        <ListItemText
                            primary={`Cart${count > 0 ? ` (${count})` : ''}`}
                            primaryTypographyProps={{ fontWeight: 600, fontSize: 15, color: '#FF6B35' }}
                        />
                    </ListItemButton>
                </List>
            </Drawer>

            {/* Page content */}
            <Box sx={{ flex: 1 }}>{children}</Box>

            {/* Footer */}
            <Box component="footer" sx={{ bgcolor: '#0B3D91', pt: { xs: 5, md: 6 }, pb: 3, mt: 'auto' }}>
                <Container maxWidth="lg">
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 4, md: 8 }} sx={{ mb: 4 }}>
                        <Box sx={{ maxWidth: 280 }}>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                                <Box sx={{ width: 26, height: 26, borderRadius: '6px', bgcolor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography sx={{ color: '#fff', fontSize: 13 }}>❄</Typography>
                                </Box>
                                <Typography sx={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>{appName}</Typography>
                            </Stack>
                            <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
                                Sourced fresh, frozen at peak quality. Delivered straight to your door.
                            </Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1.5 }}>
                                Shop
                            </Typography>
                            <Stack spacing={1.25}>
                                {[['All Products', '/products'], ['Cart', '/cart'], ['Checkout', '/checkout']].map(([label, href]) => (
                                    <Link key={href} href={href} style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, textDecoration: 'none' }}>{label}</Link>
                                ))}
                            </Stack>
                        </Box>
                    </Stack>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 3 }} />
                    <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.28)' }}>
                        © {new Date().getFullYear()} {appName}. All rights reserved.
                    </Typography>
                </Container>
            </Box>

            {fbPageId && (
                <>
                    <div id="fb-root" />
                    <div className="fb-customerchat" attribution="biz_inbox" page_id={fbPageId}
                        theme_color="#1877F2"
                        logged_out_greeting="Hi! How can we help you?"
                        logged_in_greeting="Hi! Any questions about your order?" />
                </>
            )}
        </Box>
    );
}
