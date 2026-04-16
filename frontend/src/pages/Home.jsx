import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import ApiTester from "../features/apiTester/ApiTester";
import Collections from "../features/collections/Collections";
import History from "../features/history/History";

const Home = () => {
  const [page, setPage] = useState("tester");
  const [selectedRequest, setSelectedRequest] = useState(null);
  

  const renderPage = () => {
  switch (page) {
    case "collections":
      return <Collections onSelect={setSelectedRequest} />;

    case "history":
      return <History onSelect={setSelectedRequest} />;

    default:
      return <ApiTester selectedRequest={selectedRequest} />;
  }
};

  return (
    <MainLayout setPage={setPage}>
      {renderPage()}
    </MainLayout>
  );
};

export default Home;