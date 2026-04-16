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
    <div className="mt-4 bg-[#1e293b] p-4 rounded border border-[#334155]">

  <button
    onClick={handleAnalyze}
    className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-4 py-2 rounded mb-4 text-sm"
  >
    {loading ? "Analyzing..." : "Analyze with AI"}
  </button>

  {aiData && (
    <div className="grid grid-cols-2 gap-4">

      <div className="p-4 rounded bg-[#020617] border border-[#334155]">
        <h2 className="text-sm font-semibold text-[#6366f1] mb-1">
          Explanation
        </h2>
        <p className="text-sm text-gray-300">
          {aiData?.explanation || "No data"}
        </p>
      </div>

      <div className="p-4 rounded bg-[#020617] border border-[#334155]">
        <h2 className="text-sm font-semibold text-red-400 mb-1">
          Error
        </h2>
        <p className="text-sm text-gray-300">
          {aiData?.error || "No error"}
        </p>
      </div>

      <div className="p-4 rounded bg-[#020617] border border-[#334155]">
        <h2 className="text-sm font-semibold text-green-400 mb-1">
          Fix
        </h2>
        <p className="text-sm text-gray-300">
          {aiData?.fix || "No fix"}
        </p>
      </div>

      <div className="p-4 rounded bg-[#020617] border border-[#334155]">
        <h2 className="text-sm font-semibold text-blue-400 mb-1">
          Suggestions
        </h2>
        <p className="text-sm text-gray-300">
          {aiData?.suggestions || "No suggestions"}
        </p>
      </div>

    </div>
  )}
</div>
  );
};

export default AiPanel;