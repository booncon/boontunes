Template.actions.events({    
  'click .actionReplaceQueueBtn': function (e) {
    showLoader();
    addToTracklist($(e.target).closest('.action-item').data('uri'), true);
    Router.go('/');
  },
  'click .actionAddQueueBtn': function (e) {
    showLoader();
    addToTracklist($(e.target).closest('.action-item').data('uri'), false);
  },
});