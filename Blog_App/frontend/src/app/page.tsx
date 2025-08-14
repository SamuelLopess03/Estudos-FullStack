import { redirect } from "next/navigation";

const Home = () => {
  return redirect("/blogs");
};

export default Home;
