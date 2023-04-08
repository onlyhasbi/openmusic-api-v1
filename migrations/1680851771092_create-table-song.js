/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable("song", {
    id: { type: "VARCHAR(50)", primaryKey: true },
    title: { type: "TEXT", notNull: true },
    year: { type: "SMALLINT" },
    performer: { type: "TEXT", notNull: true },
    genre: { type: "TEXT", notNull: true },
    duration: { type: "SMALLINT" },
    albumId: { type: "VARCHAR(50)" },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("song");
};
