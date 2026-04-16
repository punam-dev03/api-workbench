import MainLayout from "../components/layout/MainLayout";
import ApiTester from "../features/apiTester/ApiTester";

const Home = () => {
  return (
    <MainLayout>
      <ApiTester />
    </MainLayout>
  );
};

export default Home;