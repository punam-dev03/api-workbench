import { useState } from "react";

const EnvPanel = ({ setEnv }) => {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [envs, setEnvs] = useState({});

  const addEnv = () => {
    if (!key) return;

    // ✅ local state update
    const updated = { ...envs, [key]: value };
    setEnvs(updated);

    // ✅ IMPORTANT FIX (merge with previous)
    setEnv((prev) => ({
      ...prev,
      [key]: value,
    }));

    setKey("");
    setValue("");
  };

  const removeEnv = (k) => {
    const updated = { ...envs };
    delete updated[k];
    setEnvs(updated);

    // 🔥 also remove from parent state
    setEnv((prev) => {
      const newEnv = { ...prev };
      delete newEnv[k];
      return newEnv;
    });
  };

  return (
    <div className="mb-3 border border-[#334155] p-3 rounded bg-[#020617]">

      <h3 className="text-sm mb-2 text-gray-300">
        Environment Variables
      </h3>

      {/* INPUTS */}
      <div className="flex gap-2 mb-2">
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Key (e.g. BASE_URL)"
          className="flex-1 p-2 bg-[#020617] border border-[#334155] rounded text-sm"
        />

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Value"
          className="flex-1 p-2 bg-[#020617] border border-[#334155] rounded text-sm"
        />

        <button
          onClick={addEnv}
          className="bg-green-500 px-3 py-1 rounded text-white text-sm"
        >
          Add
        </button>
      </div>

      {/* LIST */}
      <div className="text-xs text-gray-300">
        {Object.entries(envs).length === 0 && (
          <div className="text-gray-500">No variables added</div>
        )}

        {Object.entries(envs).map(([k, v]) => (
          <div
            key={k}
            className="flex justify-between items-center bg-[#1e293b] px-2 py-1 rounded mb-1"
          >
            <span>
              {k} = {v}
            </span>

            <button
              onClick={() => removeEnv(k)}
              className="text-red-400 text-xs"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnvPanel;