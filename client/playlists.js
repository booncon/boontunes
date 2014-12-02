Template.playlists.helpers({
  playlists: function () {
    return Session.get('playlists');
  },
  playlistSongs: function () {
    return Session.get('playlistSongs');
  },
});

Template.playlists.rendered = function () {
  $('.scroll-content').height($(window).height() - $('.navbar-fixed-bottom').height() - $('.scroll-content').offset().top);
};

Template.playlists.events({    
  'click button.btnCloseFancy': function () {
    Router.go('/');
  },
  'click .playlist-item': function (e) {
    if ($(e.target).closest('.dropdown-toggle').length <= 0) {
      Session.set('playlistSongs', Session.get('playlists')[$(e.target).index()].tracks);
    }
  }
});