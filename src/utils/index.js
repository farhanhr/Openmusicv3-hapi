const mapDBToModelAlbum = ({
  id,
  name,
  year,
  covers,
}) => ({
  id,
  name,
  year,
  coverUrl: covers,
});

module.exports = { mapDBToModelAlbum };
