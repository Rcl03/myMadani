<div align="center">
  
  <img src="public/applogo.png" alt="MyMadani Logo" width="200" />
  
  
  **Your Gateway to Malaysian Government Services**
  
  [![React](https://img.shields.io/badge/React-19.2.1-61DAFB?logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite)](https://vitejs.dev/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
  
  [Live Demo](#) • [Documentation](#documentation) • [Report Bug](#reporting-issues) • [Request Feature](#reporting-issues)
  
</div>

---

## 📖 About

**MyMadani** is a comprehensive digital platform prototype for the Malaysian Government, designed to streamline citizen access to government subsidies, digital identity services, and AI-powered assistance. The application provides a unified interface for managing multiple subsidy programs, digital ID documents, and accessing government services through an intuitive, multilingual interface.

### Key Highlights

- 🏛️ **Government Services Integration** - Seamless access to Malaysian government subsidy programs
- 🆔 **Digital ID Management** - Secure digital identity wallet with document storage
- 🤖 **AI-Powered Assistant** - Intelligent chatbot powered by Google Gemini for citizen support
- 💳 **Subsidy Wallet Management** - Track and manage multiple government subsidy programs
- 🔐 **Biometric Authentication** - Secure face verification using device camera
- 🌐 **Multilingual Support** - Available in Bahasa Malaysia, English, Chinese, and Tamil

---

## ✨ Features

### 🔐 Authentication & Security
- **MyDigital ID Integration** - Secure login with government digital identity
- **Biometric Verification** - Real-time face recognition using device camera
- **Multi-step Authentication Flow** - Comprehensive consent and verification process
- **Secure Document Storage** - Encrypted digital wallet for personal documents

### 💰 Subsidy Management
- **Multiple Program Support** - Manage various government subsidy programs:
  - **SARA** (Subsidi Asas Rahmah) - Essential groceries subsidy
  - **STR** (Sumbangan Tunai Rahmah) - Cash assistance program
  - **BUDI** - Fuel subsidy programs
  - **Medical Subsidies** - Healthcare and clinic visit programs
  - **Elderly & Children Programs** - Specialized support programs
  - **Selangor State Programs** - Regional subsidy initiatives
- **Real-time Balance Tracking** - Monitor subsidy balances and usage
- **Transaction History** - Complete transaction logs with merchant details
- **Eligibility Status** - Real-time eligibility checking and application tracking
- **QR Code Payments** - Quick payment processing at participating merchants

### 🤖 AI Assistant
- **Natural Language Processing** - Conversational AI powered by Google Gemini
- **Voice Input Support** - Speech-to-text capabilities
- **Multilingual Conversations** - AI responds in user's preferred language
- **Program Information** - Get instant answers about subsidy programs
- **3D Avatar Interface** - Interactive 3D character for enhanced user experience

### 📱 User Experience
- **Responsive Design** - Optimized for mobile and desktop devices
- **Dark/Light Theme Support** - Comfortable viewing in any environment
- **Accessibility Features** - VoiceOver support and ARIA labels
- **Offline Capability** - Core features available without internet connection
- **Push Notifications** - Stay updated on subsidy updates and deadlines

### 📄 Digital Wallet
- **Document Management** - Store and organize personal documents
- **PDF & Image Support** - View documents directly in-app
- **Secure Storage** - Encrypted document storage
- **Quick Access** - Fast document retrieval when needed

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2.1** - Modern UI library
- **TypeScript 5.8.2** - Type-safe development
- **Vite 6.2.0** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

### AI & Services
- **Google Gemini API** - Advanced AI chatbot capabilities
- **Speech Recognition API** - Voice input processing
- **Web Audio API** - Audio playback and processing

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **GitHub Actions** - CI/CD automation

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Google Gemini API Key** - Required for AI chatbot features

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rcl03/myMadani.git
   cd myMadani
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

---

## 📁 Project Structure

```
myMadani/
├── components/
│   ├── Accessibility/      # Accessibility features
│   ├── Auth/                # Authentication components
│   ├── Layout/              # Layout components
│   └── Tabs/                # Main tab components
│       ├── Chat/            # AI Chatbot
│       ├── Home/            # Home dashboard
│       ├── Notifications/    # Notification center
│       └── Personal/        # Personal profile & wallet
├── services/                # API services
│   └── geminiService.ts     # Gemini AI integration
├── utils/                   # Utility functions
│   └── imagePath.ts        # Image path helpers
├── public/                  # Static assets
├── App.tsx                  # Main application component
├── constants.ts             # Application constants
├── types.ts                 # TypeScript type definitions
└── vite.config.ts           # Vite configuration
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI features | Yes |

### Build Configuration

The application automatically detects the deployment environment:
- **Local Development**: Base path `/`
- **GitHub Pages**: Base path `/myMadani/` (auto-detected)

---

## 📱 Usage

### Authentication Flow

1. Click "Login with MyDigital ID"
2. Review and accept consent terms
3. Complete biometric verification
4. Access your dashboard

### Managing Subsidies

1. Navigate to **Home** tab
2. Browse available subsidy programs
3. Tap on a program to view details
4. Check balance, transactions, and eligibility
5. Use QR code for payments at merchants

### AI Assistant

1. Go to **Chat** tab
2. Type or speak your question
3. Get instant answers about programs
4. Ask for help with applications

### Digital Wallet

1. Open **Personal** tab
2. Access your digital wallet
3. Upload and manage documents
4. View stored documents securely

---

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages (manual)
npm run deploy
```

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent naming conventions
- Add comments for complex logic

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Reporting Issues

If you encounter any issues or have suggestions:
- Open an issue on GitHub
- Provide detailed description and steps to reproduce
- Include screenshots if applicable

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔮 Roadmap

- [ ] Real-time subsidy balance updates
- [ ] Integration with actual government APIs
- [ ] Mobile app versions (iOS & Android)
- [ ] Enhanced biometric security features
- [ ] Offline mode improvements
- [ ] Additional language support
- [ ] Advanced analytics dashboard

---

<div align="center">
  Made with ❤️ for Malaysia
  
  [⬆ Back to Top](#mymadani)
</div>

