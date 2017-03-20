// Using FlightAware API
// Adapted from Example: https://flightaware.com/commercial/flightxml/documentation2.rvt


var username = "rsl320";
var key = "6f9ba43e87bdd0d2eb0db017963574c515bb2dce";

var fxml_url = 'http://' + username + ':' + key + '@flightxml.flightaware.com/json/FlightXML2/';

var outgoingFlights = []; //array to hold outgoing flight data
var index = 0; //keep track of where we are in the array, start at 0

// When the button is clicked, fetch the details about the entered flight ident.
$(document).ready(function() {

   

    //when you click the load next button OR press the spacebar, pull the flight in realtime
    $("#load").click(function(){
     
      var audio = $("#ding")[0];
      audio.play();
        
      loadFlights(1);

    });
    
    //when you click the spacebar, go to the next incoming flight
    $(window).keypress(function(e) {
    if (e.which === 32) {

        loadFlights(1);

    }
});

});

function loadFlights(numFlights) { //make the API request
    
    
    // use ajax to get the arriving flights
    $.ajax({
        type: 'GET',
        url: fxml_url + 'Departed',
        data: { 'airport': 'KJFK', 'howMany': numFlights, 'filter': 'airline', 'offset': 0 },
        success : function(result) {
            if (result.error) { //if there's an error, print the error
                alert('Failed to fetch flight: ' + result.error);
                return;
            }

            // here is where i am actually getting the data from the API, but not doing anything yet
            var flights = result.DepartedResult.departures; //array of objects of incoming flights
            
            for (var i=0; i<flights.length; i++) {
                
//              console.log(flights[i]);
              var destinationCity = flights[i].destinationCity;
              var destinationCode = flights[i].destination; //airport code
              var departureTimeUnix = flights[i].actualdeparturetime;//time of depature

                
             // Create a new JavaScript Date object based on the timestamp
              var date = new Date(departureTimeUnix*1000);

              var hours = date.getHours(); // Hours part from the timestamp
              var minutes = "0" + date.getMinutes(); // Minutes part from the timestamp
              // var seconds = "0" + date.getSeconds(); // Seconds part from the timestamp

              //adding three to the number of minutes to account for delay in the data - maybe want to remove
              // console.log ("minutes: " + minutes);
              minutes = Number(minutes) + 3;
//              console.log ("minutes plus 3: " + minutes);
              minutes = minutes.toString();
                
              //make sure the minutes is 2 digits
              if (minutes.length == 1) {
                  minutes = '0' + minutes;
              }
                
              console.log ("minutes after i made sure it was 2 digits: " + minutes);

              // Will display time in 10:30:23 format, in GMT (greenwich mean time) = EST
              var formattedTime = hours + ':' + minutes.substr(-2);

              // console.log("unix time is: " + arrivalTimeUnix + " while regular time is: " + formattedTime);

              // prints out all the flights arriving in that array we pulled
              console.log("Flight departing to " + destinationCity + " (" + destinationCode + ")" + " at " + formattedTime + ".");
                
              //push the next outgoing flight to an array
              outgoingFlights.push("Next departure from NYC -> " + destinationCity + " (" + destinationCode + ")" + " at " + formattedTime);
            }

            displayFlights(outgoingFlights);


        },
        error: function(data, text) { alert('Failed to fetch flight: ' + data); },
        dataType: 'jsonp',
        jsonp: 'jsonp_callback',
        xhrFields: { withCredentials: true }
    });
    
    
    
}


function displayFlights (array) {

  console.log(array);

  console.log("next departing flight is: " + array[array.length-1]);
  $("#scrollingflight").html(array[array.length-1]);

  // console.log('showing array[0]');

}
