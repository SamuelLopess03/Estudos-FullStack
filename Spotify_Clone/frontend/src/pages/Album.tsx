import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaBookmark, FaPlay } from "react-icons/fa";

import { useSongData } from "../context/SongContext";
import { useUserData } from "../context/UserContext";

import Layout from "../components/Layout";
import Loading from "../components/Loading";

const Album = () => {
  const {
    albumSong,
    albumData,
    loading,
    setIsPlaying,
    setSelectedSong,
    fetchAlbumSongs,
  } = useSongData();

  const { isAuth, addToPlaylist } = useUserData();

  const params = useParams<{ id: string }>();

  useEffect(() => {
    if (params.id) {
      fetchAlbumSongs(params.id);
    }
  }, [params.id]);

  return (
    <div>
      <Layout>
        {albumData && (
          <>
            {loading ? (
              <Loading />
            ) : (
              <>
                <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-center">
                  {albumData.thumbnail && (
                    <img
                      src={albumData.thumbnail}
                      alt=""
                      className="w-48 rounded"
                    />
                  )}

                  <div className="flex flex-col">
                    <p>PlayList</p>
                    <h2 className="text-3xl font-bold mb-4 md:text-5xl">
                      {albumData.title} PlayList
                    </h2>
                    <h4>{albumData.description}</h4>
                    <p className="mt-1">
                      <img
                        src="/logo.png"
                        alt=""
                        className="inline-block w-6"
                      />
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
                  <p>
                    <b className="mr-4">#</b>
                  </p>
                  <p className="hidden sm:block">Description</p>
                  <p className="text-center">Actions</p>
                </div>

                <hr />
                {albumSong &&
                  albumSong.map((song, index) => {
                    return (
                      <div
                        className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]
                                 hover:bg-[#ffffff2b] cursor-pointer"
                        key={index}
                      >
                        <p className="text-white">
                          <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
                          <img
                            src={
                              song.thumbnail ? song.thumbnail : "/download.jpg"
                            }
                            className="inline w-10 mr-5"
                            alt=""
                          />{" "}
                          {song.title}
                        </p>
                        <p className="text-[15px] hidden sm:block">
                          {song.description.slice(0, 30)}...
                        </p>
                        <p className="flex justify-center items-center gap-5">
                          {isAuth && (
                            <button
                              className="text-[15px] text-center"
                              onClick={() => addToPlaylist(song.id)}
                            >
                              <FaBookmark />
                            </button>
                          )}
                          <button
                            className="text-[15px] text-center"
                            onClick={() => {
                              setSelectedSong(song.id);
                              setIsPlaying(true);
                            }}
                          >
                            <FaPlay />
                          </button>
                        </p>
                      </div>
                    );
                  })}
              </>
            )}
          </>
        )}
      </Layout>
    </div>
  );
};

export default Album;
