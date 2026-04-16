import { useEffect, useState } from "react";
import api from "../../api/axios";

const Collections = ({ onSelect }) => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/collections");
      setCollections(res.data);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-[#1e293b] p-4 rounded border border-[#334155]">
      <h2 className="text-sm font-semibold mb-4">Collections</h2>

      {collections.length === 0 && (
        <div className="text-gray-400 text-sm">No collections</div>
      )}

      {collections.map((col) => (
        <div key={col._id} className="mb-4">

          <div className="text-blue-400 text-sm mb-2">
            {col.name}
          </div>

          {col.requests?.map((req, i) => (
            <div
              key={i}
              onClick={() => onSelect(req)}
              className="p-2 text-xs bg-[#020617] rounded mb-1 cursor-pointer hover:bg-[#1e293b]"
            >
              {req.method} - {req.url}
            </div>
          ))}

        </div>
      ))}
    </div>
  );
};

export default Collections;