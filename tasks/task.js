if (Meteor.isClient) {
  Template.task.helpers({
    isOwner: function() {
      return this.owner === Meteor.userId();
    }
  });


  Template.task.events({
    'click .toggle-checked': function() {
      Meteor.call("updateTask", this._id, !this.checked);
    },
    'click .delete': function() {
      Meteor.call("deleteTask", this._id);
    },
    'click .toggle-private': function() {
      Meteor.call("setPrivate", this._id, !this.private);
    }
  });
}
