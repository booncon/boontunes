 Template.playbar.helpers({
  mute: function () {
    return Session.get('mute');
  },
  shuffle: function () {
    return Session.get('shuffle');
  },
  repeat: function () {
    return Session.get('repeat');
  },
  volume: function () {
    return Session.get('volume');
  },
  playing: function () {
    return Session.get('playing');
  },
});

Template.playbar.rendered = function () {
  volumeSlider = $('#volume-bar').slider({
    tooltip: 'hide',
    handle: 'square',
    orientation: 'vertical',
    reversed: true,
    selection: 'after'
  }).on('slide', function () {
    delay(function () {
      mopidy.playback.setVolume(Math.round($(this).val()));
    }, 200);  
  }).on('slideStop', function () {
    mopidy.playback.setVolume(Math.round($(this).val()));
  });
};

Template.playbar.events({
  'keyup .search-field' : function (e) {
    doSearch($(e.target).val());
  },
  'click button.playBtn': function () {
    $('.playBtn').toggleClass('glyphicon-play glyphicon-pause');
    mopidy.playback.getState().then(function (e) {
      if (e === 'playing') {
        mopidy.playback.pause();
      } else {
        mopidy.playback.resume();
      }
    });
  },
  'mouseenter .volume-wrap': function () {
    $('.volume-bar-wrap').fadeIn(300);
  },
  'mouseleave .volume-wrap': function () {
    delay(function () {
      $('.volume-bar-wrap').fadeOut(300);
    }, 300);  
  },
  'click button.volBtn': function () {
    mopidy.playback.setMute(!Session.get('mute')).then(function () {
      updateMuteState();
    });
  },
  'click button.srcBtn': function () {
    Router.go('/search');
  },
  'click button.plsBtn': function () {
    Router.go('/playlists');
  },
  'click button.rptBtn': function () {
    mopidy.tracklist.setRepeat(!Session.get('repeat')).then(function () {
      updateRepeatState();
    });
  },
  'click button.rndBtn': function () {
    mopidy.tracklist.setRandom(!Session.get('shuffle')).then(function () {
      updateShuffleState();
    });
  },
  'click button.previousBtn': function () {
    mopidy.playback.previous();
  },
  'click button.nextBtn': function () {
    mopidy.playback.next();
  },
  'click button.resizeBtn': function () {
    var pfx = ["webkit", "moz", "ms", "o", ""];
    function RunPrefixMethod(obj, method) {          
      var p = 0, m, t;
      while (p < pfx.length && !obj[m]) {
        m = method;
        if (pfx[p] == "") {
          m = m.substr(0,1).toLowerCase() + m.substr(1);
        }
        m = pfx[p] + m;
        t = typeof obj[m];
        if (t != "undefined") {
          pfx = [pfx[p]];
          return (t == "function" ? obj[m]() : obj[m]);
        }
        p++;
      }
    }
    var e = document.getElementById("fullscreen");  
    if (RunPrefixMethod(document, "FullScreen") || RunPrefixMethod(document, "IsFullScreen")) {
      RunPrefixMethod(document, "CancelFullScreen");
      $('.resizeBtn').toggleClass('glyphicon-resize-full glyphicon-resize-small'); 
    }
    else {
      RunPrefixMethod(e, "RequestFullScreen");
      $('.resizeBtn').toggleClass('glyphicon-resize-full glyphicon-resize-small'); 
    }
  },
});