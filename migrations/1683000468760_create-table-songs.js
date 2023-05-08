/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    title: { type: 'TEXT', notNull: true },
    year: { type: 'SMALLINT' },
    performer: { type: 'TEXT', notNull: true },
    genre: { type: 'TEXT', notNull: true },
    duration: { type: 'SMALLINT' },
    albumId: { type: 'VARCHAR(50)' },
  });

  pgm.addConstraint(
    'songs',
    'fk_songs.album_id_albums.id',
    "FOREIGN KEY('albumId') REFERENCES albums(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_songs.album_id_albums.id');
  pgm.dropTable('songs');
};
