var trackMarkerPos;

// fetches the cover from last.fm as an object with different sizes
// optional $image object to assign the cover to, otherwise update current playing cover
getCover = function (artist, album, $image, size) {
  lastfm.album.getInfo({artist: artist, album: album}, {
    success: function (data) {
      var covers = {};
      for (var i = 0; i < data.album.image.length; i++) {
        covers[data.album.image[i]['size']] = data.album.image[i]['#text'] !== '' ? data.album.image[i]['#text'] : '/img/default_cover.png';
      }
      if ($image === undefined) {       
        Session.set('currentAlbumCover', covers);
      } else {
        if (size === undefined) {
          size = 'medium';
        }
        $image.attr('src', covers[size]);
      }
    }
  });
};

// fetches the artist image from last.fm as an object with different sizes
getArtistImage = function (artist, $item, size) {
  lastfm.artist.getInfo({artist: artist}, {
    success: function (data) {
      var images = {};
      for (var i = 0; i < data.artist.image.length; i++) {
        images[data.artist.image[i]['size']] = data.artist.image[i]['#text'] !== '' ? data.artist.image[i]['#text'] : '/img/default_cover.png';
      }
      if (size === undefined) {
        size = 'medium';
      }
      $item.css('background-image', 'url(' + images[size] + ')');      
    }
  });
};

// updates the current play position and the time elapsed / left
updateTrackMarkerPos = function () {
  mopidy.playback.getTimePosition().then(function (position) {
    var taken;
    if (!Session.get('seeking')) {
      progressSlider.slider('setValue', position / Session.get('currentTrackLength') * 100);
      taken = convertMS(position);
      Session.set('currentTimeTaken', taken.h !== 0 ? pad(taken.h) + ':' : '' + pad(taken.m) + ':' + pad(taken.s));
      position = Session.get('currentTrackLength') - position;
      taken = convertMS(position);
      Session.set('currentTimeLeft', taken.h !== 0 ? pad(taken.h) + ':' : '' + pad(taken.m) + ':' + pad(taken.s));    
    }
  });
};

// starts the timer that updates the current play position
startTrackMarkerTimer = function () {
  trackMarkerPos = window.setInterval(updateTrackMarkerPos, 200);
};

// stops the timer that updates the current plat position
stopTrackMarkerTimer = function () {
  window.clearInterval(trackMarkerPos);
};

// seek to the position (% in 0.1) ithin the track
seekTrack = function (pos) {
  mopidy.playback.seek(pos / 100 * Session.get('currentTrackLength')).then(function () {
    Session.set('seeking', false);
  });
};

// update the information on what's currently playing
updateCurrentPlayInformation = function () {
  mopidy.playback.getCurrentTrack().then(function (track) {
    getCover(track.artists[0].name, track.album.name);
    Session.set('currentSongName', track.name);
    Session.set('currentArtistName', track.artists[0].name);
    Session.set('currentAlbumName', track.album.name);
    Session.set('currentTrackLength', track.length);
    Session.set('currentTrackURI', track.uri);
  });
};

// update the current playing state
updatePlaybackState = function () {
  mopidy.playback.getState().then(function (e) {
    var playing = false;
    if (e === 'playing') {
      playing = true;
      startTrackMarkerTimer();
    } else {
      stopTrackMarkerTimer();
    }
    Session.set('playing', playing);
  });
};

// update the current shuffle state
updateShuffleState = function () {
  mopidy.tracklist.getRandom().then(function (e) {
    Session.set('shuffle', e);
  });
};

// update the current repeat state
updateRepeatState = function () {
  mopidy.tracklist.getRepeat().then(function (e) {
    Session.set('repeat', e);
  });
};

// update the current mute state
updateMuteState = function () {
  mopidy.playback.getMute().then(function (e) {
    Session.set('mute', e);    
  });
};

// update the current volume
updateVolumeState = function () {
  mopidy.playback.getVolume().then(function (e) {
    Session.set('volume', e);
    volumeSlider.slider('setValue', Session.get('volume'));
  });
};

addToPlaylist = function (uri) {
  mopidy.tracklist.clear();
  mopidy.tracklist.add(uri).catch(console.error.bind(console)).then(function (tlTracks) {
    // return mopidy.playback.play(tlTracks[0]);
    updateTracklist();
    console.log('playlist loaded');
    console.log(tlTracks);
  });
  
};

