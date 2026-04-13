# DESIGN.md — Frozen Goods UI Design System

## Overview

Bold, colorful, Filipino market feel. The storefront is eye-catching and energetic —
deep blue + icy cyan communicates "frozen/cold", orange CTAs grab attention. The admin
panel is the opposite: neutral, data-focused, color only for status and alerts.

All styling goes through the MUI v6 theme and `sx` prop exclusively. No Tailwind,
no plain CSS, no inline `style` attributes. If something can be done with MUI `sx`,
that is the only way to do it.

---

## Color Palette

### Brand colors

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#0B3D91` | Navbar, headings, links, primary buttons, product prices |
| `primary.light` | `#1A56C4` | Hover states on primary elements |
| `primary.dark` | `#072B6B` | Active states, pressed buttons |
| `accent` | `#00C2D4` | Confirmed badge, secondary highlights, accent borders |
| `accent.light` | `#E0F9FB` | Accent tint backgrounds |
| `highlight` | `#FF6B35` | All CTA buttons (Add to cart, Checkout, Order now) |
| `highlight.light` | `#FFF0EB` | CTA tint backgrounds, low stock badge |
| `neutral.bg` | `#F5F7FA` | Page background (storefront) |
| `neutral.100` | `#E8ECF2` | Borders, dividers, input backgrounds |
| `neutral.400` | `#8A94A6` | Muted text, placeholders, inactive chips |
| `neutral.700` | `#3D4A5C` | Body text, labels |

### Semantic colors

| Token | Hex | Usage |
|---|---|---|
| `success` | `#1D9E75` | Delivered badge, positive stats |
| `warning` | `#BA7517` | Pending badge, low stock warning |
| `danger` | `#E24B4A` | Cancelled badge, out-of-stock, error states |

### Color rules

- **Orange (`#FF6B35`) is for CTAs only** — add to cart, checkout, confirm order.
  Never use it for informational or decorative purposes.
- **Blue (`#0B3D91`) is for brand identity** — navbar, prices, primary actions.
- **Cyan (`#00C2D4`) is for confirmed/active states** — not a primary action color.
- Never put blue text on a cyan background or cyan text on a blue background.
- White text on `#0B3D91` — always legible.
- Dark blue (`#072B6B`) text on `#00C2D4` — use for cyan-background labels.
- Dark blue (`#072B6B`) text on `#FF6B35` is too low contrast — use white instead.

---

## Typography

Font stack: MUI default (`Inter, Roboto, system-ui, sans-serif`)

| Role | Size | Weight | Color | Usage |
|---|---|---|---|---|
| Display | 28px | 700 | `#0B3D91` | Hero headline only |
| H1 | 24px | 700 | `#0B3D91` | Page titles |
| H2 | 18px | 600 | `#3D4A5C` | Section headings |
| H3 | 15px | 600 | `#3D4A5C` | Card headings, product names |
| Body | 14px | 400 | `#3D4A5C` | General body text |
| Small | 12px | 400 | `#8A94A6` | Captions, meta, timestamps |
| Label | 11px | 500 | `#8A94A6` | Uppercase tracking labels (admin stats) |
| Price | 16px | 700 | `#0B3D91` | Product prices — always bold blue |
| Badge | 12px | 500 | varies | Status badges — never plain black |

### Typography rules

- Never use font weight below 400 or above 700
- Uppercase labels (admin stat cards): `font-size: 11px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase`
- Line height: `1.3` for headings, `1.6` for body, `1` for badges/chips
- Never center-align body text blocks longer than 2 lines

---

## Spacing & Layout

### Spacing scale (use these values only)

`4px · 8px · 12px · 16px · 20px · 24px · 32px · 48px · 64px`

### Border radius scale

| Token | Value | Usage |
|---|---|---|
| `sm` | `6px` | Badges, chips, small buttons |
| `md` | `10px` | Inputs, regular buttons, stat cards |
| `lg` | `16px` | Product cards, admin cards, modals |
| `xl` | `24px` | Hero banner, large containers |
| `full` | `9999px` | Pills, avatar circles, round icon buttons |

### Borders

- Default: `0.5px solid #E8ECF2`
- Emphasis: `0.5px solid #8A94A6`
- Featured/selected: `2px solid #0B3D91` (the only 2px case)
- Never use 1px borders — always 0.5px or 2px

---

## MUI v6 Theme Config

Set this up in `resources/js/theme.js` and wrap the app in `<ThemeProvider theme={theme}>`.

