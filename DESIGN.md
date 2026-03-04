# NITI-SETU: Farmers Voice - Design Document

## System Architecture

### High-Level Architecture
```
┌─────────────────┐
│   User Device   │
│  (Web Browser)  │
└────────┬────────┘
         │
         │ HTTPS
         ▼
┌─────────────────────────────────┐
│     React Frontend (Vite)       │
│  ┌──────────────────────────┐   │
│  │   Components Layer       │   │
│  │  - Header                │   │
│  │  - ProfileInput          │   │
│  │  - Dashboard             │   │
│  │  - ChatBot               │   │
│  │  - EligibilityResults    │   │
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │   Services Layer         │   │
│  │  - AI Service            │   │
│  │  - Voice Service         │   │
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │   State Management       │   │
│  │  - React Hooks           │   │
│  └──────────────────────────┘   │
└────────┬────────────────────────┘
         │
         │ API Calls
         ▼
┌─────────────────────────────────┐
│    Google Gemini AI API         │
│  - Natural Language Processing  │
│  - Voice Recognition            │
│  - Eligibility Analysis         │
└─────────────────────────────────┘
```

## Component Design

### 1. App Component (Root)
**Purpose**: Main application container managing view state and data flow

**State**:
- `view`: Current view ('profileInput' | 'dashboard')
- `farmerProfile`: Farmer profile data
- `eligibilityResults`: Array of eligibility results
- `isLoading`: Loading state indicator

**Methods**:
- `handleProfileSubmit()`: Process profile submission and switch to dashboard
- `handleCheckAnother()`: Reset state and return to profile input

### 2. Header Component
**Purpose**: Application branding and navigation

**Features**:
- Display application logo and title
- Responsive design for mobile/desktop
- Dark theme styling

### 3. ProfileInput Component
**Purpose**: Collect farmer information via voice or text

**Features**:
- Voice input with microphone integration
- Text input fields for all profile data
- Language selection (Hindi/English)
- Form validation
- Loading state during processing
- Integration with AI service for voice processing

**Input Fields**:
- Name (text)
- State (dropdown/text)
- District (dropdown/text)
- Land Holding (number, in acres)
- Crop Type (text/dropdown)
- Social Category (dropdown: General, SC, ST, OBC)

### 4. Dashboard Component
**Purpose**: Display eligibility results and provide interactive features

**Sub-components**:
- ProfileSummary: Display farmer profile information
- MetricsCard: Show eligibility statistics
- EligibilityResults: List of schemes with eligibility status
- ChatBot: Interactive Q&A interface
- FAQ: Common questions and answers

**Features**:
- Summary metrics (total schemes, eligible count, confidence scores)
- "Check Another Profile" button
- Responsive grid layout

### 5. EligibilityResults Component
**Purpose**: Display detailed eligibility information for each scheme

**Features**:
- List of SchemeCard components
- Filter/sort functionality
- Visual indicators for eligibility status
- Expandable details for each scheme

### 6. SchemeCard Component
**Purpose**: Display individual scheme information

**Data Displayed**:
- Scheme name
- Eligibility status (eligible/not eligible)
- Confidence score
- Proof text from official documents
- Citation (page number, section)
- Required documents list
- Reasoning for eligibility decision

**Visual Design**:
- Color-coded status (green for eligible, red for not eligible)
- Progress bar for confidence score
- Collapsible sections for detailed information

### 7. ChatBot Component
**Purpose**: Provide interactive Q&A about schemes

**Features**:
- Chat interface with message history
- Voice input support
- Text input support
- AI-powered responses using Gemini API
- Context-aware responses based on farmer profile

### 8. FAQ Component
**Purpose**: Display frequently asked questions

**Features**:
- Collapsible question/answer pairs
- Search functionality
- Categorized questions
- Bilingual support

## Data Models

### FarmerProfile Interface
```typescript
interface FarmerProfile {
  _id?: string;
  name: string;
  state: string;
  district: string;
  landHolding: number;
  cropType: string;
  socialCategory: SocialCategory;
}
```

### EligibilityResult Interface
```typescript
interface EligibilityResult {
  schemeName: string;
  isEligible: boolean;
  confidence: number;
  proofText: string;
  citation: {
    page: number | string;
    section: string;
  };
  requiredDocuments: string[];
  reasoning: string;
}
```

### SocialCategory Enum
```typescript
enum SocialCategory {
  GENERAL = 'General',
  SC = 'SC',
  ST = 'ST',
  OBC = 'OBC',
}
```

## Service Layer Design

### AI Service
**Purpose**: Interface with Google Gemini AI API

**Methods**:
- `analyzeEligibility(profile: FarmerProfile): Promise<EligibilityResult[]>`
- `processVoiceInput(audioData: Blob, language: string): Promise<FarmerProfile>`
- `answerQuery(query: string, context: FarmerProfile): Promise<string>`

