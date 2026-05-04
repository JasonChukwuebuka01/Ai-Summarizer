
export const renderFormattedSummary = (text: string) => {
    return text.split('\n').map((line, index) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return null;

        
        const cleanText = trimmedLine
            .replace(/^[*#-\d+.]+\s?/, '') // Strips leading symbols
            .replace(/\*\*|__/g, '')       // Strips bold markers (**)
            .replace(/[*_]/g, '');         // Strips single italic markers (*)

        return (
            <div key={index} className="flex items-start mb-2 group">
                {/* Custom indigo bullet point */}
                <span className="mr-2 text-indigo-500 font-bold select-none">•</span>
                <p className="text-sm text-slate-700 leading-relaxed">
                    {cleanText}
                </p>
            </div>
        );
    });
};