import { useAuth } from "@/contexts/useAuth";

const Home = () => {
  const { user } = useAuth();

  return <div>환영합니다, {user?.nickname}님</div>;
};

export default Home;
