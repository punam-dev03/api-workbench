import { useEffect, useState } from "react";

const History = ({ onSelect }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("history")) || [];
    setHistory(data);
  }, []);

  return (
    <div className="bg-[#1e293b] p-4 rounded border border-[#334155]">
      <h2 className="text-sm font-semibold mb-4">History</h2>

      {history.length === 0 && (
        <div className="text-gray-400 text-sm">No history yet</div>
      )}

      {history.map((item, i) => (
        <div
          key={i}
          onClick={() => onSelect(item)}
          className="p-2 text-xs bg-[#020617] rounded mb-2 cursor-pointer hover:bg-[#1e293b]"
        >
          {item.method} - {item.url}
        </div>
      ))}
      <button
  onClick={() => {
    localStorage.removeItem("history");
    setHistory([]);
  }}
  className="text-xs mb-3 bg-red-500 px-2 py-1 rounded"
>
  Clear History
</button>
    </div>
  );
};

export default History;