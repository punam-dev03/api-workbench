import { useState } from "react";
import ReactJson from "@microlink/react-json-view";

const ResponseViewer = ({ data, viewMode }) => {
  const [tab, setTab] = useState("body");
  const [search, setSearch] = useState("");

  if (!data) {
    return (
      <div className="mt-4 text-gray-400 text-sm">
        No response yet...
      </div>
    );
  }

  // 🔥 SEARCH FILTER FUNCTION
  const highlightText = (text) => {
    if (!search) return text;

    const regex = new RegExp(`(${search})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={i} className="bg-yellow-500 text-black">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="bg-[#020617] p-4 rounded mt-4 border border-[#334155]">

      {/* 🔥 TABS */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setTab("body")}
          className={`px-3 py-1 rounded text-sm ${
            tab === "body" ? "bg-blue-500" : "bg-gray-800"
          }`}
        >
          Body
        </button>

        <button
          onClick={() => setTab("headers")}
          className={`px-3 py-1 rounded text-sm ${
            tab === "headers" ? "bg-blue-500" : "bg-gray-800"
          }`}
        >
          Headers
        </button>
      </div>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search in response..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-3 p-2 bg-[#020617] border border-[#334155] rounded text-sm"
      />

      {/* 🔥 BODY TAB */}
      {tab === "body" && (
        <div className="text-sm">

          {/* ✅ Pretty JSON View */}
          {viewMode === "pretty" ? (
            <ReactJson
              src={data}
              theme="monokai"
              collapsed={1}
              enableClipboard={true}
              displayDataTypes={false}
              displayObjectSize={false}
              name={false}
              style={{
                backgroundColor: "#020617",
                padding: "10px",
                borderRadius: "6px",
              }}
            />
          ) : (
            // ✅ RAW VIEW + SEARCH HIGHLIGHT
            <pre className="text-green-400 text-sm overflow-auto">
              {JSON.stringify(data, null, 2)
                .split("\n")
                .map((line, i) => (
                  <div key={i}>{highlightText(line)}</div>
                ))}
            </pre>
          )}

        </div>
      )}

      {/* 🔥 HEADERS TAB */}
      {tab === "headers" && (
        <div className="text-sm">

          {/* ✅ JSON TREE VIEW */}
          <ReactJson
            src={data?.headers || {}}
            theme="monokai"
            collapsed={1}
            displayDataTypes={false}
            name={false}
          />

          {/* ✅ RAW SEARCH VIEW */}
          <pre className="text-green-400 text-sm overflow-auto mt-2">
            {JSON.stringify(data?.headers || {}, null, 2)
              .split("\n")
              .map((line, i) => (
                <div key={i}>{highlightText(line)}</div>
              ))}
          </pre>

        </div>
      )}

    </div>
  );
};

export default ResponseViewer;