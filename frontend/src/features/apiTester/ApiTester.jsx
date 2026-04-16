import { useState } from "react";
import api from "../../api/axios";
import AiPanel from "../aiPanel/AiPanel";
import Editor from "@monaco-editor/react";

const ApiTester = () => {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("{}");
  const [headers, setHeaders] = useState("{}"); // ✅ added headers state
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastRequest, setLastRequest] = useState(null);
  const [activeTab, setActiveTab] = useState("body");

  const handleSend = async () => {
    try {
      setLoading(true);

      const parsedBody = body ? JSON.parse(body) : {};
      const parsedHeaders = headers ? JSON.parse(headers) : {};

      // ✅ Save request for AI panel
      setLastRequest({
        method,
        url,
        body: parsedBody,
        headers: parsedHeaders,
      });

      const res = await api.post("/request/send", {
        method,
        url,
        body: parsedBody,
        headers: parsedHeaders,
      });

      setResponse(res.data);
    } catch (error) {
      setResponse({
        error: true,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">

      {/* Top Row */}
      <div className="flex gap-2 mb-4">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="border p-2 rounded"
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
          className="flex-1 border p-2 rounded"
        />

        {/* ✅ Updated Gradient Button */}
        <button
          onClick={handleSend}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 rounded shadow"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-2">
        <button onClick={() => setActiveTab("body")}>Body</button>
        <button onClick={() => setActiveTab("headers")}>Headers</button>
      </div>

      {/* ✅ Conditional Editors */}
      {activeTab === "body" && (
        <Editor
          height="200px"
          defaultLanguage="json"
          value={body}
          onChange={(value) => setBody(value)}
          theme="vs-dark"
        />
      )}

      {activeTab === "headers" && (
        <Editor
          height="200px"
          defaultLanguage="json"
          value={headers}
          onChange={(value) => setHeaders(value)}
          theme="vs-dark"
        />
      )}

      {/* ✅ Updated Response UI */}
      <div className="bg-black text-green-400 p-4 rounded mt-4">
        <h2 className="mb-2 font-bold">Response</h2>
        <pre className="text-sm overflow-auto">
          {response ? JSON.stringify(response, null, 2) : "No response"}
        </pre>
      </div>

      {/* 🔥 AI PANEL (unchanged) */}
      {lastRequest && response && (
        <AiPanel request={lastRequest} response={response} />
      )}
    </div>
  );
};

export default ApiTester;