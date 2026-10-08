import { useState } from "react";
import { useMusic } from "../contexts/MusicContext";

export const Playlists = () => {
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const {
    playlists,
    createPlaylist,
    deletePlaylist,
    allSongs,
    addSongToPlaylist,
    currentTrack,
    selectSong,
  } = useMusic();

  // Look the playlist up fresh each render so its songs list is never stale
  const selectedPlaylist =
    playlists.find((p) => p.id === selectedPlaylistId) ?? null;

  const filteredSongs = allSongs.filter((song) => {
    const query = searchQuery.toLowerCase();
    const matches =
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query);

    const isAlreadyInPlaylist = selectedPlaylist?.songs?.some(
      (playlistSong) => playlistSong.id === song.id
    );

    return matches && !isAlreadyInPlaylist;
  });

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
    }
  };

  return (
    <div className="playlists">
      <h2>Playlists</h2>

      <div className="create-playlist">
        <h3>Create New Playlist</h3>
        <div className="playlist-form">
          <input
            type="text"
            placeholder="playlist name..."
            className="playlist-input"
            onChange={(e) => setNewPlaylistName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreatePlaylist()}
            value={newPlaylistName}
          />
          <button className="create-btn" onClick={handleCreatePlaylist}>
            Create
          </button>
        </div>
      </div>

      <div className="playlists-list">
        {playlists.length === 0 ? (
          <p className="empty-message">No playlists created yet</p>
        ) : (
          playlists.map((playlist) => (
            <div className="playlist-card playlist-item" key={playlist.id}>
              {/* Row 1: name + Delete */}
              <div className="playlist-header">
                <h3>{playlist.name}</h3>
                <div className="playlist-actions">
                  <button
                    className="delete-playlist-btn"
                    onClick={() => deletePlaylist(playlist.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Row 2: search, on its own row */}
              <div className="song-search">
                <input
                  type="text"
                  placeholder="search songs to add..."
                  value={selectedPlaylistId === playlist.id ? searchQuery : ""}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedPlaylistId(playlist.id);
                    setShowDropdown(e.target.value.length > 0);
                  }}
                  onFocus={() => {
                    setSelectedPlaylistId(playlist.id);
                    setShowDropdown(true);
                  }}
                  className="song-search-input"
                />
                {selectedPlaylistId === playlist.id && showDropdown && (
                  <div className="song-dropdown">
                    {filteredSongs.length === 0 ? (
                      <div className="dropdown-item no-results">No Songs Found</div>
                    ) : (
                      filteredSongs.slice(0, 5).map((song) => (
                        <div
                          key={song.id}
                          className="dropdown-item"
                          onClick={() => {
                            addSongToPlaylist(playlist.id, song);
                            setSearchQuery("");
                            setShowDropdown(false);
                          }}
                        >
                          <span className="song-title">{song.title}</span>
                          <span className="song-artist">{song.artist}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Row 3: songs in the playlist */}
              <div className="playlist-songs">
                {playlist.songs.length === 0 ? (
                  <p className="empty-playlist">No songs in this playlist</p>
                ) : (
                  playlist.songs.map((song) => (
                    <div
                      key={song.id}
                      className={`playlist-song ${
                        currentTrack?.id === song.id ? "active" : ""
                      }`}
                      onClick={() => {
                        const index = allSongs.findIndex((s) => s.id === song.id);
                        if (index !== -1) selectSong(song, index);
                      }}
                    >
                      <div className="song-info">
                        <span className="song-title">{song.title}</span>
                        <span className="song-artist">{song.artist}</span>
                      </div>
                      <span className="song-duration">{song.duration}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};