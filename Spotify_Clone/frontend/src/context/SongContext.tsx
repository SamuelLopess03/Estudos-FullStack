import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";

const server = "http://localhost:8000";

export interface Song {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  audio: string;
  album: string;
}
export interface Album {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

interface SongContextType {
  songs: Song[];
  albums: Album[];
  isPlaying: boolean;
  loading: boolean;
  selectedSong: string | null;
  setIsPlaying: (value: boolean) => void;
  setSelectedSong: (value: string) => void;
}

const SongContext = createContext<SongContextType | undefined>(undefined);

interface SongProviderProps {
  children: ReactNode;
}

export const SongProvider: React.FC<SongProviderProps> = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [albums, setAlbums] = useState<Album[]>([]);

  const fetchSongs = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await axios.get<Song[]>(`${server}/api/v1/song/all`);
      setSongs(data);
      if (data.length > 0) setSelectedSong(data[0].id.toString());
      setIsPlaying(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAlbums = useCallback(async () => {
    try {
      const { data } = await axios.get<Album[]>(`${server}/api/v1/album/all`);
      setAlbums(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchSongs();
    fetchAlbums();
  }, []);

  const value = {
    songs,
    albums,
    isPlaying,
    loading,
    selectedSong,
    setIsPlaying,
    setSelectedSong,
  };

  return <SongContext.Provider value={value}>{children}</SongContext.Provider>;
};

export const useSongData = (): SongContextType => {
  const context = useContext(SongContext);

  if (!context) {
    throw new Error("useSongData must be used within a SongProvider");
  }

  return context;
};
