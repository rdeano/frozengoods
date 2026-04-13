import { Link, usePage } from '@inertiajs/react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
    Dashboard as DashboardIcon,
    Inventory as InventoryIcon,
    Category as CategoryIcon,
    ReceiptLong as ReceiptLongIcon,
    Settings as SettingsIcon,
    History as HistoryIcon,
} from '@mui/icons-material';
import Button from '@mui/material/Button';
import { router } from '@inertiajs/react';

const DRAWER_WIDTH = 220;

const navItems = [
    { label: 'Dashboard',   href: '/admin',            icon: <DashboardIcon fontSize="small" /> },
    { label: 'Products',    href: '/admin/products',   icon: <InventoryIcon fontSize="small" /> },
    { label: 'Categories',  href: '/admin/categories', icon: <CategoryIcon fontSize="small" /> },
    { label: 'Orders',      href: '/admin/orders',     icon: <ReceiptLongIcon fontSize="small" /> },
    { label: 'Settings',    href: '/admin/settings',   icon: <SettingsIcon fontSize="small" /> },
    { label: 'Activity Log',href: '/admin/activity',   icon: <HistoryIcon fontSize="small" /> },
];

export default function AdminLayout({ children, title }) {
    const { url, props: { auth } } = usePage();

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
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
                            selected={url.startsWith(item.href) && (item.href !== '/admin' || url === '/admin')}
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
            </Drawer>

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <AppBar
                    position="static"
                    sx={{ bgcolor: '#fff', borderBottom: '0.5px solid #E8ECF2', boxShadow: 'none' }}
                >
                    <Toolbar>
                        <Typography variant="h2" sx={{ flexGrow: 1 }}>
                            {title}
                        </Typography>
                        <Typography variant="body2" sx={{ mr: 2 }}>
                            {auth?.user?.name}
                        </Typography>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => router.post('/logout')}
                            sx={{ borderColor: '#E8ECF2', color: '#8A94A6' }}
                        >
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>

                <Box sx={{ p: 3, flexGrow: 1 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
