Tasks = new Mongo.Collection('tasks');


if (Meteor.isClient) {

  Meteor.subscribe("tasks");

  Template.body.helpers({
    tasks: function() {
      if(Session.get('hideFinished')) {
        return Tasks.find({checked: {$ne: true}});
      }
      else {
        return Tasks.find();
        }
    },
    hideFinished: function() {
      return Session.get('hideFinished');
    }
  });

  Template.body.events({
    'submit .new-task': function(event) {
      var title = event.target.title.value;

      Meteor.call("addTask", title);

      event.target.title.value = "";

      return false;
    },
    'change .hide-finished': function(event) {
      Session.set('hideFinished', event.target.checked);
    }
  });


  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish("tasks", function() {
    return Tasks.find();
  });
}

Meteor.methods({
  addTask: function(title) {
    Tasks.insert({
        title : title,
        createdAt: new Date(),
        owner: Meteor.userId()
    });
  },
  updateTask: function(id, checked) {
    Tasks.update(id, {$set: {checked: checked}});
  },
  deleteTask: function(id) {
    Tasks.remove(id);
  },
  setPrivate: function(id, private) {
    var res = Tasks.findOne(id)

    if(res.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(id, {$set: {private: private}});
  }
});
