import { useState, useEffect } from "react";
import api from "../../api/axios";
import AiPanel from "../aiPanel/AiPanel";
import Editor from "@monaco-editor/react";
import AuthPanel from "../auth/AuthPanel";
import ParamsPanel from "../params/ParamsPanel";
import ResponseViewer from "../../components/ui/ResponseViewer";
import Loader from "../../components/ui/Loader";
import EnvPanel from "../env/EnvPanel";

const ApiTester = ({ selectedRequest }) => {
  const [method, setMethod] = useState("GET");
  const isBodyAllowed = method === "POST" || method === "PUT";
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("{}");
  const [headers, setHeaders] = useState("{}");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastRequest, setLastRequest] = useState(null);
  const [activeTab, setActiveTab] = useState("body");
  const [meta, setMeta] = useState(null);
  const [authHeader, setAuthHeader] = useState({});
  const [params, setParams] = useState({});
  const [tab, setTab] = useState("params");
  const [env, setEnv] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [collectionName, setCollectionName] = useState("");

  const replaceEnv = (url, env) => {
    return url.replace(/{{(.*?)}}/g, (_, key) => env[key] || "");
  };

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

      const finalHeaders = {
        ...parsedHeaders,
        ...authHeader,
      };

      const query = new URLSearchParams(params).toString();
      const replacedUrl = replaceEnv(url, env);
      const finalUrl = query ? `${replacedUrl}?${query}` : replacedUrl;

      const start = Date.now();

      const res = await api.post("/request/send", {
        method,
        url: finalUrl,
        headers: finalHeaders,
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
        url: finalUrl,
        headers: finalHeaders,
        body: parsedBody,
      });

      // 🔥 SAVE TO HISTORY
      const prev = JSON.parse(localStorage.getItem("history")) || [];

      localStorage.setItem(
        "history",
        JSON.stringify([
          {
            method,
            url: finalUrl,
            body: parsedBody,
            headers: finalHeaders,
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
          className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-4 rounded text-sm flex items-center justify-center"
        >
          {loading ? <Loader /> : "Send"}
        </button>
      </div>

      <AuthPanel setAuthHeader={setAuthHeader} />
      <EnvPanel setEnv={setEnv} />
      <ParamsPanel setParams={setParams} />

      {/* Tabs */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => isBodyAllowed && setActiveTab("body")}
          className={`px-3 py-1 rounded ${
            activeTab === "body"
              ? "bg-[#6366f1]"
              : "bg-[#0f172a] hover:bg-[#1e293b]"
          } ${!isBodyAllowed ? "opacity-50 cursor-not-allowed" : ""}`}
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

      {/* Editors */}
      {activeTab === "body" && isBodyAllowed && (
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

      {/* Meta */}
      {meta && (
        <div className="flex gap-4 mt-2 text-sm">
          <span className="text-green-400">Status: {meta.status}</span>
          <span className="text-blue-400">Time: {meta.time} ms</span>
        </div>
      )}

      <ResponseViewer data={response} />

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

      {/* 🔥 SAVE COLLECTION FIXED */}
      <button
  onClick={() => setShowModal(true)}
  className="mt-2 ml-2 text-sm bg-[#22c55e] text-black px-3 py-1 rounded"
>
  Save
</button>
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-[#1e293b] p-4 rounded w-80 border border-[#334155]">

      <h2 className="text-sm mb-3">Create Collection</h2>

      <input
        type="text"
        placeholder="Enter collection name"
        value={collectionName}
        onChange={(e) => setCollectionName(e.target.value)}
        className="w-full p-2 mb-3 bg-[#020617] border border-[#334155] rounded text-sm"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowModal(false)}
          className="px-3 py-1 text-sm bg-gray-600 rounded"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
  try {
    const parsedBody = JSON.parse(body || "{}");
    const parsedHeaders = JSON.parse(headers || "{}");

    const name = collectionName || "My Collection";

    // 🔥 1. SAVE IN LOCALSTORAGE (existing)
    const collections =
      JSON.parse(localStorage.getItem("collections")) || [];

    let existing = collections.find((c) => c.name === name);

    if (existing) {
      existing.requests.push({
        method,
        url,
        headers: parsedHeaders,
        body: parsedBody,
      });
    } else {
      collections.push({
        name,
        requests: [
          {
            method,
            url,
            headers: parsedHeaders,
            body: parsedBody,
          },
        ],
      });
    }

    localStorage.setItem("collections", JSON.stringify(collections));

    // 🔥 2. SAVE IN MONGODB (NEW FIX)
    await api.post("/collections", {
      name,
      requests: [
        {
          method,
          url,
          headers: parsedHeaders,
          body: parsedBody,
        },
      ],
    });

    alert("Saved to DB + Local ✅");

    setShowModal(false);
    setCollectionName("");

  } catch (err) {
    console.error(err);
    alert("Error ❌");
  }
}}
          className="px-3 py-1 text-sm bg-green-500 rounded"
        >
          Save
        </button>
      </div>

    </div>
  </div>
)}

      {lastRequest && response && (
        <AiPanel request={lastRequest} response={response} />
      )}
    </div>
  );
};

export default ApiTester;