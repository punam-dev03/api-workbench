import { useEffect, useState } from "react";
import api from "../../api/axios";

const Collections = ({ setSelectedRequest }) => {
  const [collections, setCollections] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/collections");

        const backendData = res.data || [];
        const localData =
          JSON.parse(localStorage.getItem("collections")) || [];

        // 🔥 MERGE backend + local
        const merged = [...backendData, ...localData];

        setCollections(merged);
      } catch (err) {
        console.error(err);

        // fallback → local only
        const localData =
          JSON.parse(localStorage.getItem("collections")) || [];
        setCollections(localData);
      }
    };

    fetchData();
  }, []);

  // 🔥 EXPORT
  const handleExport = () => {
    const data = localStorage.getItem("collections") || "[]";

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "collections.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  // 🔥 IMPORT (MERGE SAFE)
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);

        const existing =
          JSON.parse(localStorage.getItem("collections")) || [];

        const merged = [...existing, ...importedData];

        localStorage.setItem("collections", JSON.stringify(merged));

        alert("Import successful ✅");

        // 🔥 update UI without reload
        setCollections((prev) => [...prev, ...importedData]);
      } catch {
        alert("Invalid JSON ❌");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="bg-[#1e293b] p-4 rounded border border-[#334155]">
      <h2 className="text-sm font-semibold mb-4">Collections</h2>

      {/* 🔥 Actions */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handleExport}
          className="bg-blue-600 px-3 py-1 rounded text-white text-sm"
        >
          Export Collections
        </button>

        <input
          type="file"
          accept="application/json"
          onChange={handleImport}
          className="text-sm"
        />
      </div>

      {/* 🔥 Empty State */}
      {collections.length === 0 && (
        <div className="text-gray-400 text-sm">No collections</div>
      )}

      {/* 🔥 COLLECTION LIST */}
      {collections.map((col, idx) => (
        <div
          key={col._id || idx}
          className="mb-4 border border-[#334155] rounded p-3 bg-[#020617]"
        >
          {/* Collection Name */}
          <div
  onClick={() =>
    setOpenIndex(openIndex === idx ? null : idx)
  }
  className="text-blue-400 text-sm font-semibold mb-2 cursor-pointer flex justify-between"
>
  <span>{col.name}</span>
  <span>{openIndex === idx ? "▼" : "▶"}</span>
</div>

          {/* Requests */}
         {openIndex === idx &&
  col.requests?.map((req, i) => (
    <div
      key={i}
      onClick={() => setSelectedRequest(req)}
      className="ml-2 cursor-pointer hover:bg-gray-700 p-2 rounded text-sm border-b border-gray-800 last:border-none"
    >
      {req.method} - {req.url}
    </div>
  ))}
        </div>
      ))}
    </div>
  );
};

export default Collections;