exports.up = (pgm) => {
  pgm.addColumn('albums', {
    covers: {
      type: 'TEXT',
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('albums', 'covers');
};
