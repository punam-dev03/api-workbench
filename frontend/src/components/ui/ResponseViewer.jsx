import { useState } from "react";
const ResponseViewer = ({ data }) => {
  const [mode, setMode] = useState("json");

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button onClick={() => setMode("json")}>JSON</button>
        <button onClick={() => setMode("raw")}>RAW</button>
      </div>

      <pre className="text-sm">
        {mode === "json"
          ? JSON.stringify(data, null, 2)
          : String(data)}
      </pre>
    </div>
  );
};

export default ResponseViewer;