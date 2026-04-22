import { useState } from "react";

const AuthPanel = ({ setAuthHeader }) => {
  const [type, setType] = useState("none");
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [keyName, setKeyName] = useState("x-api-key");

  const applyAuth = () => {
    let header = {};

    if (type === "bearer") {
      header = {
        Authorization: `Bearer ${token}`,
      };
    }

    if (type === "basic") {
      const encoded = btoa(`${username}:${password}`);
      header = {
        Authorization: `Basic ${encoded}`,
      };
    }

    if (type === "apikey") {
      header = {
        [keyName]: apiKey,
      };
    }

    setAuthHeader(header);
  };

  return (
    <div className="mb-3 p-3 border border-[#334155] rounded bg-[#020617]">

      <h3 className="text-sm mb-2">Authorization</h3>

      {/* 🔥 Type Select */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="mb-2 p-2 bg-[#1e293b] border border-[#334155] rounded text-sm w-full"
      >
        <option value="none">No Auth</option>
        <option value="bearer">Bearer Token</option>
        <option value="basic">Basic Auth</option>
        <option value="apikey">API Key</option>
      </select>

      {/* 🔥 Dynamic UI */}

      {type === "bearer" && (
        <input
          type="text"
          placeholder="Enter Bearer Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full p-2 mb-2 bg-[#1e293b] border border-[#334155] rounded text-sm"
        />
      )}

      {type === "basic" && (
        <div className="flex gap-2 mb-2">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 p-2 bg-[#1e293b] border border-[#334155] rounded text-sm"
          />
          <input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 p-2 bg-[#1e293b] border border-[#334155] rounded text-sm"
          />
        </div>
      )}

      {type === "apikey" && (
        <div className="flex gap-2 mb-2">
          <input
            placeholder="Key Name"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            className="flex-1 p-2 bg-[#1e293b] border border-[#334155] rounded text-sm"
          />
          <input
            placeholder="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-1 p-2 bg-[#1e293b] border border-[#334155] rounded text-sm"
          />
        </div>
      )}

      {/* 🔥 Apply Button */}
      <button
        onClick={applyAuth}
        className="bg-blue-600 px-3 py-1 rounded text-sm"
      >
        Apply Auth
      </button>
    </div>
  );
};

export default AuthPanel;