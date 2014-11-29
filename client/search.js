Template.search.helpers({
  results: function () {
    return Session.get("results");
  },
  searchTerm: function () {
    return Session.get("searchTerm");
  }
});

Template.search.events({    
  'click button.btnCloseFancy': function () {
    Router.go('/');
    $('.search-field').val('');
  },
  'keyup .inline-search' : function (e) {
    doSearch($(e.target).val());
  },
});
