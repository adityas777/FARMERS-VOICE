# NITI-SETU: Farmers Voice - Requirements Document

## Project Overview
NITI-SETU is an AI-powered voice-based agricultural scheme eligibility engine that helps farmers check their eligibility for various government agricultural schemes using voice commands in Hindi or English.

## Functional Requirements

### 1. User Input & Profile Management
- **FR-1.1**: System shall accept farmer profile information including:
  - Name
  - State and District
  - Land holding (in acres)
  - Crop type
  - Social category (General, SC, ST, OBC)
- **FR-1.2**: System shall support voice input in Hindi and English languages
- **FR-1.3**: System shall provide text-based input as an alternative to voice
- **FR-1.4**: System shall validate all input fields before processing

### 2. Eligibility Assessment
- **FR-2.1**: System shall analyze farmer profile against government agricultural schemes
- **FR-2.2**: System shall determine eligibility status (eligible/not eligible) for each scheme
- **FR-2.3**: System shall provide confidence score for each eligibility determination
- **FR-2.4**: System shall cite official document sources (page number and section) for eligibility criteria
- **FR-2.5**: System shall provide reasoning for eligibility decisions

### 3. Results & Documentation
- **FR-3.1**: System shall display list of eligible schemes with detailed information
- **FR-3.2**: System shall provide required documents list for each eligible scheme
- **FR-3.3**: System shall show proof text from official government documents
- **FR-3.4**: System shall present results in an easy-to-understand dashboard format

### 4. Interactive Features
- **FR-4.1**: System shall provide an AI chatbot for answering farmer queries
- **FR-4.2**: System shall support follow-up questions about schemes and eligibility
- **FR-4.3**: System shall provide FAQ section for common questions
- **FR-4.4**: System shall allow users to check eligibility for multiple profiles

### 5. User Interface
- **FR-5.1**: System shall provide responsive design for mobile and desktop devices
- **FR-5.2**: System shall display metrics cards showing eligibility summary
- **FR-5.3**: System shall use clear visual indicators for eligible/not eligible status
- **FR-5.4**: System shall support dark mode interface

## Non-Functional Requirements

### 1. Performance
- **NFR-1.1**: Voice input processing shall complete within 3 seconds
- **NFR-1.2**: Eligibility assessment shall complete within 10 seconds
- **NFR-1.3**: System shall handle concurrent requests from multiple users

### 2. Usability
- **NFR-2.1**: Interface shall be accessible to users with basic digital literacy
- **NFR-2.2**: Voice commands shall be intuitive and natural
- **NFR-2.3**: Error messages shall be clear and actionable
- **NFR-2.4**: System shall support bilingual content (Hindi/English)

### 3. Reliability
- **NFR-3.1**: System shall have 99% uptime availability
- **NFR-3.2**: System shall gracefully handle API failures
- **NFR-3.3**: System shall provide fallback mechanisms for voice input failures

### 4. Security
- **NFR-4.1**: System shall require API key authentication for Gemini AI services
- **NFR-4.2**: System shall not store sensitive farmer data without consent
- **NFR-4.3**: System shall use HTTPS for all communications

### 5. Compatibility
- **NFR-5.1**: System shall support modern web browsers (Chrome, Firefox, Safari, Edge)
- **NFR-5.2**: System shall work on mobile devices (iOS and Android)
- **NFR-5.3**: System shall require microphone permissions for voice input

## Technical Requirements

### 1. Technology Stack
- **TR-1.1**: Frontend framework: React 19.2.4
- **TR-1.2**: Build tool: Vite 6.2.0
- **TR-1.3**: Language: TypeScript 5.8.2
- **TR-1.4**: AI Service: Google Gemini AI (@google/genai 1.43.0)
- **TR-1.5**: Runtime: Node.js

### 2. API Integration
- **TR-2.1**: System shall integrate with Google Gemini API for AI processing
- **TR-2.2**: System shall handle API rate limiting gracefully
- **TR-2.3**: System shall implement proper error handling for API failures

### 3. Data Management
- **TR-3.1**: System shall use TypeScript interfaces for type safety
- **TR-3.2**: System shall maintain state management using React hooks
- **TR-3.3**: System shall structure data according to defined types (FarmerProfile, EligibilityResult)

## User Stories

### Farmer User
1. As a farmer, I want to speak my details in Hindi so that I can easily provide my information
2. As a farmer, I want to see which schemes I'm eligible for so that I can apply for benefits
3. As a farmer, I want to know what documents I need so that I can prepare my application
4. As a farmer, I want to ask questions about schemes so that I can understand them better
5. As a farmer, I want to see proof from official documents so that I can trust the results

### Administrator User
1. As an admin, I want the system to cite official sources so that results are verifiable
2. As an admin, I want to track eligibility assessments so that I can improve the system
3. As an admin, I want the system to handle multiple languages so that it reaches more farmers

## Constraints
- System requires active internet connection
- System requires valid Gemini API key
- Voice input requires microphone access
- System depends on availability of official government scheme documents

## Assumptions
- Farmers have access to smartphones or computers with internet
- Government scheme criteria are available in structured format
- Gemini AI can accurately process Hindi and English voice input
- Official scheme documents are up-to-date and accessible

## Success Criteria
- 90% accuracy in eligibility determination
- Support for at least 10 major agricultural schemes
- Voice recognition accuracy of 85% or higher
- User satisfaction rating of 4/5 or higher
- Response time under 10 seconds for eligibility checks
