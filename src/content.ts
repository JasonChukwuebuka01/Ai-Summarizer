
const extractContent = (): string => {
    // Semantic tags (Best for modern, well-structured sites)
    const article = document.querySelector('article');
    if (article) return article.innerText;

    const main = document.querySelector('main');
    if (main) return main.innerText;

    //  Heuristic: Find the div with the highest density of paragraphs.
    const allDivs = document.querySelectorAll('div');
    let bestDiv: HTMLElement | null = null;
    let maxParagraphs = 0;

    allDivs.forEach((div) => {
        // We count <p> tags inside each div
        const pCount = div.querySelectorAll('p').length;
        if (pCount > maxParagraphs) {
            maxParagraphs = pCount;
            // We cast as HTMLElement so TypeScript knows it has 'innerText'
            bestDiv = div as HTMLElement;
        }
    });

    // If we found a div with a significant number of paragraphs, return its text.
    if (bestDiv && maxParagraphs > 1) {
        return (bestDiv as HTMLElement).innerText;
    }

    // If all else fails, grab the body text and trim whitespace.
    return document.body.innerText.trim();
};





/**
 * THE COMMUNICATION BRIDGE
 * Listens for a message from the Popup UI (App.tsx)
 */
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === 'GET_CONTENT') {
        // We grab the tab title and our extracted content
        const pageTitle = document.title;
        const text = extractContent();

        // Send the data packet back to the Popup
        sendResponse({
            title: pageTitle,
            content: text
        });
    }

    // Return true to let Chrome know we'll respond asynchronously
    return true;
});