import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {
    Dashboard as DashboardIcon,
    Inventory as InventoryIcon,
    Category as CategoryIcon,
    ReceiptLong as ReceiptLongIcon,
    BarChart as BarChartIcon,
    Settings as SettingsIcon,
    History as HistoryIcon,
    Menu as MenuIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 220;

const navItems = [
    { label: 'Dashboard',    href: '/admin',            icon: <DashboardIcon fontSize="small" /> },
    { label: 'Products',     href: '/admin/products',   icon: <InventoryIcon fontSize="small" /> },
    { label: 'Categories',   href: '/admin/categories', icon: <CategoryIcon fontSize="small" /> },
    { label: 'Orders',       href: '/admin/orders',     icon: <ReceiptLongIcon fontSize="small" /> },
    { label: 'Reports',      href: '/admin/reports',    icon: <BarChartIcon fontSize="small" /> },
    { label: 'Settings',     href: '/admin/settings',   icon: <SettingsIcon fontSize="small" /> },
    { label: 'Activity Log', href: '/admin/activity',   icon: <HistoryIcon fontSize="small" /> },
];

function DrawerContent({ url, onClose }) {
    return (
        <>
            <Box sx={{ p: 2, borderBottom: '0.5px solid #E8ECF2' }}>
                <Typography variant="h3" sx={{ color: '#0B3D91', fontWeight: 700 }}>
                    🧊 Admin
                </Typography>
            </Box>
            <List dense sx={{ px: 1, pt: 1 }}>
                {navItems.map(item => (
                    <ListItemButton
                        key={item.href}
                        component={Link}
                        href={item.href}
                        onClick={onClose}
                        selected={
                            url.startsWith(item.href) &&
                            (item.href !== '/admin' || url === '/admin')
                        }
                        sx={{
                            borderRadius: '8px',
                            mb: 0.5,
                            '&.Mui-selected': {
                                bgcolor: '#EEF3FF',
                                color: '#0B3D91',
                                '& .MuiListItemIcon-root': { color: '#0B3D91' },
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 32, color: '#8A94A6' }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                        />
                    </ListItemButton>
                ))}
            </List>
        </>
    );
}

export default function AdminLayout({ children, title }) {
    const { url, props: { auth } } = usePage();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Permanent sidebar — desktop only */}
            {!isMobile && (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: DRAWER_WIDTH,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: DRAWER_WIDTH,
                            boxSizing: 'border-box',
                            border: 'none',
                            borderRight: '0.5px solid #E8ECF2',
                            bgcolor: '#fff',
                        },
                    }}
                >
                    <DrawerContent url={url} onClose={() => {}} />
                </Drawer>
            )}

            {/* Temporary drawer — mobile only */}
            {isMobile && (
                <Drawer
                    variant="temporary"
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: DRAWER_WIDTH,
                            boxSizing: 'border-box',
                            border: 'none',
                            bgcolor: '#fff',
                        },
                    }}
                >
                    <DrawerContent url={url} onClose={() => setDrawerOpen(false)} />
                </Drawer>
            )}

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <AppBar
                    position="static"
                    sx={{ bgcolor: '#fff', borderBottom: '0.5px solid #E8ECF2', boxShadow: 'none' }}
                >
                    <Toolbar sx={{ gap: 1 }}>
                        {isMobile && (
                            <IconButton
                                edge="start"
                                onClick={() => setDrawerOpen(true)}
                                sx={{ color: '#3D4A5C', mr: 0.5 }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Typography variant="h2" sx={{ flexGrow: 1 }} noWrap>
                            {title}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}
                        >
                            {auth?.user?.name}
                        </Typography>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => router.post('/logout')}
                            sx={{ borderColor: '#E8ECF2', color: '#8A94A6', whiteSpace: 'nowrap' }}
                        >
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>

                <Box sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1, minWidth: 0 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