**Responsibilities**:
- API authentication and request management
- Error handling and retry logic
- Response parsing and validation
- Rate limiting management

### Voice Service
**Purpose**: Handle voice input and processing

**Methods**:
- `startRecording(): void`
- `stopRecording(): Promise<Blob>`
- `convertToText(audio: Blob, language: string): Promise<string>`

**Responsibilities**:
- Microphone access management
- Audio recording and encoding
- Integration with speech-to-text API
- Language detection and switching

## State Management

### Application State Flow
```
User Input → ProfileInput Component
    ↓
Voice/Text Processing → AI Service
    ↓
Profile Data → App State (farmerProfile)
    ↓
Eligibility Analysis → AI Service
    ↓
Results → App State (eligibilityResults)
    ↓
Display → Dashboard Component
```

### State Management Strategy
- React useState hooks for component-level state
- Props drilling for parent-child communication
- Callback functions for child-to-parent communication
- No external state management library (Redux, MobX) needed for current scope

## UI/UX Design

### Design System

**Color Palette**:
- Background: Gray-900 (#111827)
- Text Primary: Gray-200 (#E5E7EB)
- Text Secondary: Gray-400 (#9CA3AF)
- Success: Green-500 (#10B981)
- Error: Red-500 (#EF4444)
- Primary Accent: Blue-500 (#3B82F6)

**Typography**:
- Font Family: System fonts (sans-serif)
- Headings: Bold, larger sizes
- Body: Regular weight, readable sizes
- Code/Citations: Monospace font

**Spacing**:
- Container padding: 1rem (mobile), 2rem (desktop)
- Component margins: 1rem - 2rem
- Grid gaps: 1rem - 1.5rem

### Responsive Design Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Accessibility Considerations
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatibility
- High contrast text
- Focus indicators
- Alt text for icons

## API Integration

### Gemini AI API

**Authentication**:
- API key stored in environment variable (GEMINI_API_KEY)
- Passed in request headers

**Endpoints Used**:
- Text generation for eligibility analysis
- Speech-to-text for voice input
- Conversational AI for chatbot

**Request Format**:
```typescript
{
  model: "gemini-pro",
  prompt: string,
  context: object,
  parameters: {
    temperature: number,
    maxTokens: number
  }
}
```

**Error Handling**:
- Network errors: Retry with exponential backoff
- API errors: Display user-friendly messages
- Rate limiting: Queue requests
- Timeout: 30 second limit

## Security Considerations

### Data Protection
- No persistent storage of farmer data
- Session-based data only
- No PII transmitted without encryption
- API keys stored in environment variables

### Input Validation
- Sanitize all user inputs
- Validate data types and ranges
- Prevent injection attacks
- Limit input lengths

### API Security
- HTTPS only
- API key rotation policy
- Rate limiting on client side
- Error messages don't expose sensitive info

## Performance Optimization

### Frontend Optimization
- Code splitting with Vite
- Lazy loading of components
- Memoization of expensive computations
- Debouncing of voice input processing

### API Optimization
- Request batching where possible
- Caching of common responses
- Compression of request/response data
- Timeout management

### Asset Optimization
- Minified JavaScript and CSS
- Optimized images
- Tree shaking of unused code
- Gzip compression

## Deployment Architecture

### Build Process
```
Source Code (TypeScript/React)
    ↓
Vite Build (npm run build)
    ↓
Optimized Static Assets
    ↓
Deployment to Hosting Platform
```

### Environment Configuration
- Development: Local Vite dev server
- Production: Static hosting (Vercel, Netlify, etc.)
- Environment variables: .env.local (dev), platform config (prod)

### Hosting Requirements
- Static file hosting
- HTTPS support
- CDN for asset delivery
- Environment variable support

## Testing Strategy

### Unit Testing
- Component rendering tests
- Service method tests
- Utility function tests
- Type validation tests

### Integration Testing
- API integration tests
- Component interaction tests
- State management tests
- Voice input flow tests

### End-to-End Testing
- Complete user flows
- Voice input to results
- Chatbot interactions
- Error scenarios

### Manual Testing
- Voice recognition accuracy
- UI/UX validation
- Cross-browser compatibility
- Mobile responsiveness

## Future Enhancements

### Phase 2 Features
- User authentication and profile saving
- Application tracking system
- SMS/Email notifications
- Offline mode support
- Multi-language support (regional languages)

### Phase 3 Features
- Integration with government portals
- Direct application submission
- Document upload and verification
- Scheme recommendation engine
- Analytics dashboard for administrators

## Maintenance & Monitoring

### Logging
- Error logging for debugging
- Usage analytics
- Performance metrics
- API call tracking

### Monitoring
- Uptime monitoring
- Error rate tracking
- API response times
- User engagement metrics

### Updates
- Regular dependency updates
- Security patches
- Feature enhancements
- Bug fixes based on user feedback
