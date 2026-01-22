import { useSongData } from "../context/SongContext";

import AlbumCard from "../components/AlbumCard";
import Layout from "../components/Layout";
import SongCard from "../components/SongCard";
import Loading from "../components/Loading";

const Home = () => {
  const { albums, songs, loading } = useSongData();

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <Layout>
          <div className="mb-4">
            <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
            <div className="flex overflow-auto">
              {albums?.map((e, i) => (
                <AlbumCard
                  key={i}
                  id={e.id}
                  name={e.title}
                  desc={e.description}
                  image={e.thumbnail}
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
            <div className="flex overflow-auto">
              {songs?.map((e, i) => (
                <SongCard
                  key={i}
                  id={e.id}
                  name={e.title}
                  desc={e.description}
                  image={e.thumbnail}
                />
              ))}
            </div>
          </div>
        </Layout>
      )}
    </div>
  );
};

export default Home;
