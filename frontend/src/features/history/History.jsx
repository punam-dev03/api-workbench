import { useEffect, useState } from "react";

const History = ({ setSelectedRequest }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("history")) || [];
    setHistory(data);
  }, []);

  return (
    <div className="bg-[#1e293b] p-4 rounded border border-[#334155]">
      <h2 className="text-sm font-semibold mb-4">History</h2>

      {/* 🔥 CLEAR BUTTON */}
      <button
        onClick={() => {
          localStorage.removeItem("history");
          setHistory([]);
        }}
        className="text-xs mb-3 bg-red-500 px-2 py-1 rounded"
      >
        Clear History
      </button>

      {history.length === 0 && (
        <div className="text-gray-400 text-sm">No history yet</div>
      )}

      {/* 🔥 HISTORY LIST */}
      {history.map((item, i) => (
        <div
          key={i}
          className="mb-2 p-2 rounded bg-[#020617] border border-[#334155]"
        >
          {/* TOP ROW */}
          <div className="flex justify-between items-center">

            {/* CLICK TO LOAD */}
            <div
              onClick={() => setSelectedRequest(item)}
              className="cursor-pointer text-sm"
            >
              {item.method} - {item.url}
            </div>

            {/* 🔥 RETRY BUTTON */}
            <button
              onClick={() => setSelectedRequest(item)}
              className="text-xs bg-blue-600 px-2 py-1 rounded"
            >
              Retry
            </button>

          </div>

          {/* 🔥 TIME */}
          <div className="text-xs text-gray-400 mt-1">
            {item.time || ""}
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;