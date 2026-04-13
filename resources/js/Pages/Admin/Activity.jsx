import { Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';

export default function Activity({ activities }) {
    return (
        <AdminLayout title="Activity Log">
            <Head title="Activity Log" />

            <TableContainer component={Paper} sx={{ border: '0.5px solid #E8ECF2', boxShadow: 'none' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>When</TableCell>
                            <TableCell>Action</TableCell>
                            <TableCell>Subject</TableCell>
                            <TableCell>By</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {activities.data?.map(act => (
                            <TableRow key={act.id} hover>
                                <TableCell sx={{ color: '#8A94A6', fontSize: 12, whiteSpace: 'nowrap' }}>
                                    {new Date(act.created_at).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={act.description}
                                        size="small"
                                        sx={{ background: '#E6F0FF', color: '#0B3D91', fontWeight: 500, fontSize: 11 }}
                                    />
                                </TableCell>
                                <TableCell sx={{ fontSize: 12 }}>
                                    {act.subject_type
                                        ? `${act.subject_type.split('\\').pop()} #${act.subject_id}`
                                        : '—'}
                                </TableCell>
                                <TableCell sx={{ fontSize: 12 }}>
                                    {act.causer?.name ?? 'System'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {activities.data?.length === 0 && (
                <Typography color="text.secondary" sx={{ mt: 2 }}>No activity yet.</Typography>
            )}
        </AdminLayout>
    );
}
