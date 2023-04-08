/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable("album", {
    id: { type: "VARCHAR(50)", primaryKey: true },
    name: { type: "TEXT", notNull: true },
    year: { type: "SMALLINT" },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("album");
};
