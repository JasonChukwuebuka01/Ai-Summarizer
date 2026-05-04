const GEMINI_API_KEY = import.meta.env.VITE_.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === 'CALL_AI') {
        const { url, content } = request;

        // We use an immediate invoked async function to handle the async logic
        (async () => {
            try {
                //  Check Cache first
                const cache = await chrome.storage.local.get([url]);
                if (cache[url]) {
                    sendResponse({ summary: cache[url] });
                    return;
                }

                // If not cached, call AI
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `Summarize the following text in 3 bullet points with key insights and estimate the reading time: ${content}`
                            }]
                        }]
                    })
                });

                const data = await response.json();

                // Error handling for API-specific errors (like invalid keys or rate limits)
                if (data.error) {
                    sendResponse({ error: data.error.message });
                    return;
                }

                const summaryText = data.candidates[0].content.parts[0].text;

                //  Save to Cache
                await chrome.storage.local.set({ [url]: summaryText });

                sendResponse({ summary: summaryText });
            } catch (error: any) {
                sendResponse({ error: error.message || "Failed to reach AI provider." });
            }
        })();

        return true; // Keep the message channel open
    }
});