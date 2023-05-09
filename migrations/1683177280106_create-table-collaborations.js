/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'playlists',
      referencesConstraintName: 'fk_collaborations.playlist_id:playlists.id',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    user_id: {
      type: 'VARCHAR(50)',
      references: 'users',
      notNull: true,
      referencesConstraintName: 'fk_collaborations.user_id:users.id',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};
