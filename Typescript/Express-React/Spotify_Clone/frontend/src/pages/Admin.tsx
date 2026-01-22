import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "axios";

import { useUserData } from "../context/UserContext";
import { useSongData } from "../context/SongContext";

const server = "http://localhost:7000";

const Admin = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [album, setAlbum] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const { user } = useUserData();

  const { albums, songs, fetchSongs, fetchAlbums } = useSongData();

  const navigate = useNavigate();

  const fileChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;

    setFile(selectedFile);
  };

  const addAlbumHandler = async (event: FormEvent) => {
    event.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    setBtnLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/album/new`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);
      fetchAlbums();

      setBtnLoading(false);
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An Error Occured");
      setBtnLoading(false);
    }
  };

  const addSongHandler = async (event: FormEvent) => {
    event.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    formData.append("album", album);

    setBtnLoading(true);

    try {
      const { data } = await axios.post(`${server}/api/v1/song/new`, formData, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      toast.success(data.message);
      fetchSongs();

      setBtnLoading(false);
      setTitle("");
      setDescription("");
      setFile(null);
      setAlbum("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An Error Occured");
      setBtnLoading(false);
    }
  };

  const addThumbnailHandler = async (event: FormEvent, id: string) => {
    event.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setBtnLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/song/${id}`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);
      fetchSongs();

      setBtnLoading(false);
      setFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An Error Occured");
      setBtnLoading(false);
    }
  };

  const deleteAlbum = async (id: string) => {
    if (confirm("Are you sure you want to delete this album?")) {
      setBtnLoading(true);

      try {
        const { data } = await axios.delete(`${server}/api/v1/album/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchSongs();
        fetchAlbums();
        setBtnLoading(false);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An Error Occured");
        setBtnLoading(false);
      }
    }
  };

  const deleteSong = async (id: string) => {
    if (confirm("Are you sure you want to delete this song?")) {
      setBtnLoading(true);

      try {
        const { data } = await axios.delete(`${server}/api/v1/song/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchSongs();
        setBtnLoading(false);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An Error Occured");
        setBtnLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#212121] text-white p-8">
      <Link
        to={"/"}
        className="bg-green-500 text-white font-bold py-2 px-4 rounded-full"
      >
        Go to Home Page
      </Link>

      <h2 className="text-2xl font-bold mb-6 mt-6">Add Album</h2>

      <form
        className="bg-[#181818] p-6 rounded-lg shadow-lg flex flex-col items-center justify-center gap-4"
        onSubmit={addAlbumHandler}
      >
        <input
          type="text"
          placeholder="Title"
          className="auth-input"
          onChange={(event) => setTitle(event.target.value)}
          value={title}
          required
        />

        <input
          type="text"
          placeholder="Description"
          className="auth-input"
          onChange={(event) => setDescription(event.target.value)}
          value={description}
          required
        />

        <input
          type="file"
          placeholder="Choose Thumbnail"
          className="auth-input"
          accept="image/*"
          onChange={fileChangeHandler}
          required
        />

        <button
          className="auth-btn"
          style={{ width: "100px" }}
          disabled={btnLoading}
        >
          {btnLoading ? "Please Wait..." : "Add"}
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-6 mt-6">Add Song</h2>

      <form
        className="bg-[#181818] p-6 rounded-lg shadow-lg flex flex-col items-center justify-center gap-4"
        onSubmit={addSongHandler}
      >
        <input
          type="text"
          placeholder="Title"
          className="auth-input"
          onChange={(event) => setTitle(event.target.value)}
          value={title}
          required
        />

        <input
          type="text"
          placeholder="Description"
          className="auth-input"
          onChange={(event) => setDescription(event.target.value)}
          value={description}
          required
        />

        <select
          className="auth-input"
          value={album}
          onChange={(event) => setAlbum(event.target.value)}
          required
        >
          <option value="">Choose Album</option>
          {albums?.map((album: any, index: number) => (
            <option value={album.id} key={index}>
              {album.title}
            </option>
          ))}
        </select>

        <input
          type="file"
          placeholder="Choose Audio"
          className="auth-input"
          accept="audio/*"
          onChange={fileChangeHandler}
          required
        />

        <button
          className="auth-btn"
          style={{ width: "100px" }}
          disabled={btnLoading}
        >
          {btnLoading ? "Please Wait..." : "Add"}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Added Albums</h3>

        <div className="flex justify-center md:justify-start gap-2 items-center flex-wrap">
          {albums?.map((album, index) => (
            <div className="bg-[#181818] p-4 rounded-lg shadow-md" key={index}>
              <img src={album.thumbnail} className="mr-1 w-52 h-52" alt="" />
              <h4 className="text-lg font-bold">
                {album.title.slice(0, 30)}...
              </h4>
              <h4 className="text-lg font-bold">
                {album.description.slice(0, 20)}...
              </h4>
              <button
                className="px-3 py-1 mt-3 bg-red-500 text-white rounded cursor-pointer"
                disabled={btnLoading}
                onClick={() => deleteAlbum(album.id)}
              >
                <MdDelete />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Added Songs</h3>

        <div className="flex justify-center md:justify-start gap-2 items-center flex-wrap">
          {songs?.map((song, index) => (
            <div className="bg-[#181818] p-4 rounded-lg shadow-md" key={index}>
              {song.thumbnail ? (
                <img src={song.thumbnail} className="mr-1 w-52 h-52" alt="" />
              ) : (
                <div className="flex flex-col justify-center items-center gap-2 w-[300px]">
                  <input type="file" onChange={fileChangeHandler} />
                  <button
                    className="auth-btn"
                    style={{ width: "200px" }}
                    disabled={btnLoading}
                    onClick={(event) => addThumbnailHandler(event, song.id)}
                  >
                    {btnLoading ? "Please Wait..." : "Add Thumbnail"}
                  </button>
                </div>
              )}
              <h4 className="text-lg font-bold">
                {song.title.slice(0, 30)}...
              </h4>
              <h4 className="text-lg font-bold">
                {song.description.slice(0, 20)}...
              </h4>
              <button
                className="px-3 py-1 mt-3 bg-red-500 text-white rounded cursor-pointer"
                disabled={btnLoading}
                onClick={() => deleteSong(song.id)}
              >
                <MdDelete />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