// update the current tracklist
updateTracklist = function () {
  mopidy.tracklist.getTlTracks().then(function (data) {
    var tracklist = [];
    for (var i = 0; i < data.length; i++) {
      var track, track_data, album_data, length, artists;
      track_data = data[i].track;
      album_data = track_data.album;
      track = {};
      artists = [];
      $.each(track_data.artists, function(index, el) {
        artists.push(el.name);
      });
      track.artist = artists.join('/ ');
      track.name = track_data.name;
      track.album_artist = album_data.artists[0].name;
      track.album = album_data.name;
      track.uri = track_data.uri;
      track.tid = data[i].tlid;
      length = convertMS(track_data.length);
      track.length = length.h !== 0 ? pad(length.h) + ':' : '' + pad(length.m) + ':' + pad(length.s);
      track.pos = i;
      Session.set('trackModel' + i, data[i]);
      if (Session.get('currentTrackURI') === track.uri) {
        track.isCurrent = true;
      }
      tracklist[i] = track;
    }
    Session.set('tracks', tracklist);
  });
};

updatePlaylists = function () {
  console.log('playlists');
  mopidy.playlists.getPlaylists().then(function (e) {
    Session.set('playlists', e);
  });
};

doSearch = function (query) {
  Session.set("searchTerm", query);
  if (Session.get("searchTerm") !== '') {
    Router.go('/search');
    delay(function () {
      $('.loading-spinner').fadeIn();
      mopidy.library.search({'any': [Session.get("searchTerm")]}).then(function (data) {
        var results = {};
        results.artists = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i].artists !== undefined) {
            for (var j = 0; j < data[i].artists.length; j++) {
              results.artists.push(data[i].artists[j]);
            }
          }
        }
        results.albums = [];
        results.podcasts = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i].albums !== undefined) {
            for (var j = 0; j < data[i].albums.length; j++) {
              var album, artist;
              album = data[i].albums[j];
              if (album.uri.indexOf('podcast:') === 0) {
                results.podcasts.push(album);
              } else {
                artist = album.artists[0].name;
                album.album_artist = artist;
                results.albums.push(album);
              }
            }
          }
        }
        results.tracks = [];
        results.episodes = [];
        results.stations = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i].tracks !== undefined) {
            for (var j = 0; j < data[i].tracks.length; j++) {
              var track, artist, artists, album, length;
              track = data[i].tracks[j];
              album = track.album;
              if (track.uri.indexOf('tunein:station:') === 0) {
                results.stations.push(track);
              } else if (track.uri.indexOf('podcast:') === 0) {
                results.episodes.push(track);
              } else {
                artists = [];
                $.each(track.artists, function(index, el) {
                  artists.push(el.name);
                });
                track.artist = artists.join('/ ');
                track.album_artist = album.artists[0].name;
                track.album = album.name;
                length = convertMS(track.length);
                track.length = length.h !== 0 ? pad(length.h) + ':' : '' + pad(length.m) + ':' + pad(length.s);
                results.tracks.push(track);
              }
            }
          }
        }
        Session.set('results', results);
        $('.loading-spinner').fadeOut();
      });
    }, 1000);
  } else {
    // Session.set('results', []);
  }
};

// updates all the current state
updatePlayerState = function () {
  updatePlaybackState();
  updateShuffleState();
  updateRepeatState();
  updateMuteState();
  updateVolumeState();
  updateCurrentPlayInformation();
};

// react to mopidy events
mopidyEvents = function (mopidy) {
  // connected to mopidy
  mopidy.on('state:online', function () {
    updatePlayerState();
    updateTracklist();
    Session.set('online', true);
    updatePlaylists();
  });

  // disconnected from mopidy
  mopidy.on('state:offline', function () {
    Session.set('online', false);
  });

  // playback has chnaged / play / pause / stop ..
  mopidy.on('event:playbackStateChanged', function (e) {
    updatePlaybackState();
  });

  // playback has started
  mopidy.on('event:trackPlaybackStarted', function (e) {
    updateCurrentPlayInformation();
    updateTracklist();
    updatePlaybackState();
  });

  // volume has changed
  mopidy.on('event:volumeChanged', function (e) {
    updateVolumeState();
  });

  // mute state has changed
  mopidy.on('event:muteChanged', function (e) {
    updateMuteState();
  });

  // shuffle or random has changed
  mopidy.on('event:optionsChanged', function (e) {
    updateShuffleState();
    updateRepeatState();
  });
};