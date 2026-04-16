import { useState } from "react";
import api from "../../api/axios";

const AiPanel = ({ request, response }) => {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
  try {
    setLoading(true);

    const res = await api.post("/ai/analyze", {
      request,
      response,
    });

    console.log("AI RESPONSE:", res.data); // 🔥 DEBUG

    setAiData(res.data.data || res.data.analysis);// important

  } catch (error) {
    console.log("AI ERROR:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="mt-4 bg-white p-4 rounded shadow-md">
      <button
        onClick={handleAnalyze}
        className="bg-purple-600 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? "Analyzing..." : "Analyze with AI"}
      </button>

      {aiData && (
  <div className="grid grid-cols-2 gap-4">
    <div className="p-3 bg-gray-100 rounded">
      <h2 className="font-bold">Explanation</h2>
      <p>{aiData?.explanation || "No data"}</p>
    </div>

    <div className="p-3 bg-red-100 rounded">
      <h2 className="font-bold">Error</h2>
      <p>{aiData?.error || "No error"}</p>
    </div>

    <div className="p-3 bg-green-100 rounded">
      <h2 className="font-bold">Fix</h2>
      <p>{aiData?.fix || "No fix"}</p>
    </div>

    <div className="p-3 bg-blue-100 rounded">
      <h2 className="font-bold">Suggestions</h2>
      <p>{aiData?.suggestions || "No suggestions"}</p>
    </div>
  </div>
)}
    </div>
  );
};

export default AiPanel;