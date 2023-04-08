const defaultDataAlbum = ({ id, name, year }) => ({
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
  albumId,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
});

module.exports = { defaultDataAlbum, defaultDataSongs, defaultDataSong };
