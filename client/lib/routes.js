// Define routes
Router.route('/', function () {
  this.render('tracklist');
});
Router.route('/search', function () {
  this.render('search');
});
Router.route('/playlists', function () {
  this.render('playlists');
});