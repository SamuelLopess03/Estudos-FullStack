"use client";

import { Button } from "@/components/ui/button";

import { useAppData } from "@/context/AppContext";

import Loading from "@/components/loading";

const Home = () => {
  const { loading } = useAppData();

  return <div>{loading ? <Loading /> : <Button>Click Me</Button>}</div>;
};

export default Home;
