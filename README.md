# Gemini Clone - AI Chat Application

A modern, responsive AI chat application built with Next.js 15, Redux, and Tailwind CSS that mimics the Gemini interface. This project demonstrates advanced frontend development skills including state management, form validation, real-time interactions, and modern UI/UX patterns.

## 🚀 Live Demo

[Deploy to Netlify]  https://effulgent-peony-e7028c.netlify.app/
## ✨ Features

### 🔐 Authentication
- **OTP-based Login/Signup** with country code selection
**otp Is 123456**
- **Real-time country data** from restcountries.com API
- **Form validation** using React Hook Form + Zod
- **Simulated OTP** sending and verification with delays

### 💬 Chat Interface
- **Real-time messaging** with simulated AI responses
- **Typing indicators** with "Gemini is typing..." animation
- **Message timestamps** with smart formatting
- **Image upload support** with preview and base64 storage
- **Copy-to-clipboard** functionality for AI messages
- **Auto-scroll** to latest messages
- **Responsive design** for mobile and desktop

### 🗂️ Chatroom Management
- **Create/Delete chatrooms** with confirmation toasts
- **Search functionality** with debounced input
- **Edit chatroom titles** inline
- **Real-time updates** across the application

### 🎨 UI/UX Features
- **Dark/Light mode toggle** with system preference detection
- **Mobile responsive design** with collapsible sidebar
- **Loading skeletons** and smooth animations
- **Toast notifications** for all user actions
- **Keyboard accessibility** for main interactions
- **Gemini-like styling** with modern gradients and shadows

### 🔧 Technical Features
- **Redux state management** with TypeScript
- **Client-side pagination** for messages
- **Infinite scroll** simulation for older messages
- **Throttled AI responses** with random delays
- **Local storage persistence** for auth and chat data
- **Error handling** with user-friendly messages

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Form Validation**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Utilities**: clsx, tailwind-merge

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/199shreyasingh/Gemini_assignment.git
   cd gemini-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home/login page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   └── providers.tsx     # Redux and theme providers
└── lib/                  # Utilities and configurations
    ├── api.ts            # API functions
    ├── hooks.ts          # Redux hooks
    ├── slices/           # Redux slices
    ├── store.ts          # Redux store
    ├── utils.ts          # Utility functions
    └── validations.ts    # Zod schemas
```

## 🔄 State Management

The application uses Redux Toolkit with the following slices:

- **authSlice**: User authentication state
- **chatroomSlice**: Chatroom management
- **messageSlice**: Message handling and pagination
- **uiSlice**: UI state (dark mode, sidebar, search)

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile-first approach** using Tailwind CSS
- **Collapsible sidebar** for mobile devices
- **Touch-friendly** interface elements
- **Adaptive layouts** for different screen sizes

## 🎯 Key Implementations

### Form Validation
- **React Hook Form** with Zod schemas for type-safe validation
- **Real-time validation** with error messages
- **Custom validation rules** for phone numbers and OTP

### Throttling & Pagination
- **AI response throttling** using setTimeout with random delays
- **Client-side pagination** for messages (20 per page)
- **Infinite scroll simulation** for loading older messages

### Image Upload
- **Base64 encoding** for image storage
- **File size validation** (5MB limit)
- **Preview functionality** before sending
- **Responsive image display** in chat

### Dark Mode
- **System preference detection** on first load
- **Local storage persistence** for user preference
- **Smooth transitions** between themes
- **Consistent theming** across all components



**Built with ❤️ for Kuvaka Tech Frontend Assignment**
