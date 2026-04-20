import { useState } from "react";
import api from "../../api/axios";

const TestsPanel = ({ response }) => {
  const [tests, setTests] = useState(null);

  const generate = async () => {
    const res = await api.post("/ai/analyze", {
      response,
      type: "tests",
    });
    setTests(res.data.data);
  };

  return (
    <div>
      <button
        onClick={generate}
        className="bg-[#6366f1] px-3 py-1 rounded text-sm"
      >
        Generate Tests
      </button>

      <pre className="text-xs mt-2">
        {JSON.stringify(tests, null, 2)}
      </pre>
    </div>
  );
};

export default TestsPanel;