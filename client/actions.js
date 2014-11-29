// Template.actions.helpers({
//   playlists: function () {
//     return Session.get('playlists');
//   },
//   playlistSongs: function () {
//     return Session.get('playlistSongs');
//   },
// });

// Template.playlists.rendered = function () {
//   $('.scroll-content').height($(window).height() - $('.navbar-fixed-bottom').height() - $('.scroll-content').offset().top);
// };

Template.playlists.events({    
  'click .actionPlayBtn': function (e) {
    console.log($(e.target).closest('.list-group-item').data('uri'));
    Router.go('/');
    addToPlaylist($(e.target).closest('.list-group-item').data('uri'));
    return false;
  },
});