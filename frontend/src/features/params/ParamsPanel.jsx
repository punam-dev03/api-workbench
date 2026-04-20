import { useState } from "react";

const ParamsPanel = ({ setParams }) => {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const addParam = () => {
    setParams((prev) => ({
      ...prev,
      [key]: value,
    }));
    setKey("");
    setValue("");
  };

  return (
    <div className="bg-[#1e293b] p-3 rounded border border-[#334155]">
      <div className="flex gap-2">
        <input
          placeholder="key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="p-2 bg-[#020617] border rounded text-sm"
        />
        <input
          placeholder="value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="p-2 bg-[#020617] border rounded text-sm"
        />
        <button onClick={addParam}>Add</button>
      </div>
    </div>
  );
};

export default ParamsPanel;