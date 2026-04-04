<div align="center"> # Clínica


</div>
<div align="center">
  <p><strong>Your health navigator. In your language.</strong></p>
  <p>Clínica is a culturally competent, AI-powered health navigation platform designed to guide members of the Hispanic/Latino community in the United States toward safe, affordable, and accessible healthcare.</p>
</div>

---

## 🌟 Overview

Navigating the US healthcare system is complex, especially for vulnerable populations who face language barriers, lack of insurance, or immigration concerns. Clínica bridges this gap by providing an intuitive, fully bilingual (English/Spanish) application that prioritizes privacy, safety, and culturally aware guidance.

Unlike traditional health symptom checkers, Clínica leverages AI to act as a compassionate community health navigator—helping users understand their rights, explore Federally Qualified Health Centers (FQHCs), and find the care they need without fear.

## ✨ Key Features

- **Context-Aware Onboarding & Seamless Chat Integration**: Users select their primary concern (e.g., lack of insurance, immigration fears, mental health needs) the moment they enter the app. This context is carried directly into the chat, where the AI's core instructions, tone, and privacy assurances are dynamically reprogrammed. The system immediately "knows" their situation and adapts its resources without the user needing to re-explain themselves.
- **Culturally Competent AI Triage**: An empathetic, LLM-powered chatbot (powered by Google Gemini) that provides actionable health guidance, crisis support, and clinic referrals tailored precisely to the user's selected onboarding situation.
- **Intelligent Clinic Finder**: Interactive Google Maps integration that discovers nearby hospitals and clinics, filtering for safety-net providers, FQHCs, and sliding-scale fee options.
- **Insurance-Based Hospital Scoring**: A dynamic AI-driven scoring system that evaluates and matches users to ideal hospitals based on their specific insurance provider and plan. Distinctive map markers visually indicate the most suitable facilities to guide users toward affordable, in-network care.
- **Bilingual Experience**: Seamless, on-the-fly toggling between English and Spanish across the entire platform.
- **Privacy-First Design**: A secure, offline-first architecture utilizing Local Storage to save triage sessions and bookmarked clinics without requiring a formal login or collecting identifiable information.
- **Resource Hub**: A dedicated library of educational PDFs and toolkits detailing patient rights, HIPAA laws, and how to navigate care safely.

## 🛠 Tech Stack

**Frontend:**
- React 18 (Vite)
- TypeScript
- Tailwind CSS (Material Design 3 Aesthetics)
- React Router DOM
- i18next (Internationalization)
- Google Maps JavaScript API

**Backend:**
- Java 21+
- Spring Boot
- Google Gemini API (for chat and session summarization)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Java JDK 21+
- Google Maps API Key
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/clinica.git
   cd clinica
   ```

2. **Setup the Backend**
   Navigate to the `backend` directory, configure your environment variables, and start the Spring Boot application:
   ```bash
   cd backend
   # Set your Gemini API key in the application.properties or as an environment variable
   ./mvnw spring-boot:run
   ```

3. **Setup the Frontend**
   Navigate to the `frontend` directory, install dependencies, and start the development server:
   ```bash
   cd frontend
   npm install

   # Create a .env file and add your Google Maps / Backend URLs
   # VITE_API_BASE_URL=http://localhost:8080
   # VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key

   npm run dev
   ```

4. **Navigate to the Application**
   Open your browser and visit `http://localhost:5173`.

## 🔒 Privacy & Safety

Clínica is designed from the ground up to protect user privacy. Triage sessions and saved hospitals are strictly stored locally on the user's device. The application deliberately avoids collecting names, addresses, or immigration status to ensure it remains a safe haven for health navigation.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
