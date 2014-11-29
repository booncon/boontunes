Template.tracklist.helpers({
  tracks: function () {
    return Session.get('tracks');
  }
});

Template.tracklist.rendered = function () {
  $('.scroll-content').height($(window).height() - $('.navbar-fixed-bottom').height() - $('.scroll-content').offset().top);
};

Template.tracklist.events({
  'click .track-item': function (e) {
    if ($(e.target).closest('.dropdown-toggle').length <= 0) {
      mopidy.playback.play(Session.get('trackModel' + $('.list-cover', $(e.target).closest('.track-item')).data('pos')));
    }
  },
});