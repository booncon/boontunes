Template.track.helpers({
  isPlaying: function () {
    return Session.get('playing');
  }
});

Template.track.rendered = function () {
  getCover(this.data.album_artist, this.data.album, $(this.find('img')));
};