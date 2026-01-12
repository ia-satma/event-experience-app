# Planning Guide

Event Experience App: A comprehensive SaaS platform for managing the "XX Congreso Nacional de la Abogacía" with dual interfaces for staff administration and attendee engagement.

**Experience Qualities**: 
1. **Professional** - Creates confidence through clear hierarchy, refined typography, and a polished business aesthetic appropriate for legal professionals
2. **Efficient** - Enables rapid check-ins, instant QR scanning, and seamless navigation between admin functions without friction
3. **Accessible** - Provides intuitive mobile-first design ensuring both tech-savvy administrators and less technical attendees can navigate effortlessly

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This application requires role-based authentication, real-time QR code scanning with validation, dynamic content filtering based on ticket tiers, persistent state management, and multiple interconnected views for both administrators and attendees.

## Essential Features

### Authentication & Role Management
- **Functionality**: Email/password login with role detection (STAFF vs ATTENDEE)
- **Purpose**: Segregates administrative functions from attendee features while maintaining security
- **Trigger**: User enters credentials on landing page
- **Progression**: Login form → Credential validation → Role detection → Route to appropriate dashboard (Admin or Attendee)
- **Success criteria**: Correct routing based on user role, persistent session across page refreshes, logout functionality

### Ticket Purchase Gateway
- **Functionality**: Display three ticket tier cards (FULL, ACADEMIC, SOCIAL) with external purchase links
- **Purpose**: Provides clear pricing information and directs users to external payment processor
- **Trigger**: User clicks "Adquirir Entradas" button on landing page
- **Progression**: Landing page → Click purchase button → Modal/section displays → Three tier cards shown → Click external link → Redirect to BMA intranet
- **Success criteria**: Clear differentiation between tiers, working external links, responsive card layout

### Admin Metrics Dashboard
- **Functionality**: Real-time overview of event statistics (total attendees, check-ins, pending arrivals)
- **Purpose**: Provides at-a-glance insights for event coordinators to monitor attendance
- **Trigger**: Staff user logs in or navigates to dashboard
- **Progression**: Admin login → Dashboard view → Metrics cards display → Auto-refresh counters
- **Success criteria**: Accurate counts, visual hierarchy showing most important metrics, responsive layout

### Attendee Management Table
- **Functionality**: Searchable, filterable table of all registered attendees with status indicators
- **Purpose**: Enables staff to quickly locate attendees, verify registrations, and manage check-in status
- **Trigger**: Admin navigates to "Asistentes" section
- **Progression**: Click Asistentes → Table loads → Enter search query → Results filter in real-time → Click attendee row → View details
- **Success criteria**: Sub-100ms search response, clear status badges, sortable columns, mobile-responsive table

### QR Scanner for Check-In
- **Functionality**: Camera-based QR code reader that validates attendee codes and marks check-in
- **Purpose**: Streamlines entrance process, prevents duplicate entries, validates tickets
- **Trigger**: Admin navigates to "Escáner" section and activates camera
- **Progression**: Click Scanner → Camera permission request → Camera activates → QR code detected → Validation check → Success/error message → Mark as checked-in → Ready for next scan
- **Success criteria**: <2 second scan-to-validation time, clear success/error states, prevents duplicate check-ins, works in various lighting conditions

### Attendee QR Code Display
- **Functionality**: Generates and displays unique QR code for each attendee
- **Purpose**: Provides scannable entry credential for quick check-in at event entrance
- **Trigger**: Attendee logs in and views profile
- **Progression**: Attendee login → Profile view → QR code generates → Display with attendee info
- **Success criteria**: High-contrast QR code, works at various screen brightness levels, includes backup text code

### Personal Agenda Builder
- **Functionality**: Browse event sessions, filter by type, add favorites to personal schedule with tier-based restrictions
- **Purpose**: Enables attendees to plan their event experience and receive reminders for preferred sessions
- **Trigger**: Attendee navigates to "Mi Agenda" section
- **Progression**: Click Agenda → All sessions display → Filter by category → Click favorite icon → Validation check (ticket tier) → Add to favorites / Show restriction error → Personal schedule updates
- **Success criteria**: Clear visual feedback on favorites, tier restrictions enforced (SOCIAL cannot favorite ACADEMIC sessions), persistent favorites across sessions

### Diploma Download
- **Functionality**: Generate personalized attendance certificate after event completion
- **Purpose**: Provides official documentation of participation for professional development
- **Trigger**: Attendee navigates to diploma section (post-event)
- **Progression**: Click Diploma → Generation process → Preview diploma → Download as PDF
- **Success criteria**: Professional certificate design, includes attendee name and event details, downloadable format

## Edge Case Handling

- **Invalid QR Code**: Display clear error message "Código QR no válido" with visual feedback when scanned code doesn't match any attendee
- **Already Checked-In**: Show warning "Este asistente ya ingresó a las [HH:MM]" with timestamp to prevent duplicate entries
- **Camera Permission Denied**: Provide fallback message with instructions to enable camera access in browser settings
- **Network Offline**: Use cached data with visual indicator showing "Modo sin conexión - Los datos pueden no estar actualizados"
- **Tier Restriction Violation**: When SOCIAL ticket holder tries to favorite ACADEMIC session, show inline error "Tu entrada Social no incluye acceso a sesiones académicas"
- **Empty States**: Show helpful messages for empty favorites ("Aún no has marcado sesiones favoritas"), empty attendee search ("No se encontraron asistentes con ese criterio")
- **Session Expired**: Auto-logout after 24 hours with notification and redirect to login

