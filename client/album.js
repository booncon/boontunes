Template.album.rendered = function () {
  getCover(this.data.album_artist, this.data.name, $(this.find('img')), 'large');
};