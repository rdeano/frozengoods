import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

export default function Settings({ settings }) {
    const { flash } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        business_name:    settings.business_name ?? '',
        fb_page_username: settings.fb_page_username ?? '',
        fb_page_id:       settings.fb_page_id ?? '',
        delivery_fee:     settings.delivery_fee ?? '50',
        delivery_areas:   settings.delivery_areas ?? '',
        allow_delivery:   settings.allow_delivery === 'true',
        allow_pickup:     settings.allow_pickup === 'true',
    });

    const submit = (e) => {
        e.preventDefault();
        put('/admin/settings');
    };

    return (
        <AdminLayout title="Settings">
            <Head title="Settings" />

            {flash?.success && <Alert severity="success" sx={{ mb: 2 }}>{flash.success}</Alert>}

            <Box component="form" onSubmit={submit} sx={{ maxWidth: 560 }}>
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="h2" sx={{ mb: 2 }}>Business</Typography>
                        <TextField
                            fullWidth
                            label="Business name"
                            value={data.business_name}
                            onChange={e => setData('business_name', e.target.value)}
                            error={!!errors.business_name}
                            helperText={errors.business_name}
                            required
                        />
                    </Box>

                    <Divider />

                    <Box>
                        <Typography variant="h2" sx={{ mb: 1 }}>Facebook Messenger</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Required for the customer contact widget.
                        </Typography>
                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                label="FB Page username (for m.me link)"
                                value={data.fb_page_username}
                                onChange={e => setData('fb_page_username', e.target.value)}
                                helperText="e.g. frozengoodsph — used for mobile m.me deep link"
                            />
                            <TextField
                                fullWidth
                                label="FB Page ID (numeric — for chat widget)"
                                value={data.fb_page_id}
                                onChange={e => setData('fb_page_id', e.target.value)}
                                helperText="e.g. 123456789012345 — find it in your FB Page's About section"
                            />
                        </Stack>
                    </Box>

                    <Divider />

                    <Box>
                        <Typography variant="h2" sx={{ mb: 2 }}>Delivery options</Typography>
                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                label="Delivery fee (₱)"
                                type="number"
                                value={data.delivery_fee}
                                onChange={e => setData('delivery_fee', e.target.value)}
                                inputProps={{ min: 0, step: '0.01' }}
                            />
                            <TextField
                                fullWidth
                                label="Delivery areas"
                                value={data.delivery_areas}
                                onChange={e => setData('delivery_areas', e.target.value)}
                                multiline
                                rows={2}
                                helperText="Shown to customers on checkout"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={data.allow_delivery}
                                        onChange={e => setData('allow_delivery', e.target.checked)}
                                    />
                                }
                                label="Allow delivery"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={data.allow_pickup}
                                        onChange={e => setData('allow_pickup', e.target.checked)}
                                    />
                                }
                                label="Allow pickup"
                            />
                        </Stack>
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={processing}
                        sx={{ alignSelf: 'flex-start' }}
                    >
                        Save settings
                    </Button>
                </Stack>
            </Box>
        </AdminLayout>
    );
}
