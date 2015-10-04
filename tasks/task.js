if (Meteor.isClient) {
  Template.task.helpers({
    
  });


  Template.task.events({
    'click .toggle-checked': function() {
      Meteor.call("updateTask", this._id, !this.checked);
    },
    'click .toggle-finished-checked': function() {
      Meteor.call("updateTask", this._id, !this.checked);
    },
    'click .delete': function() {
      Meteor.call("deleteTask", this._id);
    }
  });
}
