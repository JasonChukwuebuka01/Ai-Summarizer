import { useState } from 'react'
import { renderFormattedSummary } from './utils/formatGeneratedText';

function App() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [title, setTitle] = useState("");
  const [copied, setCopied] = useState(false);

  // Helper to calculate word count
  const wordCount = summary ? summary.trim().split(/\s+/).length : 0;




  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };




  const handleSummarize = () => {
    setLoading(true);
    setSummary("");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab?.id) {
        setLoading(false);
        return;
      }

      chrome.tabs.sendMessage(activeTab.id, { action: 'GET_CONTENT' }, (response) => {
        if (response && response.content) {
          setTitle(response.title);

          chrome.runtime.sendMessage({
            action: 'CALL_AI',
            content: response.content,
            url: activeTab.url
          }, (aiResponse) => {
            if (aiResponse?.summary) {
              setSummary(aiResponse.summary);
            } else {
              setSummary("Error: " + (aiResponse?.error || "Failed to generate summary."));
            }
            setLoading(false);
          });
        } else {
          setSummary("Error: Could not extract content.");
          setLoading(false);
        }
      });
    });
  };

  return (
    <section className="p-4 bg-slate-50 w-[350px] min-h-[450px] flex flex-col font-sans">
      <header className="mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-600">AI Summarizer</h1>
          {loading && (
            <div className="animate-spin h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
          )}
        </div>
        <p className="text-xs text-slate-500">HNG Stage 4A • Chrome Extension</p>
      </header>

      <button
        onClick={handleSummarize}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-md transition-all active:scale-95 disabled:bg-slate-400"
      >
        {loading ? "Analyzing..." : "Summarize Page"}
      </button>

      {title && (
        <div className="mt-4 flex-grow flex flex-col overflow-hidden">
          <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col max-h-[320px]">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-[11px] text-slate-400 uppercase tracking-widest truncate max-w-[200px]">
                {title}
              </h2>
              {summary && (
                <span className="text-[10px] text-slate-400 font-medium">
                  {wordCount} words
                </span>
              )}
            </div>

            <div className="text-sm text-slate-700 leading-relaxed overflow-y-auto pr-1 custom-scrollbar">
              {
                summary ?
                  renderFormattedSummary(summary)
                  :
                  (
                    <div className="space-y-2 animate-pulse">
                      <div className="h-3 bg-slate-100 rounded w-full"></div>
                      <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                      <div className="h-3 bg-slate-100 rounded w-4/6"></div>
                    </div>
                  )
              }
            </div>

            {summary && !loading && (
              <button
                onClick={handleCopy}
                className={`mt-3 py-1.5 rounded text-xs font-bold transition-all ${copied
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white"
                  }`}
              >
                {copied ? "✓ Copied to Clipboard" : "Copy Summary"}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mt-auto pt-4 flex justify-between items-center border-t border-slate-200">
        <button
          onClick={() => { setSummary(""); setTitle(""); }}
          className="text-xs text-slate-400 hover:text-red-500 font-medium transition-colors"
        >
          Clear All
        </button>
        {summary && !loading && (
          <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-bold">
            Done
          </span>
        )}
      </div>
    </section>
  )
}

export default App