```js
// resources/js/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main:  '#0B3D91',
      light: '#1A56C4',
      dark:  '#072B6B',
      contrastText: '#ffffff',
    },
    secondary: {
      main:  '#00C2D4',
      light: '#E0F9FB',
      dark:  '#007A87',
      contrastText: '#072B6B',
    },
    error:   { main: '#E24B4A' },
    warning: { main: '#BA7517' },
    success: { main: '#1D9E75' },
    background: {
      default: '#F5F7FA',
      paper:   '#FFFFFF',
    },
    text: {
      primary:   '#3D4A5C',
      secondary: '#8A94A6',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, system-ui, sans-serif',
    h1: { fontSize: '24px', fontWeight: 700, color: '#0B3D91' },
    h2: { fontSize: '18px', fontWeight: 600, color: '#3D4A5C' },
    h3: { fontSize: '15px', fontWeight: 600, color: '#3D4A5C' },
    body1: { fontSize: '14px', fontWeight: 400, lineHeight: 1.6 },
    body2: { fontSize: '12px', fontWeight: 400, color: '#8A94A6' },
    caption: { fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em' },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: '10px',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          border: '0.5px solid #E8ECF2',
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: '9999px', fontWeight: 500 },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: { borderRadius: '10px' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: '12px',
          color: '#8A94A6',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          backgroundColor: '#F5F7FA',
        },
      },
    },
  },
});

export default theme;
```

---

## Component Patterns

### Storefront navbar

```jsx
<AppBar position="sticky" sx={{ background: '#0B3D91', boxShadow: 'none' }}>
  <Toolbar>
    <Typography variant="h3" sx={{ color: '#fff', flexGrow: 1, fontWeight: 700 }}>
      🧊 FrozenGoods
    </Typography>
    <Button sx={{ color: 'rgba(255,255,255,0.75)' }}>Products</Button>
    <Button sx={{ color: 'rgba(255,255,255,0.75)' }}>About</Button>
    <Button
      variant="contained"
      sx={{ background: '#FF6B35', ml: 1, '&:hover': { background: '#e55a26' } }}
    >
      Cart (3)
    </Button>
  </Toolbar>
</AppBar>
```

### Hero banner

```jsx
<Box sx={{
  background: '#0B3D91',
  borderRadius: '24px',
  p: { xs: 3, md: 5 },
  color: '#fff',
}}>
  <Typography sx={{ fontSize: 11, color: '#00C2D4', fontWeight: 500,
    letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1 }}>
    Fresh · Frozen · Delivered
  </Typography>
  <Typography variant="h1" sx={{ color: '#fff', mb: 1 }}>
    Quality frozen goods for your family
  </Typography>
  <Typography sx={{ color: 'rgba(255,255,255,0.65)', mb: 3 }}>
    Meats, seafood, vegetables — sourced fresh, frozen at peak quality
  </Typography>
  <Stack direction="row" gap={1}>
    <Button variant="contained"
      sx={{ background: '#FF6B35', '&:hover': { background: '#e55a26' } }}>
      Shop now
    </Button>
    <Button sx={{ color: '#fff', background: 'rgba(255,255,255,0.12)',
      '&:hover': { background: 'rgba(255,255,255,0.2)' } }}>
      View categories
    </Button>
  </Stack>
</Box>
```

### Category filter chips

```jsx
// Active chip
<Chip label="All" sx={{
  background: '#0B3D91', color: '#fff',
  border: '1.5px solid #0B3D91', fontWeight: 500,
}} />

// Inactive chip
<Chip label="Meats" variant="outlined" sx={{
  color: '#8A94A6', borderColor: '#E8ECF2', fontWeight: 500,
}} />
```

### Product card (storefront)

```jsx
<Card sx={{ width: 200, cursor: 'pointer',
  '&:hover': { borderColor: '#0B3D91', transition: 'border-color 0.15s' } }}>
  <CardMedia
    component="img"
    height="120"
    image={product.image_url ?? '/placeholder-frozen.jpg'}
    alt={product.name}
    sx={{ objectFit: 'cover' }}
  />
  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
    <Typography variant="h3" noWrap>{product.name}</Typography>
    <Typography variant="body2" sx={{ mb: 1 }}>
      {product.category.name} · {product.unit}
    </Typography>
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#0B3D91' }}>
        ₱{product.price}
      </Typography>
      {product.is_available ? (
        <IconButton size="small" onClick={() => addToCart(product)}
          sx={{ background: '#FF6B35', color: '#fff', width: 28, height: 28,
            '&:hover': { background: '#e55a26' } }}>
          <AddIcon fontSize="small" />
        </IconButton>
      ) : (
        <Typography variant="body2" sx={{ color: '#E24B4A' }}>Out of stock</Typography>
      )}
    </Stack>
  </CardContent>
</Card>
```

### CTA button (add to cart / checkout)

```jsx
<Button
  variant="contained"
  fullWidth
  sx={{
    background: '#FF6B35',
    fontSize: 15,
    fontWeight: 600,
    py: 1.5,
    '&:hover': { background: '#e55a26' },
  }}
>
  Checkout · ₱{total}
</Button>
```

### Order status badge

