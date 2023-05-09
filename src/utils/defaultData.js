const defaultDataAlbums = ({ id, name, year }) => ({
  id,
  name,
  year,
});

const defaultDataSongs = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

const defaultDataSong = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
});

module.exports = {
  defaultDataAlbums,
  defaultDataSongs,
  defaultDataSong,
};
