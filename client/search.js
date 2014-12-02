Template.search.helpers({
  results: function () {
    return Session.get('results');
  },
  searchTerm: function () {
    return Session.get('searchTerm');
  }
});

var expandSearchItem = function (e, data) {
   var topPos, searchEl;
    findNextLineAlbum = function (el, pos) {
      if (el.position().top > pos) {
        return el[0];
      } else {
        if (el.next().length > 0) {
          return findNextLineAlbum(el.next(), pos);
        }
      }
    };
    lookupSelection(data.uri);
    searchEl = $(e.target).closest('.search-block');
    $('.drawer').remove();
    $('.search-block').removeClass('open');
    Session.set('selectedContent', null);
    Session.set('selectedArtist', data.album_artist);
    Session.set('selectedAlbum', data.name);
    Session.set('selectedURI', data.uri);
    if (data.date === 0) {
      data.date = null;
    }
    Session.set('selectedDate', data.date);
    topPos = searchEl.position().top;

    lastEl = findNextLineAlbum(searchEl, topPos);
    searchEl.addClass('open');
    Blaze.render(Template.searchDrawer, searchEl.closest('.search-section')[0], lastEl);
};

Template.search.rendered = function () {
  // doSearch(this.data.query);
};

Template.search.events({    
  'click button.btnCloseFancy': function () {
    Router.go('/');
    $('.search-field').val('');
  },
  'keyup .inline-search' : function (e) {
    doSearch($(e.target).val());
  },
  'click .search-result' : function (e) {
    expandSearchItem(e, this);
    return false;
  }
});