```jsx
const statusConfig = {
  pending:          { label: 'Pending',          bg: '#FAEEDA', color: '#854F0B' },
  confirmed:        { label: 'Confirmed',         bg: '#E0F9FB', color: '#007A87' },
  out_for_delivery: { label: 'Out for delivery',  bg: '#E6F0FF', color: '#0B3D91' },
  delivered:        { label: 'Delivered',         bg: '#E1F5EE', color: '#0F6E56' },
  cancelled:        { label: 'Cancelled',         bg: '#FCEBEB', color: '#A32D2D' },
};

const { label, bg, color } = statusConfig[order.status];

<Chip label={label} size="small" sx={{
  background: bg, color, fontWeight: 500, borderRadius: '9999px',
}} />
```

### Admin stat card

```jsx
<Card sx={{ p: 2, minWidth: 130 }}>
  <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
    Orders today
  </Typography>
  <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#0B3D91' }}>
    12
  </Typography>
  <Typography variant="body2" sx={{ color: '#1D9E75', mt: 0.5 }}>
    +3 from yesterday
  </Typography>
</Card>
```

### Admin data table (orders)

```jsx
<TableContainer component={Paper} sx={{ border: '0.5px solid #E8ECF2', boxShadow: 'none' }}>
  <Table size="small">
    <TableHead>
      <TableRow>
        <TableCell>Order</TableCell>
        <TableCell>Customer</TableCell>
        <TableCell>Type</TableCell>
        <TableCell>Status</TableCell>
        <TableCell align="right">Total</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {orders.map(order => (
        <TableRow key={order.id} hover sx={{ cursor: 'pointer' }}>
          <TableCell sx={{ fontWeight: 600, color: '#0B3D91' }}>
            #{order.id}
          </TableCell>
          <TableCell>{order.customer_name}</TableCell>
          <TableCell sx={{ color: '#8A94A6', fontSize: 12 }}>
            {order.delivery_type}
          </TableCell>
          <TableCell><StatusBadge status={order.status} /></TableCell>
          <TableCell align="right" sx={{ fontWeight: 600 }}>
            ₱{order.total}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
```

### Messenger button (confirmation page — mobile)

```jsx
<Button
  href={`https://m.me/${fbPageUsername}?text=${encodeURIComponent(
    `Hi! I just placed Order #${order.id} on your website.`
  )}`}
  variant="contained"
  fullWidth
  sx={{
    background: '#1877F2',
    fontSize: 15,
    fontWeight: 600,
    py: 1.5,
    '&:hover': { background: '#1464d8' },
  }}
>
  Message us on Messenger
</Button>
```

---

## Storefront vs Admin — Key Differences

| Concern | Storefront | Admin |
|---|---|---|
| Page background | `#F5F7FA` | `#F5F7FA` |
| Navbar | Deep blue `#0B3D91` | White with blue left sidebar |
| Primary action color | Orange `#FF6B35` | Blue `#0B3D91` |
| Card style | White, `border-radius: 16px`, subtle border | White, `border-radius: 10px`, subtle border |
| Typography feel | Bold, larger, eye-catching | Compact, data-dense, smaller |
| Color usage | Rich — hero, chips, CTAs all colored | Minimal — color only for status badges and alerts |
| Fonts | Slightly larger (15–24px headlines) | Smaller (12–15px, more rows visible) |

---

## Layout Breakpoints (MUI defaults)

| Breakpoint | Width | Layout |
|---|---|---|
| `xs` | 0px+ | Single column, stacked |
| `sm` | 600px+ | 2-column product grid |
| `md` | 900px+ | 3-column product grid, sidebar visible |
| `lg` | 1200px+ | 4-column product grid, full admin layout |

Product grid: use MUI v6 `Grid` with `size={{ xs: 6, sm: 4, md: 3 }}` per product item.
Minimum card width ~180px — use `Grid` with `spacing={2}` (16px gap).

```jsx
// MUI v6 Grid syntax — no more item prop, use size instead
<Grid container spacing={2}>
  {products.map(product => (
    <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3 }}>
      <ProductCard product={product} />
    </Grid>
  ))}
</Grid>
```

---

## Do's and Don'ts

**Do**
- Use `#FF6B35` for every primary CTA (add to cart, checkout, confirm)
- Use `#0B3D91` for prices, links, and brand elements
- Keep admin UI neutral — let the data speak
- Use `noWrap` + `overflow: hidden` on product names in cards
- Always show peso sign (₱) before prices, no space

**Don't**
- Don't use gradients anywhere
- Don't use box shadows (MUI elevation) — use borders instead (`boxShadow: 'none'`)
- Don't use plain CSS, inline style attributes, or any styling outside MUI `sx`
- Don't use orange in the admin panel — it belongs to the storefront CTA only
- Don't center long text blocks
- Don't hardcode pixel widths on cards — use `minmax` grid or `flexWrap`
