import { createContext, useContext, useEffect, useState } from "react";

export const MusicContext = createContext();

const songs = [
  { id: 1, title: "Minefields", artist: "Faouzia & John Legend", url: "/songs/minefields.mp3", duration: "3:10" },
  { id: 2, title: "I Love You", artist: "Amma", url: "/songs/amma-i-love-you.mp3", duration: "2:14" },
  { id: 3, title: "2002", artist: "Anne Marie", url: "/songs/anne-marie-2002.mp3", duration: "3:14" },
  { id: 4, title: "Heaven Baby", artist: "Ayra Starr & ZAYN", url: "/songs/heaven-baby.mp3", duration: "2:38" },
  { id: 5, title: "Happier", artist: "Olivia Rodrigo", url: "/songs/happier.mp3", duration: "2:55" },
  { id: 6, title: "Unethical", artist: "Faouzia", url: "/songs/unethical.mp3", duration: "3:39" },
  { id: 7, title: "Constellations", artist: "Jade LeMac", url: "/songs/constellations.mp3", duration: "3:20" },
  { id: 8, title: "Ordinary", artist: "Alex Warren", url: "/songs/ordinary.mp3", duration: "3:07" },
  { id: 9, title: "Free", artist: "Rumi & Jinu", url: "/songs/free.mp3", duration: "3:07" },
  { id: 10, title: "Rewrite The Stars", artist: "The Greatest Showman", url: "/songs/rewrite-the-stars.mp3", duration: "3:36" },
  { id: 11, title: "Dynasty", artist: "Mia", url: "/songs/mia-dynasty.mp3", duration: "3:47" },
];

export const MusicProvider = ({ children }) => {
  const [allSongs, setAllSongs] = useState(songs);
  const [currentTrack, setCurrentTrack] = useState(songs[0]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const savedPlaylists = localStorage.getItem("musicPlayerPlaylists")
    if (savedPlaylists){
      const playlists = JSON.parse(savedPlaylists)
      setPlaylists(playlists)
    }
  })

  useEffect (() => {
if (playlists.length > 0) {
  localStorage.setItem("musicPlayerPlaylists", JSON.stringify(playlists));
}
  }, [playlists])

  // Click a song in All Songs: switch to it and play (or toggle if it's already current)
  const handlePlaySong = (song, index) => {
    if (currentTrackIndex === index) {
      setIsPlaying((prev) => !prev);
    } else {
      setCurrentTrack(song);
      setCurrentTrackIndex(index);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(true);
    }
  };

  // Click a song in a playlist: load it into the player but stay paused
  const selectSong = (song, index) => {
    if (currentTrackIndex === index) return;
    setCurrentTrack(song);
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => {
      const nextIndex = (prev + 1) % allSongs.length;
      setCurrentTrack(allSongs[nextIndex]);
      return nextIndex;
    });
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => {
      const prevIndex = prev === 0 ? allSongs.length - 1 : prev - 1;
      setCurrentTrack(allSongs[prevIndex]);
      return prevIndex;
    });
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(true);
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === undefined) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const createPlaylist = (name) => {
    const newPlaylist = {
      id: Date.now(),
      name,
      songs: [],
    };
    setPlaylists((prev) => [...prev, newPlaylist]);
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists((prev) => prev.filter((playlist) => playlist.id !== playlistId));
  };

  const addSongToPlaylist = (playlistId, song) => {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id !== playlistId) return playlist;

        // don't add the same song twice
        if (playlist.songs.some((s) => s.id === song.id)) return playlist;

        return { ...playlist, songs: [...playlist.songs, song] };
      })
    );
  };

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);

  return (
    <MusicContext.Provider
      value={{
        allSongs,
        setAllSongs,
        currentTrack,
        currentTrackIndex,
        handlePlaySong,
        selectSong,
        setCurrentTime,
        currentTime,
        formatTime,
        duration,
        setDuration,
        nextTrack,
        prevTrack,
        play,
        pause,
        isPlaying,
        volume,
        setVolume,
        playlists,
        createPlaylist,
        deletePlaylist,
        addSongToPlaylist,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const contextValue = useContext(MusicContext);
  if (!contextValue) {
    throw new Error("useMusic must be used inside of MusicProvider");
  }
  return contextValue;
};