import { useState } from "react";

const AuthPanel = ({ setAuthHeader }) => {
  const [token, setToken] = useState("");

  const applyToken = () => {
    setAuthHeader({
      Authorization: `Bearer ${token}`,
    });
  };

  return (
    <div className="bg-[#1e293b] p-3 rounded border border-[#334155]">
      <input
        type="text"
        placeholder="Enter Bearer Token..."
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="w-full p-2 bg-[#020617] border border-[#334155] rounded text-sm"
      />

      <button
        onClick={applyToken}
        className="mt-2 bg-[#6366f1] px-3 py-1 rounded text-sm"
      >
        Apply Token
      </button>
    </div>
  );
};

export default AuthPanel;