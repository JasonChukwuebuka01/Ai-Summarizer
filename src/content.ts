const extractContent = (): string => {
    // Priority: Semantic tags
    const article = document.querySelector('article');
    if (article) return article.innerText;

    const main = document.querySelector('main');
    if (main) return main.innerText;

    //  Heuristic: Find the div with the most <p> (paragraph) tags.
    // This is how we find the "meat" of the content in messy HTML.
    const allDivs = document.querySelectorAll('div');
    let bestDiv = null;
    let maxParagraphs = 0;

    allDivs.forEach((div) => {
        const pCount = div.querySelectorAll('p').length;
        if (pCount > maxParagraphs) {
            maxParagraphs = pCount;
            bestDiv = div;
        }
    });

    // If we found a div with at least 2 paragraphs, it's likely our content.
    if (bestDiv && maxParagraphs > 1) {
        return (bestDiv as HTMLElement).innerText;
    }

    // Last Resort: Just grab the body.
    return document.body.innerText.trim();
};