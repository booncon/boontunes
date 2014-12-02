// create last.fm api object
lastfmCache = new LastFMCache();
lastfm = new LastFM({
  apiKey    : Session.get('API_KEY'),
  apiSecret : Session.get('API_SECRET'),
  cache     : lastfmCache
});

// fetch the mopidy.js script from the modidy server
$.getScript('http://' + Session.get('MOPIDY_URL') + '/mopidy/mopidy.min.js', function () {
  // create a mopidy websocket connection
  mopidy = new Mopidy({
    webSocketUrl: 'ws://' + Session.get('MOPIDY_URL') + ':' + Session.get('MOPIDY_PORT') + '/mopidy/ws/'
  });
  // mopidy.on(console.log.bind(console));  // Log all events
  // console.log(mopidy);
  mopidyEvents(mopidy); // react to mopidy events
});