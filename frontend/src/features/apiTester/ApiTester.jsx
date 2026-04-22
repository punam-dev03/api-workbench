import { useState, useEffect } from "react";
import api from "../../api/axios";
import AiPanel from "../aiPanel/AiPanel";
import Editor from "@monaco-editor/react";
import AuthPanel from "../auth/AuthPanel";
import ParamsPanel from "../params/ParamsPanel";
import ResponseViewer from "../../components/ui/ResponseViewer";
import Loader from "../../components/ui/Loader";
import EnvPanel from "../env/EnvPanel";
import { generateCurl } from "../../utils/generateCurl";

const ApiTester = ({ selectedRequest, tabData, updateTabData }) => {
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
  const [viewMode, setViewMode] = useState("pretty");
  const [bodyType, setBodyType] = useState("json");
  const [formDataFields, setFormDataFields] = useState([]);
  const [envs, setEnvs] = useState({});
  const [activeEnv, setActiveEnv] = useState("default");
  const [isInitialized, setIsInitialized] = useState(false);
  const replaceEnv = (url, env) => {
    return url.replace(/{{(.*?)}}/g, (_, key) => env[key] || "");
  };

const handleSend = async () => {
  try {
    setLoading(true);

    let parsedBody = {};
    let parsedHeaders = {};
    let finalBody;

    // ✅ BODY FIX
    if (bodyType === "json") {
      try {
        parsedBody = JSON.parse(body || "{}");
        finalBody = parsedBody;
      } catch {
        alert("Invalid JSON Body");
        setLoading(false);
        return;
      }
    } else if (bodyType === "text") {
      finalBody = body;
    } else if (bodyType === "form-data") {
      const formData = new FormData();

      formDataFields.forEach((field) => {
        if (!field.key) return;

        if (field.type === "file") {
          formData.append(field.key, field.value);
        } else {
          formData.append(field.key, field.value);
        }
      });

      finalBody = formData;
    }

    // ✅ HEADERS SAFE
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

    // ✅ FORM DATA HEADER FIX
    if (bodyType === "form-data") {
      delete finalHeaders["Content-Type"];
    }

    // ✅ PARAMS + ENV
    const query = new URLSearchParams(params).toString();
    const replacedUrl = replaceEnv(url, envs[activeEnv] || {});
    const finalUrl = query ? `${replacedUrl}?${query}` : replacedUrl;

    const start = Date.now();

    const res = await api.post("/request/send", {
      method,
      url: finalUrl,
      headers: finalHeaders,
      body: finalBody,
    });

    const end = Date.now();

    const responseData = res.data?.data || res.data;
    const size = new Blob([JSON.stringify(responseData)]).size;

    // ✅ META
    setMeta({
      status: res.data?.data?.status || 200,
      time: end - start,
      size: (size / 1024).toFixed(2),
    });

    setResponse(responseData);

    // ✅ LAST REQUEST (for AI / Clone etc)
    setLastRequest({
      method,
      url: finalUrl,
      headers: finalHeaders,
      body: finalBody,
    });

    // ✅ 🔥 AUTO HISTORY (ENHANCED)
    const prev = JSON.parse(localStorage.getItem("history")) || [];

    const newEntry = {
      method,
      url: finalUrl,
      headers: finalHeaders,
      body:
        bodyType === "form-data"
          ? "FormData (file upload)"
          : finalBody, // avoid file object crash
      time: new Date().toLocaleTimeString(),
    };

    localStorage.setItem(
      "history",
      JSON.stringify([newEntry, ...prev.slice(0, 49)]) // limit 50 entries
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
const handleShare = () => {
  const requestData = {
    method,
    url,
    headers: JSON.parse(headers || "{}"),
    body,
  };

  const json = JSON.stringify(requestData, null, 2);

  navigator.clipboard.writeText(json);

  alert("Request copied as JSON ✅");
};
const handleDownload = () => {
  if (!response) {
    alert("No response to download ❌");
    return;
  }

  const dataStr = JSON.stringify(response, null, 2);

  const blob = new Blob([dataStr], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "response.json";
  a.click();

  URL.revokeObjectURL(url);
};
  useEffect(() => {
    if (selectedRequest) {
      setMethod(selectedRequest.method);
      setUrl(selectedRequest.url);
      setBody(JSON.stringify(selectedRequest.body || {}, null, 2));
      setHeaders(JSON.stringify(selectedRequest.headers || {}, null, 2));
    }
  }, [selectedRequest]);
  useEffect(() => {
  if (tabData) {
    setMethod(tabData.method || "GET");
    setUrl(tabData.url || "");
    setBody(tabData.body || "{}");
    setHeaders(tabData.headers || "{}");

    setIsInitialized(true); // ✅ ADD THIS
  }
}, [tabData]);

useEffect(() => {
  if (!isInitialized) return;

  updateTabData({
    method,
    url,
    body,
    headers,
  });
}, [method, url, body, headers]);
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
        <button
  onClick={handleShare}
  className="bg-blue-600 text-white px-4 rounded"
>
  Share
</button>
      </div>

      {/* 🔥 ENV SWITCHER */}
<select
  value={activeEnv}
  onChange={(e) => setActiveEnv(e.target.value)}
  className="mb-2 bg-[#0f172a] border border-[#334155] p-2 rounded text-sm"
>
  <option value="default">Default</option>
  <option value="dev">Dev</option>
  <option value="prod">Prod</option>
</select>

<AuthPanel setAuthHeader={setAuthHeader} />
<EnvPanel setEnv={setEnv} />
      <ParamsPanel setParams={setParams} />
      <div className="mb-2">
  <select
    value={bodyType}
    onChange={(e) => setBodyType(e.target.value)}
    className="bg-[#0f172a] border border-[#334155] p-2 rounded text-sm"
  >
    <option value="json">JSON</option>
    <option value="text">Text</option>
    <option value="form-data">Form Data</option>
  </select>
</div>

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
        <button
  onClick={() => setActiveTab("params")}
  className={`px-3 py-1 rounded ${
    activeTab === "params"
      ? "bg-[#6366f1]"
      : "bg-[#0f172a] hover:bg-[#1e293b]"
  }`}
>
  Params
</button>
      </div>
      {activeTab === "body" && isBodyAllowed && (
  <div>

    {/* Body Type Selector */}
    <div className="mb-2">
      <select
        value={bodyType}
        onChange={(e) => setBodyType(e.target.value)}
        className="bg-[#0f172a] border border-[#334155] p-2 rounded text-sm"
      >
        <option value="json">JSON</option>
        <option value="text">Text</option>
      </select>
    </div>

    {/* JSON Editor */}
    {bodyType === "json" && (
      <Editor
        height="200px"
        defaultLanguage="json"
        value={body}
        onChange={(value) => setBody(value || "")}
        theme="vs-dark"
      />
    )}

    {/* TEXT Editor */}
    {bodyType === "text" && (
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full h-[200px] p-2 bg-[#020617] border border-[#334155] rounded text-sm"
      />
    )}
    {bodyType === "form-data" && (
  <div className="border border-[#334155] p-3 rounded">

    {formDataFields.map((field, index) => (
      <div key={index} className="flex gap-2 mb-2">

        {/* KEY */}
        <input
          placeholder="key"
          value={field.key}
          onChange={(e) => {
            const updated = [...formDataFields];
            updated[index].key = e.target.value;
            setFormDataFields(updated);
          }}
          className="flex-1 p-2 bg-[#020617] border border-[#334155] rounded"
        />

        {/* VALUE / FILE */}
        {field.type === "file" ? (
          <input
            type="file"
            onChange={(e) => {
              const updated = [...formDataFields];
              updated[index].value = e.target.files[0];
              setFormDataFields(updated);
            }}
            className="flex-1"
          />
        ) : (
          <input
            placeholder="value"
            value={field.value}
            onChange={(e) => {
              const updated = [...formDataFields];
              updated[index].value = e.target.value;
              setFormDataFields(updated);
            }}
            className="flex-1 p-2 bg-[#020617] border border-[#334155] rounded"
          />
        )}

        {/* TYPE SELECT */}
        <select
          value={field.type}
          onChange={(e) => {
            const updated = [...formDataFields];
            updated[index].type = e.target.value;
            setFormDataFields(updated);
          }}
          className="bg-[#0f172a] border border-[#334155] rounded"
        >
          <option value="text">Text</option>
          <option value="file">File</option>
        </select>

        {/* DELETE */}
        <button
          onClick={() => {
            setFormDataFields(formDataFields.filter((_, i) => i !== index));
          }}
          className="bg-red-500 px-2 rounded"
        >
          X
        </button>

      </div>
    ))}

    {/* ADD */}
    <button
      onClick={() =>
        setFormDataFields([
          ...formDataFields,
          { key: "", value: "", type: "text" },
        ])
      }
      className="bg-green-500 px-3 py-1 rounded text-sm"
    >
      + Add Field
    </button>

  </div>
)}

  </div>
)}

      {activeTab === "headers" && (
  <div className="border border-[#334155] p-3 rounded">

    {Object.entries(JSON.parse(headers || "{}")).map(([key, value], i) => (
      <div key={i} className="flex gap-2 mb-2">

        <input
          value={key}
          onChange={(e) => {
            const updated = { ...JSON.parse(headers || "{}") };
            const newKey = e.target.value;

            const oldValue = updated[key];
            delete updated[key];
            updated[newKey] = oldValue;

            setHeaders(JSON.stringify(updated, null, 2));
          }}
          className="flex-1 p-2 bg-[#020617] border border-[#334155] rounded text-sm"
        />

        <input
          value={value}
          onChange={(e) => {
            const updated = { ...JSON.parse(headers || "{}") };
            updated[key] = e.target.value;

            setHeaders(JSON.stringify(updated, null, 2));
          }}
          className="flex-1 p-2 bg-[#020617] border border-[#334155] rounded text-sm"
        />

        <button
          onClick={() => {
            const updated = { ...JSON.parse(headers || "{}") };
            delete updated[key];
            setHeaders(JSON.stringify(updated, null, 2));
          }}
          className="bg-red-500 px-2 rounded text-xs"
        >
          X
        </button>

      </div>
    ))}

    {/* ADD BUTTON */}
    <button
      onClick={() => {
        const updated = { ...JSON.parse(headers || "{}") };
        updated["new-key"] = "value";

        setHeaders(JSON.stringify(updated, null, 2));
      }}
      className="bg-green-500 px-3 py-1 rounded text-sm mt-2"
    >
      + Add Header
    </button>

  </div>
)}

      {/* Meta */}
     {meta && (
  <div className="flex items-center gap-4 mt-3 text-sm">

    {/* STATUS BADGE */}
    <span
      className={`px-2 py-1 rounded font-semibold ${
        meta.status >= 200 && meta.status < 300
          ? "bg-green-600 text-white"
          : meta.status >= 400 && meta.status < 500
          ? "bg-red-600 text-white"
          : "bg-yellow-600 text-black"
      }`}
    >
      {meta.status}
    </span>

    {/* TIME */}
    <span className="text-blue-400 font-medium">
      ⚡ {meta.time} ms
    </span>

    {/* SIZE */}
    <span className="text-yellow-400 font-medium">
      📦 {meta.size} KB
    </span>

  </div>
)}
<div className="flex gap-2 mt-3">
  <button
    onClick={() => setViewMode("pretty")}
    className={`px-3 py-1 rounded ${
      viewMode === "pretty" ? "bg-blue-500" : "bg-gray-700"
    }`}
  >
    Pretty
  </button>

  <button
    onClick={() => setViewMode("raw")}
    className={`px-3 py-1 rounded ${
      viewMode === "raw" ? "bg-blue-500" : "bg-gray-700"
    }`}
  >
    Raw
  </button>
</div>
      <ResponseViewer data={response} viewMode={viewMode} />

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
      
<div className="flex gap-2 mt-2">

  {/* ✅ EXISTING SAVE (UNCHANGED) */}
  <button
    onClick={() => setShowModal(true)}
    className="bg-green-600 text-white px-4 rounded"
  >
    Save
  </button>

  {/* 🔥 NEW DOWNLOAD BUTTON */}
  <button
    onClick={handleDownload}
    className="bg-yellow-500 text-black px-4 rounded"
  >
    Download
  </button>


<button
  onClick={() => {
    const curl = generateCurl({
      method,
      url,
      headers: JSON.parse(headers || "{}"),
      body:
        bodyType === "json"
          ? JSON.parse(body || "{}")
          : body,
    });

    navigator.clipboard.writeText(curl);
    alert("cURL copied ✅");
  }}
  className="bg-purple-600 text-white px-4 rounded"
>
  Copy cURL
</button>
</div>
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