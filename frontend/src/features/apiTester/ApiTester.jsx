import { useState, useEffect } from "react";
import api from "../../api/axios";
import AiPanel from "../aiPanel/AiPanel";
import Editor from "@monaco-editor/react";

const ApiTester = ({ selectedRequest }) => {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("{}");
  const [headers, setHeaders] = useState("{}");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastRequest, setLastRequest] = useState(null);
  const [activeTab, setActiveTab] = useState("body");
  const [meta, setMeta] = useState(null);

  const handleSend = async () => {
    try {
      setLoading(true);

      let parsedBody = {};
      let parsedHeaders = {};

      try {
        parsedBody = JSON.parse(body || "{}");
      } catch {
        alert("Invalid Body JSON");
        setLoading(false);
        return;
      }

      try {
        parsedHeaders = JSON.parse(headers || "{}");
      } catch {
        alert("Invalid Headers JSON");
        setLoading(false);
        return;
      }

      const start = Date.now();

      const res = await api.post("/request/send", {
        method,
        url,
        headers: parsedHeaders,
        body: parsedBody,
      });

      const end = Date.now();

      setMeta({
        status: res.data?.data?.status || 200,
        time: end - start,
      });

      setResponse(res.data?.data || res.data);

      setLastRequest({
        method,
        url,
        headers: parsedHeaders,
        body: parsedBody,
      });

      // 🔥 SAVE TO HISTORY (ADDED)
      const prev = JSON.parse(localStorage.getItem("history")) || [];

      localStorage.setItem(
        "history",
        JSON.stringify([
          {
            method,
            url,
            body: parsedBody,
            headers: parsedHeaders,
          },
          ...prev,
        ])
      );

    } catch (error) {
      setResponse({
        error: true,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRequest) {
      setMethod(selectedRequest.method);
      setUrl(selectedRequest.url);
      setBody(JSON.stringify(selectedRequest.body || {}, null, 2));
      setHeaders(JSON.stringify(selectedRequest.headers || {}, null, 2));
    }
  }, [selectedRequest]);

  return (
    <div className="bg-[#1e293b] p-4 rounded border border-[#334155]">

      {/* 🔥 Top */}
      <div className="flex gap-2 mb-4">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="bg-[#0f172a] border border-[#334155] p-2 rounded text-sm"
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>

        <input
          type="text"
          placeholder="Enter API URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 bg-[#0f172a] border border-[#334155] p-2 rounded text-sm"
        />

        <button
          onClick={handleSend}
          className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-4 rounded text-sm"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      {/* 🔥 Tabs */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setActiveTab("body")}
          className={`px-3 py-1 rounded ${
            activeTab === "body"
              ? "bg-[#6366f1]"
              : "bg-[#0f172a] hover:bg-[#1e293b]"
          }`}
        >
          Body
        </button>

        <button
          onClick={() => setActiveTab("headers")}
          className={`px-3 py-1 rounded ${
            activeTab === "headers"
              ? "bg-[#6366f1]"
              : "bg-[#0f172a] hover:bg-[#1e293b]"
          }`}
        >
          Headers
        </button>
      </div>

      {/* 🔥 Editors */}
      {activeTab === "body" && (
        <Editor
          height="200px"
          defaultLanguage="json"
          value={body}
          onChange={(value) => setBody(value || "")}
          theme="vs-dark"
        />
      )}

      {activeTab === "headers" && (
        <Editor
          height="200px"
          defaultLanguage="json"
          value={headers}
          onChange={(value) => setHeaders(value || "")}
          theme="vs-dark"
        />
      )}

      {/* 🔥 Meta */}
      {meta && (
        <div className="flex gap-4 mt-2 text-sm">
          <span className="text-green-400">Status: {meta.status}</span>
          <span className="text-blue-400">Time: {meta.time} ms</span>
        </div>
      )}

      {/* 🔥 Response */}
      <div className="bg-[#020617] text-[#22c55e] p-4 rounded mt-4 border border-[#334155]">
        <h2 className="mb-2 font-semibold text-sm">Response</h2>
        <pre className="text-sm overflow-auto">
          {response ? JSON.stringify(response, null, 2) : "No response"}
        </pre>
      </div>

      {/* 🔥 Copy */}
      {response && (
        <button
          onClick={() =>
            navigator.clipboard.writeText(JSON.stringify(response, null, 2))
          }
          className="mt-2 text-sm bg-[#1e293b] border border-[#334155] px-2 py-1 rounded"
        >
          Copy Response
        </button>
      )}
      <button
  onClick={async () => {
    try {
      const parsedBody = JSON.parse(body || "{}");
      const parsedHeaders = JSON.parse(headers || "{}");

      await api.post("/collections", {
        name: "My Collection",
        requests: [
          {
            method,
            url,
            headers: parsedHeaders,
            body: parsedBody,
          },
        ],
      });

      alert("Saved ✅");

    } catch (err) {
      console.error(err);
      alert("Error ❌");
    }
  }}
  className="mt-2 ml-2 text-sm bg-[#22c55e] text-black px-3 py-1 rounded"
>
  Save
</button>

      {/* 🔥 AI Panel */}
      {lastRequest && response && (
        <AiPanel request={lastRequest} response={response} />
      )}
    </div>
  );
};

export default ApiTester;