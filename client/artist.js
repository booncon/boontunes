Template.artist.rendered = function () {
  getArtistImage(this.data.name, $(this.$('.item-cover')), 'large');
};