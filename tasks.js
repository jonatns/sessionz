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
      var startTime = event.target.startTime.value;
      var endTime = event.target.endTime.value;

      var ST = startTime.split(':');
      var ET = endTime.split(':');

      var Startseconds = (+startTime[0]) * 60 * 60 * 60 + (+startTime[1]) * 60 * 60;
      var Endseconds = (+endTime[0]) * 60 * 60 * 60 + (+endTime[1]) * 60 * 60;

      var duration = Endseconds - Startseconds;

      Meteor.call("addTask", title, duration);

      event.target.title.value = "";
      event.target.start.value = "";
      event.target.endTime.value = "";

      return false;
    },
    'change .hide-finished': function(event) {
      Session.set('hideFinished', event.target.checked);
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {

    // All values listed below are default
    collectionApi = new CollectionAPI({
      authToken: undefined,              // Require this string to be passed in on each request
      apiPath: 'collectionapi',          // API path prefix
      standAlone: false,                 // Run as a stand-alone HTTP(S) server
      allowCORS: false,                  // Allow CORS (Cross-Origin Resource Sharing)
      sslEnabled: false,                 // Disable/Enable SSL (stand-alone only)
      listenPort: 3005,                  // Port to listen to (stand-alone only)
      listenHost: undefined,             // Host to bind to (stand-alone only)
      privateKeyFile: 'privatekey.pem',  // SSL private key file (only used if SSL is enabled)
      certificateFile: 'certificate.pem' // SSL certificate key file (only used if SSL is enabled)
    });

    // Add the collection Players to the API "/players" path
    collectionApi.addCollection(Tasks, 'tasks', {
      // All values listed below are default
      authToken: undefined,                   // Require this string to be passed in on each request.
      authenticate: undefined, // function(token, method, requestMetadata) {return true/false}; More details can found in [Authenticate Function](#Authenticate-Function).
      methods: ['POST','GET','PUT','DELETE'],  // Allow creating, reading, updating, and deleting
      before: {  // This methods, if defined, will be called before the POST/GET/PUT/DELETE actions are performed on the collection.
                 // If the function returns false the action will be canceled, if you return true the action will take place.
        POST: undefined,    // function(obj, requestMetadata, returnObject) {return true/false;},
        GET: undefined,     // function(objs, requestMetadata, returnObject) {return true/false;},
        PUT: undefined,     // function(obj, newValues, requestMetadata, returnObject) {return true/false;},
        DELETE: undefined   // function(obj, requestMetadata, returnObject) {return true/false;}
      },
      after: {  // This methods, if defined, will be called after the POST/GET/PUT/DELETE actions are performed on the collection.
                // Generally, you don't need this, unless you have global variable to reflect data inside collection.
                // The function doesn't need return value.
        POST: undefined,    // function() {console.log("After POST");},
        GET: undefined,     // function() {console.log("After GET");},
        PUT: undefined,     // function() {console.log("After PUT");},
        DELETE: undefined   // function() {console.log("After DELETE");},
      }
    });

    // Starts the API server
    collectionApi.start();
  });
}

  Meteor.publish("tasks", function() {
    return Tasks.find();
  });

Meteor.methods({
  addTask: function(title, duration) {
    Tasks.insert({
        title : title,
        duration: duration,
        createdAt: new Date()
    });
  },
  updateTask: function(id, checked) {
    Tasks.update(id, {$set: {checked: checked}});
  },
  deleteTask: function(id) {
    Tasks.remove(id);
  }
});
