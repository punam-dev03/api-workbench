import { useEffect, useState } from "react";
import api from "../../api/axios";

const Collections = ({ onSelect }) => {

  const [collectionsByWorkspace, setCollectionsByWorkspace] = useState(() => {
    return JSON.parse(localStorage.getItem("collectionsByWorkspace")) || {
      Default: [],
    };
  });

  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");

  const activeWorkspace =
    localStorage.getItem("activeWorkspace") || "Default";

  const collections = collectionsByWorkspace[activeWorkspace] || [];

  // 🔥 FETCH + MERGE
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/collections");
        const backendData = res.data || [];

        const localData =
          JSON.parse(localStorage.getItem("collectionsByWorkspace")) || {};

        const workspaceData = localData[activeWorkspace] || [];

        // 🔥 normalize old data → folders
        const normalize = (col) => {
          if (col.folders) return col;

          return {
            ...col,
            folders: [
              {
                name: "General",
                requests: col.requests || [],
              },
            ],
          };
        };

        const merged = [...backendData, ...workspaceData].map(normalize);

        const updated = {
          ...collectionsByWorkspace,
          [activeWorkspace]: merged,
        };

        setCollectionsByWorkspace(updated);
        localStorage.setItem(
          "collectionsByWorkspace",
          JSON.stringify(updated)
        );

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [activeWorkspace]);

  // 🔥 EXPORT
  const handleExport = () => {
    const data = JSON.stringify(collections, null, 2);

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeWorkspace}-collections.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  // 🔥 IMPORT
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);

        const updated = {
          ...collectionsByWorkspace,
          [activeWorkspace]: [...collections, ...importedData],
        };

        setCollectionsByWorkspace(updated);
        localStorage.setItem(
          "collectionsByWorkspace",
          JSON.stringify(updated)
        );

        alert("Import successful ✅");

      } catch {
        alert("Invalid JSON ❌");
      }
    };

    reader.readAsText(file);
  };

  // 🔥 ADD FOLDER
  const addFolder = (colIndex) => {
    const name = prompt("Folder name");
    if (!name) return;

    const updatedCollections = collections.map((col, idx) => {
      if (idx !== colIndex) return col;

      return {
        ...col,
        folders: [...(col.folders || []), { name, requests: [] }],
      };
    });

    const updated = {
      ...collectionsByWorkspace,
      [activeWorkspace]: updatedCollections,
    };

    setCollectionsByWorkspace(updated);
    localStorage.setItem(
      "collectionsByWorkspace",
      JSON.stringify(updated)
    );
  };

  return (
    <div className="bg-[#1e293b] p-4 rounded border border-[#334155]">

      <h2 className="text-sm font-semibold mb-4">
        Collections ({activeWorkspace})
      </h2>

      {/* ACTIONS */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handleExport}
          className="bg-blue-600 px-3 py-1 rounded text-white text-sm"
        >
          Export
        </button>

        <input
          type="file"
          accept="application/json"
          onChange={handleImport}
          className="text-sm"
        />
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search APIs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-3 p-2 bg-[#020617] border border-[#334155] rounded text-sm"
      />

      {/* EMPTY */}
      {collections.length === 0 && (
        <div className="text-gray-400 text-sm">No collections</div>
      )}

      {/* COLLECTION LIST */}
      {collections.map((col, idx) => (
        <div
          key={col._id || idx}
          className="mb-4 border border-[#334155] rounded p-3 bg-[#020617]"
        >

          {/* HEADER */}
          <div
            onClick={() =>
              setOpenIndex(openIndex === idx ? null : idx)
            }
            className="text-blue-400 text-sm font-semibold mb-2 cursor-pointer flex justify-between"
          >
            <span>{col.name}</span>
            <span>{openIndex === idx ? "▼" : "▶"}</span>
          </div>

          {/* ADD FOLDER */}
          <button
            onClick={() => addFolder(idx)}
            className="text-xs bg-green-600 px-2 py-1 rounded mb-2"
          >
            + Folder
          </button>

          {/* FOLDERS */}
          {openIndex === idx &&
            col.folders?.map((folder, fIdx) => (
              <div key={fIdx} className="ml-2 mb-2">

                {/* Folder Name */}
                <div className="text-purple-400 text-sm mb-1">
                  📁 {folder.name}
                </div>

                {/* Requests */}
                {folder.requests
                  ?.filter((req) => {
                    if (!search) return true;

                    return (
                      req.url.toLowerCase().includes(search.toLowerCase()) ||
                      req.method.toLowerCase().includes(search.toLowerCase())
                    );
                  })
                  .map((req, i) => (
                    <div
                      key={i}
                      className="ml-4 flex justify-between items-center hover:bg-gray-700 p-2 rounded text-sm border-b border-gray-800"
                    >
                      <div
                        onClick={() => onSelect(req)}
                        className="cursor-pointer flex-1"
                      >
                        {req.method} - {req.url}
                      </div>

                      <button
                        onClick={() =>
                          onSelect({
                            ...req,
                            headers: req.headers || {},
                            body: req.body || {},
                          })
                        }
                        className="text-xs bg-yellow-500 text-black px-2 py-1 rounded ml-2"
                      >
                        Clone
                      </button>
                    </div>
                  ))}

              </div>
            ))}

        </div>
      ))}

    </div>
  );
};

export default Collections;