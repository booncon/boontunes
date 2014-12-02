// makes sure a function is called with a timeout before being called again
delay = (function () {
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

// converts ms into a string with hours, minutes & seconds
convertMS = function (ms) {
  var d, h, m, s;
  s = Math.floor(ms / 1000);
  m = Math.floor(s / 60);
  s = s % 60;
  h = Math.floor(m / 60);
  m = m % 60;
  d = Math.floor(h / 24);
  h = h % 24;
  return { d: d, h: h, m: m, s: s };
};

// fills up a string with trailing 0s
pad = function (num) {
  var s = "0" + num;
  return s.substr(s.length - 2);
};

// show a loading spinner
showLoader = function (state) {
  if (state !== false) {
    $('.loading-spinner').fadeIn();
  } else {
    $('.loading-spinner').fadeOut();
  }
};

// show a browser notification
notify = function(title, body) {
 // check for notification compatibility
 if(!window.Notification) {
    return;
  }
  // if the user has not been asked to grant or deny notifications from this domain
  if(Notification.permission === 'default') {
    Notification.requestPermission(function() {
      // callback this function once a permission level has been set
      notify(Session.get('currentSongName'), Session.get('currentArtistName') + ' – ' + Session.get('currentAlbumName'));
    });
  }
  // if the user has granted permission for this domain to send notifications
  else if(Notification.permission === 'granted') {
    var n = new Notification(
      title,
      {
        'body': body,
        // prevent duplicate notifications
        'tag' : new Date().getTime()
      }
    );
    window.setTimeout(function () {
      n.close();
    }, 4000);
    // remove the notification from Notification Center when it is clicked
    n.onclick = function() {
      this.close();
    };
  }
  // if the user does not want notifications to come from this domain
  else if(Notification.permission === 'denied') {
    // be silent
    return;
  }
};