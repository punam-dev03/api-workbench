const MainLayout = ({ children }) => {
  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4">
        <h1 className="text-xl font-bold mb-4">AI API Tester</h1>
        <ul>
          <li className="mb-2">Collections</li>
          <li className="mb-2">History</li>
        </ul>
      </div>

      {/* Main */}
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
};

export default MainLayout;