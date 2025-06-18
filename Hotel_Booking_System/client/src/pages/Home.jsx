import ExclusiveOffers from "../components/ExclusiveOffers";
import FeaturedDestination from "../components/FeaturedDestination";
import Hero from "../components/Hero";
import NewsLetter from "../components/NewsLetter";
import Testimonial from "../components/Testimonial";

const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedDestination />
      <ExclusiveOffers />
      <Testimonial />
      <NewsLetter />
    </>
  );
};

export default Home;
