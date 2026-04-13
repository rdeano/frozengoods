import Chip from '@mui/material/Chip';

const statusConfig = {
    pending:          { label: 'Pending',          bg: '#FAEEDA', color: '#854F0B' },
    confirmed:        { label: 'Confirmed',         bg: '#E0F9FB', color: '#007A87' },
    out_for_delivery: { label: 'Out for delivery',  bg: '#E6F0FF', color: '#0B3D91' },
    delivered:        { label: 'Delivered',         bg: '#E1F5EE', color: '#0F6E56' },
    cancelled:        { label: 'Cancelled',         bg: '#FCEBEB', color: '#A32D2D' },
};

export default function StatusBadge({ status }) {
    const { label, bg, color } = statusConfig[status] ?? { label: status, bg: '#f0f0f0', color: '#333' };

    return (
        <Chip
            label={label}
            size="small"
            sx={{ background: bg, color, fontWeight: 500, borderRadius: '9999px' }}
        />
    );
}
