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
  song: Song | null;
  songs: Song[];
  albums: Album[];
  isPlaying: boolean;
  loading: boolean;
  selectedSong: string | null;
  setIsPlaying: (value: boolean) => void;
  setSelectedSong: (value: string) => void;
  fetchSingleSong: () => Promise<void>;
  nextSong: () => void;
  prevSong: () => void;
}

const SongContext = createContext<SongContextType | undefined>(undefined);

interface SongProviderProps {
  children: ReactNode;
}

export const SongProvider: React.FC<SongProviderProps> = ({ children }) => {
  const [song, setSong] = useState<Song | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);

  const fetchSingleSong = useCallback(async () => {
    if (!selectedSong) return;

    try {
      const { data } = await axios.get<Song>(
        `${server}/api/v1/song/${selectedSong}`
      );
      setSong(data);
    } catch (error) {
      console.error(error);
    }
  }, [selectedSong]);

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
    setLoading(true);

    try {
      const { data } = await axios.get<Album[]>(`${server}/api/v1/album/all`);
      setAlbums(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const nextSong = useCallback(() => {
    if (index === songs.length - 1) {
      setIndex(0);
      setSelectedSong(songs[0]?.id.toString());
    } else {
      setIndex((prevIndex) => prevIndex + 1);
      setSelectedSong(songs[index + 1]?.id.toString());
    }
  }, [index, songs]);

  const prevSong = useCallback(() => {
    if (index > 0) {
      setIndex((prevIndex) => prevIndex - 1);
      setSelectedSong(songs[index - 1]?.id.toString());
    }
  }, [index, songs]);

  useEffect(() => {
    fetchSongs();
    fetchAlbums();
  }, []);

  const value = {
    song,
    songs,
    albums,
    isPlaying,
    loading,
    selectedSong,
    setIsPlaying,
    setSelectedSong,
    fetchSingleSong,
    nextSong,
    prevSong,
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
