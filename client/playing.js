Template.playing.rendered = function () {
  progressSlider = $('#progress-bar').slider({
    tooltip: 'hide',
    handle: 'square'
  }).on('slide', function () {
    delay(function () {
      seekTrack($(this).val());
    }, 200);  
  }).on('slideStop', function () {
    Session.set('seeking', true);
    seekTrack($(this).val());
  }).on('slideStart', function () {
    Session.set('seeking', true);
  });
};

Template.playing.helpers({
  currentSongName: function () {
    return Session.get('currentSongName');
  },
  currentArtistName: function () {
    return Session.get('currentArtistName');
  },
  currentAlbumName: function () {
    return Session.get('currentAlbumName');
  },
  currentAlbumCover: function () {
    return Session.get('currentAlbumCover');
  },
  currentTimeTaken: function () {
    return Session.get('currentTimeTaken');
  },
  currentTimeLeft: function () {
    return Session.get('currentTimeLeft');
  }
});