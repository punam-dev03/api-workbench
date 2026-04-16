import { useState } from "react";

const MainLayout = ({ children, setPage }) => {
  const [active, setActive] = useState("tester");

  const handleNav = (page) => {
    setActive(page);
    setPage(page); // 🔥 IMPORTANT connection
  };

  return (
    <div className="h-screen flex bg-[#0f172a] text-[#e2e8f0]">

      {/* 🔥 Sidebar */}
      <div className="w-64 bg-[#020617] border-r border-[#1e293b] p-4 flex flex-col">

        {/* Logo */}
        <h1 className="text-lg font-semibold mb-6 tracking-wide">
          API Workbench
        </h1>

        {/* Navigation */}
        <div className="flex flex-col gap-2 text-sm">

          <button
            onClick={() => handleNav("tester")}
            className={`p-2 rounded text-left transition ${
              active === "tester"
                ? "bg-[#6366f1]"
                : "hover:bg-[#1e293b]"
            }`}
          >
            API Tester
          </button>

          <button
            onClick={() => handleNav("collections")}
            className={`p-2 rounded text-left transition ${
              active === "collections"
                ? "bg-[#6366f1]"
                : "hover:bg-[#1e293b]"
            }`}
          >
            Collections
          </button>

          <button
            onClick={() => handleNav("history")}
            className={`p-2 rounded text-left transition ${
              active === "history"
                ? "bg-[#6366f1]"
                : "hover:bg-[#1e293b]"
            }`}
          >
            History
          </button>

        </div>

        {/* Footer (optional clean touch) */}
        <div className="mt-auto text-xs text-gray-500 pt-4 border-t border-[#1e293b]">
          v1.0 Developer Tool
        </div>

      </div>

      {/* 🔥 Main Content */}
      <div className="flex-1 p-4 overflow-auto">
        {children}
      </div>

    </div>
  );
};

export default MainLayout;