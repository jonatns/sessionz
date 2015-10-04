if (Meteor.isClient) {
  Template.selector.helpers({

        });
  Template.selector.events({
    'change #day': function (event) {
      Meteor.call("selectDay", $(event.currentTarget).val());
    }
  });
}

Meteor.methods({
  selectDay: function(day){

    if(day === "Monday")
      var dayString = "05";
    else if(day === "Tuesday")
      var dayString = "06";
    else if(day === "Wednesday")
      var dayString = "07";
    else if(day === "Thursday")
      var dayString = "08";
    else if(day === "Friday")
      var dayString = "09";
    else if(day === "Saturday")
      var dayString = "10";
    else {
      var dayString = "04";
    }

    var dayString = "2015-10-" + dayString;

    $('.myCalendars').fullCalendar( 'gotoDate', dayString);
  }
});
