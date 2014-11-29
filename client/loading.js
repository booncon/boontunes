Template.loading.helpers({
  online: function () {
    return Session.get('online');
  },
  server: function () {
    return Session.get('MOPIDY_URL');
  }
});