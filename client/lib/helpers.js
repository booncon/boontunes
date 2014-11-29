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