import type { NextPage } from "next";
import Layout from "../components/layout";
import useAuthRedirect from "../hooks/use-auth-redirect";

const Home: NextPage = () => {
  useAuthRedirect("/login");
  return <Layout>Test</Layout>;
};

export default Home;
