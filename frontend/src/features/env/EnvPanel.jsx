import { useState } from "react";

const EnvPanel = ({ setEnv }) => {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [envs, setEnvs] = useState({});

  const addEnv = () => {
    if (!key) return;

    const updated = { ...envs, [key]: value };
    setEnvs(updated);
    setEnv(updated);

    setKey("");
    setValue("");
  };

  return (
    <div className="mb-3">
      <h3 className="text-sm mb-1">Environment Variables</h3>

      <div className="flex gap-2 mb-2">
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Key (e.g. baseUrl)"
          className="p-1 border"
        />

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Value"
          className="p-1 border"
        />

        <button onClick={addEnv} className="bg-green-500 px-2 text-white">
          Add
        </button>
      </div>

      {/* Show added env */}
      <div className="text-xs">
        {Object.entries(envs).map(([k, v]) => (
          <div key={k}>
            {k} = {v}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnvPanel;