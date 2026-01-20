# SuperBryn Web Frontend

React frontend for the SuperBryn AI voice appointment assistant.

## Features

- **Voice Conversation Interface**: Real-time voice chat with AI assistant
- **Visual Avatar**: Animated avatar synced with speech
- **Tool Call Timeline**: Visual display of actions taken
- **Live Transcript**: Toggle-able conversation transcript
- **Conversation History**: View past conversations
- **Text Fallback**: Chat interface when microphone unavailable
- **Admin Panel**: View all appointments

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Real-time**: LiveKit Client SDK
- **Routing**: React Router

## Project Structure

```
superbryn-web/
├── src/
│   ├── components/
│   │   ├── Avatar.tsx       # Avatar display
│   │   ├── Timeline.tsx     # Tool call timeline
│   │   ├── Transcript.tsx   # Conversation transcript
│   │   ├── Summary.tsx      # Call summary modal
│   │   ├── Controls.tsx     # Call controls
│   │   └── TextFallback.tsx # Text chat fallback
│   ├── context/
│   │   └── ConversationContext.tsx  # State management
│   ├── hooks/
│   │   └── useLiveKit.ts    # LiveKit integration
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ConversationPage.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── AdminPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── services/
│   │   └── api.ts           # Backend API client
│   ├── types/
│   │   └── index.ts         # TypeScript definitions
│   ├── styles/
│   │   └── index.css        # Global styles
│   ├── App.tsx
│   └── main.tsx
├── public/
├── .env.example
├── vercel.json
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/superbryn-web.git
cd superbryn-web
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

Required environment variables:
- `VITE_API_URL`: Backend API URL
- `VITE_LIVEKIT_URL`: LiveKit WebSocket URL

### 4. Run development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Pages

### Home (`/`)
- Landing page with agent introduction
- Phone number input for returning users
- Recent conversation history preview
- Start conversation button

### Conversation (`/conversation`)
- Main voice conversation interface
- Split view: avatar (left) + timeline/transcript (right)
- Call controls (mute, end, reset)
- Text fallback when microphone unavailable

### History (`/history`)
- Full conversation history by phone number
- Expandable conversation details
- Key points and appointment summaries

### Admin (`/admin`)
- Password-protected admin panel
- All appointments table
- Basic statistics
- Pagination support

## Components

### Avatar
Displays the Beyond Presence avatar or placeholder with state indicators.

### Timeline
Shows tool calls in a vertical timeline with:
- User-friendly action descriptions (default)
- Technical details (toggleable)
- Status indicators (pending/completed/failed)

### Transcript
Live conversation transcript with:
- User/assistant message distinction
- Auto-scroll on new messages
- Toggle visibility

### Summary
End-of-call modal displaying:
- Conversation overview
- Key points
- Appointments affected
- Session metrics

## Styling

The app uses a dark theme with:
- Background: `#0f0f0f`
- Surface: `#1a1a1a`
- Accent: `#6366f1` (indigo)
- Smooth animations (150-300ms)
- Soft corner buttons (8-12px radius)
- Bordered cards

## Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Set environment variables:
   - `VITE_API_URL`
   - `VITE_LIVEKIT_URL`
3. Deploy

### Manual Build

```bash
npm run build
# Output in dist/ folder
```

## Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run type-check # TypeScript type checking
```

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

Microphone access requires HTTPS in production.

## License

MIT
