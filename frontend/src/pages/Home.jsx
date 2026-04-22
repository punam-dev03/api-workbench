import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import ApiTester from "../features/apiTester/ApiTester";
import Collections from "../features/collections/Collections";
import History from "../features/history/History";

const Home = () => {
  const [page, setPage] = useState("tester");
  const [selectedRequest, setSelectedRequest] = useState(null);

  // 🔥 EDIT TAB
  const [editingTabId, setEditingTabId] = useState(null);
  const [tempName, setTempName] = useState("");

  // 🔥 WORKSPACES
  const [workspaces, setWorkspaces] = useState(() => {
    return JSON.parse(localStorage.getItem("workspaces")) || [
      { name: "Default" },
    ];
  });

  const [activeWorkspace, setActiveWorkspace] = useState(() => {
    return localStorage.getItem("activeWorkspace") || "Default";
  });

  // 🔥 TABS PER WORKSPACE
  const [tabsByWorkspace, setTabsByWorkspace] = useState(() => {
    return JSON.parse(localStorage.getItem("tabsByWorkspace")) || {
      Default: [
        {
          id: 1,
          name: "Request 1",
          data: {
            method: "GET",
            url: "",
            body: "{}",
            headers: "{}",
          },
        },
      ],
    };
  });

  const tabs = tabsByWorkspace[activeWorkspace] || [];

  const [activeTab, setActiveTab] = useState(() => {
    return tabs[0]?.id || 1;
  });

  // 🔥 UPDATE TABS
  const updateTabs = (newTabs) => {
    setTabsByWorkspace((prev) => ({
      ...prev,
      [activeWorkspace]: newTabs,
    }));
  };

  // ➕ ADD TAB
  const addTab = () => {
    const newTab = {
      id: Date.now(),
      name: `Request ${tabs.length + 1}`,
      data: {
        method: "GET",
        url: "",
        body: "{}",
        headers: "{}",
      },
    };

    updateTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  // ❌ REMOVE TAB
  const removeTab = (id) => {
    if (tabs.length === 1) return;

    const updated = tabs.filter((t) => t.id !== id);
    updateTabs(updated);

    if (activeTab === id) {
      setActiveTab(updated[0].id);
    }
  };

  // ➕ ADD WORKSPACE
  const addWorkspace = () => {
    const name = prompt("Enter workspace name");
    if (!name) return;

    const updated = [...workspaces, { name }];
    setWorkspaces(updated);
    setActiveWorkspace(name);
  };

  // 🔥 PERSIST
  useEffect(() => {
    localStorage.setItem("tabsByWorkspace", JSON.stringify(tabsByWorkspace));
  }, [tabsByWorkspace]);

  useEffect(() => {
    localStorage.setItem("workspaces", JSON.stringify(workspaces));
  }, [workspaces]);

  useEffect(() => {
    localStorage.setItem("activeWorkspace", activeWorkspace);
  }, [activeWorkspace]);

  // 🔥 PAGE RENDER
  const renderPage = () => {
    switch (page) {
      case "collections":
        return <Collections onSelect={setSelectedRequest} />;

      case "history":
        return <History onSelect={setSelectedRequest} />;

      default:
        return (
          <ApiTester
            key={activeTab}
            selectedRequest={selectedRequest}
            tabData={tabs.find((t) => t.id === activeTab)?.data}
            updateTabData={(newData) => {
              updateTabs(
                tabs.map((t) =>
                  t.id === activeTab
                    ? { ...t, data: { ...t.data, ...newData } }
                    : t
                )
              );
            }}
          />
        );
    }
  };

  return (
    <MainLayout setPage={setPage}>
      
      {/* 🔥 TOP BAR */}
      <div className="flex gap-2 mb-3 items-center flex-wrap">

        {/* WORKSPACE */}
        <select
          value={activeWorkspace}
          onChange={(e) => setActiveWorkspace(e.target.value)}
          className="bg-[#0f172a] border border-[#334155] p-2 rounded text-sm"
        >
          {workspaces.map((ws, i) => (
            <option key={i} value={ws.name}>
              {ws.name}
            </option>
          ))}
        </select>

        <button
          onClick={addWorkspace}
          className="bg-green-600 px-2 py-1 rounded text-sm"
        >
          + Workspace
        </button>

        {/* 🔥 TABS */}
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center gap-2 px-3 py-1 rounded text-sm ${
              activeTab === tab.id
                ? "bg-purple-600"
                : "bg-gray-700"
            }`}
          >
            {editingTabId === tab.id ? (
              <input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={() => {
                  updateTabs(
                    tabs.map((t) =>
                      t.id === tab.id
                        ? { ...t, name: tempName || t.name }
                        : t
                    )
                  );
                  setEditingTabId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateTabs(
                      tabs.map((t) =>
                        t.id === tab.id
                          ? { ...t, name: tempName || t.name }
                          : t
                      )
                    );
                    setEditingTabId(null);
                  }
                }}
                className="bg-[#020617] text-white px-1 rounded text-sm"
                autoFocus
              />
            ) : (
              <span
                onClick={() => setActiveTab(tab.id)}
                onDoubleClick={() => {
                  setEditingTabId(tab.id);
                  setTempName(tab.name);
                }}
                className="cursor-pointer"
              >
                {tab.name}
              </span>
            )}

            <span
              onClick={() => removeTab(tab.id)}
              className="text-xs cursor-pointer hover:text-red-400"
            >
              ✕
            </span>
          </div>
        ))}

        {/* ➕ ADD TAB */}
        <button
          onClick={addTab}
          className="bg-green-600 px-3 rounded text-white"
        >
          +
        </button>

      </div>

      {/* 🔥 PAGE */}
      {renderPage()}

    </MainLayout>
  );
};

export default Home;