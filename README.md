# P/S Tet Reunion Video Maker

This web application was created for the P/S Tet marketing campaign. It allows users to upload individual photos of family members, which are then combined by AI into a single, festive family portrait. The generated portrait can then be animated into a short video, complete with subtle movements and celebratory sounds, perfect for sharing during the Tet holiday.

## ✨ Features

*   **AI Family Portrait:** Upload up to 5 individual photos and have the Gemini AI model merge them into a cohesive family picture set in a traditional Tet meal scene.
*   **AI Video Animation:** Bring the generated photo to life with a high-definition 8-second video created by the Veo AI model.
*   **Festive Atmosphere:** The generated video includes subtle animations, happy background laughter, and gentle Tet-themed music.
*   **Automatic Watermarking:** Every generated photo is automatically watermarked with the P/S logo.
*   **Responsive Design:** A clean, user-friendly interface that works on both desktop and mobile devices.

## 🛠️ Technology Stack

*   **Frontend:** React, TypeScript, Tailwind CSS
*   **AI / Machine Learning:** Google Gemini API
    *   **Image Generation:** `gemini-2.5-flash-image`
    *   **Video Generation:** `veo-3.1-fast-generate-preview`
*   **Environment:** The app is built as a static site and uses Babel Standalone for in-browser JSX/TSX transpilation, requiring no build step.

## 🚀 Getting Started

This project is a static web application and can be run by serving the files with any simple web server.

### Prerequisites

*   A modern web browser.
*   A Google AI API Key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey). Please note that using the Video Generation (Veo) model is a paid feature. Refer to the [billing documentation](https://ai.google.dev/gemini-api/docs/billing) for more details.

### Local Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ps-tet-video-maker.git
    cd ps-tet-video-maker
    ```

2.  **Configure API Key:**
    The application code requires a Google AI API Key to function. You must manually add it to the project.

    1.  Open the `constants.ts` file.
    2.  Find the line: `export const API_KEY = 'YOUR_API_KEY_HERE';`
    3.  Replace `'YOUR_API_KEY_HERE'` with your actual API key string.

    **⚠️ IMPORTANT: Do not commit your API key to a public repository.**

3.  **Run a Local Server:**
    You can use any static file server. A simple one comes with Python:
    ```bash
    # If you have Python 3
    python -m http.server
    ```
    Alternatively, you can use a tool like the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for Visual Studio Code.

4.  **Open the App:**
    Navigate to `http://localhost:8000` (or the port your server is running on) in your web browser.

## 📁 Project Structure

```
.
├── components/         # React components for different parts of the UI
│   ├── Header.tsx
│   ├── ImageUploader.tsx
│   ├── Loader.tsx
│   ├── Step1.tsx
│   └── Step2.tsx
├── services/           # Services for interacting with external APIs (Gemini)
│   └── geminiService.ts
├── utils/              # Utility functions
│   └── fileUtils.ts
├── App.tsx             # Main application component, manages state and steps
├── constants.ts        # Project constants (prompts, messages, API_KEY etc.)
├── index.html          # The main HTML entry point
├── index.tsx           # The root of the React application
├── metadata.json       # Application metadata
└── types.ts            # TypeScript type definitions
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.