## Design Direction

The design should evoke trust, professionalism, and institutional credibility appropriate for a legal conference. Visual language should feel refined and authoritative without being intimidating - think premium business software with warmth. The interface should communicate efficiency and modernity while respecting the formal nature of legal professionals.

## Color Selection

A sophisticated palette anchored in deep navy blues and refined grays, creating a professional yet approachable atmosphere suitable for legal professionals.

- **Primary Color**: Deep Navy Blue `oklch(0.35 0.08 250)` - Conveys authority, professionalism, and trust associated with legal institutions
- **Secondary Colors**: 
  - Cool Gray `oklch(0.55 0.01 250)` - Provides neutral balance for text and secondary UI elements
  - Soft Slate `oklch(0.92 0.01 250)` - Light background alternative maintaining color harmony
- **Accent Color**: Vibrant Cyan `oklch(0.65 0.15 210)` - Creates energy for CTAs and important interactive elements without overwhelming
- **Foreground/Background Pairings**:
  - Primary Navy `oklch(0.35 0.08 250)`: White text `oklch(0.98 0 0)` - Ratio 8.2:1 ✓
  - Accent Cyan `oklch(0.65 0.15 210)`: White text `oklch(0.98 0 0)` - Ratio 4.9:1 ✓
  - Cool Gray `oklch(0.55 0.01 250)`: White background `oklch(0.98 0 0)` - Ratio 5.1:1 ✓
  - Light background `oklch(0.97 0 0)`: Dark text `oklch(0.25 0 0)` - Ratio 11.3:1 ✓

## Font Selection

Typography should project authority and clarity while maintaining excellent readability across devices - choosing a modern geometric sans-serif that balances professional gravitas with contemporary accessibility.

- **Primary Typeface**: Space Grotesk for headings - Distinctive geometric forms create visual interest while maintaining professional credibility
- **Body Typeface**: Inter for body text and UI - Exceptional legibility at all sizes with carefully crafted spacing

- **Typographic Hierarchy**:
  - H1 (Page Titles): Space Grotesk Bold / 32px / -0.02em letter spacing / 1.1 line height
  - H2 (Section Headers): Space Grotesk Semibold / 24px / -0.01em letter spacing / 1.2 line height
  - H3 (Card Titles): Space Grotesk Medium / 18px / normal letter spacing / 1.3 line height
  - Body Large (Important content): Inter Regular / 16px / normal spacing / 1.6 line height
  - Body (Standard text): Inter Regular / 14px / normal spacing / 1.5 line height
  - Caption (Metadata): Inter Regular / 12px / normal spacing / 1.4 line height

## Animations

Animations should reinforce the application's efficiency and professionalism through purposeful micro-interactions that guide attention without distraction. Use subtle easing for state transitions (200-300ms), celebratory success animations for check-ins (scale + fade), and smooth page transitions (400ms) that maintain spatial context. Scanner feedback should be immediate (<100ms) with haptic-like visual pulse on successful scan.

## Component Selection

- **Components**: 
  - Navigation: Tabs component for admin dashboard sections (Métricas/Asistentes/Escáner)
  - Data Display: Table component with custom search input and badge components for status indicators
  - Forms: Input, Label, Button components for login with Form wrapper for validation
  - Feedback: Alert component for errors, toast notifications (sonner) for success messages
  - Modals: Dialog component for ticket purchase display and attendee details
  - Cards: Card component for metrics display, session listings, and ticket tiers
  - Scanner: Custom component wrapping html5-qrcode with overlay UI
  - QR Display: Custom component using react-qr-code library
  
- **Customizations**: 
  - Custom metric cards with icon circles and gradient backgrounds
  - Custom table with sticky headers and alternating row colors
  - Custom scanner overlay with animated corner brackets and scan line
  - Custom session cards with favorite toggle and tier badge
  
- **States**: 
  - Buttons: Default (solid primary), hover (darker shade + subtle lift), active (pressed inset), disabled (muted with reduced opacity)
  - Inputs: Default (border-input), focus (ring-2 ring-accent with border-accent), error (border-destructive with error text), filled (subtle background tint)
  - Table rows: Default (white/card), hover (muted background), selected (accent/10 background)
  - Scanner: Idle (camera view with overlay), scanning (animated scan line), success (green flash), error (red pulse)
  
- **Icon Selection**: 
  - Dashboard: BarChart3, Users, QrCode, Home
  - Actions: Plus, Search, Download, Star (filled/outline for favorites), Check, X
  - Navigation: ChevronRight, ArrowLeft, Menu
  - Status: CheckCircle2 (checked-in), Clock (pending), AlertTriangle (error)
  - Ticket tiers: Crown (FULL), GraduationCap (ACADEMIC), Users2 (SOCIAL)
  
- **Spacing**: 
  - Section padding: p-6 (desktop) / p-4 (mobile)
  - Card padding: p-6
  - Component gaps: gap-6 (major sections), gap-4 (related elements), gap-2 (tight groupings)
  - Page margins: max-w-7xl mx-auto for content constraint
  
- **Mobile**: 
  - Navigation tabs convert to bottom sheet or hamburger menu on mobile
  - Table switches to stacked card layout with key information visible
  - Metric cards stack vertically on mobile (grid-cols-1)
  - Scanner uses full viewport on mobile for optimal camera view
  - QR code scales appropriately maintaining scannability
  - Session cards remain single column with collapsible details
