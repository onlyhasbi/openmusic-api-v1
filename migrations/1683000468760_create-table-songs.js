/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    title: { type: 'TEXT', notNull: true },
    year: { type: 'SMALLINT' },
    performer: { type: 'TEXT', notNull: true },
    genre: { type: 'TEXT', notNull: true },
    duration: { type: 'SMALLINT' },
    album_id: {
      type: 'VARCHAR(50)',
      references: 'albums',
      referencesContraintName: 'fk_songs.album_id:albums.id',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
