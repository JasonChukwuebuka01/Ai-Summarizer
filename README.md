 **AI Page Summarizer (Chrome Extension - Manifest V3)
A high-performance Chrome extension designed to extract, analyze, and summarize web articles using AI. Built with React, TypeScript, and Tailwind CSS.**

** Setup Instructions
This is a local extension and is not available on the Google Chrome Store. Follow these steps to install and use it:**

**Clone the Repository:**

  ```Bash
   git clone <your-repo-url>
  ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Add your API Key:**
    *   Open `src/background.ts`.
    *   Replace the `GEMINI_API_KEY` value with your actual Gemini API key.
4.  **Build the Project:**
    ```bash
    npm run build
    ```
5.  **Install in Chrome:**
    *   Open Chrome and navigate to `chrome://extensions/`.
    *   Enable **Developer mode** (toggle in the top right).
    *   Click **Load unpacked**.
    *   Select the `dist` folder in your project directory.

---

## **🏗 Architecture Explanation**
The extension follows a decoupled tri-layer architecture to comply with **Manifest V3** security standards:

*   **Popup UI (React/Vite):** Acts as the user interface. It manages state (loading, errors, summaries), handles word counts and copy-to-clipboard actions, and triggers the extraction process.
*   **Content Script (Heuristic Extraction):** Injected into the webpage. It uses a density-based heuristic to identify the main article body, effectively ignoring sidebars, ads, and navigation menus.
*   **Background Service Worker:** Acts as the secure "backend." It handles all external API communication and manages data persistence via `chrome.storage`.

---

## **🤖 AI Integration & Security**

### **Secure API Handling**
To meet the requirement of **never exposing API keys in the frontend**, all AI calls are routed through the **Background Service Worker**. 
*   **Why?** The Content Script and Popup source code can be easily inspected via the browser's DevTools. Moving the logic to the Background worker adds a layer of isolation, preventing the key from being exposed via DOM inspection.
*   **Provider:** Uses **Google Gemini 2.5 Flash** for high-speed, structured output including bullet points and key insights.

### **Data Caching (Performance)**
The extension utilizes `chrome.storage.local` to cache summaries indexed by their URL. 
*   If a user re-opens the extension on the same page, the summary is instantly loaded from storage, preventing redundant (and potentially costly) API calls and ensuring a snappy UX.

---

## **🛡 Security Decisions**
*   **Sanitization:** React's default rendering is used for the summary output, which automatically escapes HTML entities and prevents Cross-Site Scripting (XSS). Custom regex utilities are used to strip Markdown artifacts (like `**` or `*`) before rendering.
*   **Minimal Permissions:** The extension only requests `activeTab` (to read the current page), `storage` (for caching), and `scripting`. It does not track user history or access data across all sites unnecessarily.
*   **Message Validation:** Messages passed between the Popup and Background script are validated via specific action strings (e.g., `CALL_AI`) to ensure only authorized internal commands are executed.

---

## **⚖️ Trade-offs**
*   **Heuristic vs. Readability Library:** I chose a custom paragraph-density heuristic. While a library like Mozilla’s `Readability.js` is more robust, a custom heuristic keeps the extension lightweight with a smaller bundle size and zero external dependencies, improving load times for the user.
*   **Client-side Background Worker:** For this project stage, the API key is stored in the background worker. In a commercial production environment, this would be moved to a proxy server (Node.js/Express) to ensure the key is never shipped to the client at all.

---

**Note:** This project was developed as part of the **HNG Internship Stage 4A**. It demonstrates an understanding of modern extension development, secure AI integration, and user-centric design.