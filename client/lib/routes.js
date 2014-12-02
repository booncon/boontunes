// Define routes
Router.route('/', function () {
  this.render('tracklist');
});
Router.route('/search/:_query', function () {
  // this.layout('application');
  // this.render('search', {to: 'overlay', data: {query: this.params._query}});
  this.render('search', {data: {query: this.params._query}});
});
Router.route('/playlists', function () {
  this.render('playlists');
});