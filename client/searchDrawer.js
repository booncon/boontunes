Template.searchDrawer.helpers({
  selectedContent: function () {
    return Session.get('selectedContent');
  },
  selectedArtist: function () {
    return Session.get('selectedArtist');
  },
  selectedAlbum: function () {
    return Session.get('selectedAlbum');
  },
  selectedDate: function () {
    return Session.get('selectedDate');
  },
  selectedURI: function () {
    return Session.get('selectedURI');
  },
});

Template.searchDrawer.rendered = function () {
  // $('.drawer').delay(280).slideDown();
};