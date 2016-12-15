

  // Initialize Firebase

  var config = {
    apiKey: "AIzaSyDIdW4Gt3EQ3_zFfqmhehU79808VUJR1iI",
    authDomain: "train-scheduler-ec803.firebaseapp.com",
    databaseURL: "https://train-scheduler-ec803.firebaseio.com",
    storageBucket: "train-scheduler-ec803.appspot.com",
    messagingSenderId: "673432653132"
  };
  firebase.initializeApp(config);


  // Create a variable to reference the database.
var database = firebase.database();
//var startTime;
		var startTime;
		var trainFrequency;
		var key;
		var train;
		var destination;
		var minutesAway;
		var nextTrain;



$("#submit").on("click", function() {
      var train = $("#trainNameInput").val().trim();
      var destination = $("#destinationInput").val().trim();
      var frequency = $("#frequencyInput").val().trim();
      var startTime = $("#firstTimeInput").val().trim();




      console.log(train);
      console.log(destination);
      console.log(frequency);
      console.log(startTime);


   database.ref().push({
    train: train,
    destination: destination,
    frequency: frequency, 
    startTime: startTime
  	});
	resetForm();


   return false;
});




function calcTime(startTime, trainFrequency){
	//find the next arrival
	var currentTime = moment();
	var currentHours = moment().hour();
	var currentMin = moment().minute(); 
	trainfrequency = parseInt(trainFrequency);
	

	
	var startTimeConverted=moment(startTime, "hh:mm" );
	
   //   console.log(firstTimeConverted);

      var diffTime =parseInt(moment().diff(moment(startTimeConverted), "minutes"));
	var timeRemainder = diffTime % trainFrequency;
      console.log(timeRemainder);
    
    // Minute Until Train
      minutesAway= trainFrequency - timeRemainder;
      console.log("MINUTES TILL TRAIN: " + minutesAway);


    nextTrain = moment().add(minutesAway, "minutes");
     nextTrain =  moment(nextTrain).format("hh:mm");


    
 };
	
function writeTable(minutesAway,  nextTrain, trainFrequency, key, train, destination){
	$("#tableBody").append("<tr><td class='tname'>"+train+"</td><td class='dest'>"+destination+"</td><td class='freq'>"+trainFrequency+"</td><td class='nextk'>"+nextTrain+"</td><td class='away'>"+minutesAway+"</td><td class='trainButton'><button type='button' class='btn btn-default trainDelete' data-key='"+key+"'><i class='fa fa-trash'></i>Delete</button></td></tr>");

	$(".trainDelete").on("click", function(){
		var trainKey=this.dataset.key;
		database.ref(trainKey).set(null);
		var tableRow = this.parentElement.parentElement;
		$(tableRow).remove();
		});



};

$( document ).ready(function() {
database.ref().on("child_added", function(snapshot){
		startTime=snapshot.val().startTime;
		trainFrequency = parseInt(snapshot.val().frequency);
		key=snapshot.key;
		train = snapshot.val().train;
		destination = snapshot.val().destination


		$.when(calcTime(startTime, trainFrequency)).done(writeTable(minutesAway, nextTrain, trainFrequency, key, train, destination));
	}, function(errorObject) {

// If any errors are experienced, log them to console.
      console.log("The read failed: " + errorObject.code);
    });

});

$("#ClearResult").on("click", function() {
	database.ref().set(null);
	$("#tableBody").html("");
});


$("#ClearForm").on("click", resetForm());

//$("#updateTrains").on("click", trainUpdate());

function resetForm(){

	$("#trainNameInput").val('');
	$('#trainNameInput').attr("placeholder", "Train Name");
	$("#destinationInput").val('');
	$('#destinationInput').attr("placeholder", "Destination");
	$("#frequencyInput").val('');
	$('#frequencyInput').attr("placeholder", "Train Frequency");
	$("#firstTimeInput").val('');
	$('#firstTimeInput').attr("placeholder", "Time of First Train");
};


// function trainUpdate(){
// 	        var currentTime = moment();
// 			var currentHours = moment().hour();
// 			var currentMin = moment().minute();

// 	$("#tableBody").find('tr').each(function (i, el) {
//         	var $tds = $(this).find('td'),
//             train = $tds.eq(0).text(),
//             trainFrequency = parseInt($tds.eq(2).text()),

//             //startTime is the next train
//             startTime = $tds.eq(3).text();
//             destination = $tds.eq(1).text();
  
//  			$.when(calcTime(startTime, trainFrequency)).done(writeTable(minutesAway, nextTrain, trainFrequency, key, train, destination));

//         // do something with productId, product, Quantity
//     });



// };