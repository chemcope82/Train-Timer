//Initialize Firebase
var config = {
    apiKey: "AIzaSyAO5z7sDO7rScf-5GhuDNNIsp7Rw0pVNPg",
    authDomain: "train-timer-9b525.firebaseapp.com",
    databaseURL: "https://train-timer-9b525.firebaseio.com",
    projectId: "train-timer-9b525",
    storageBucket: "",
    messagingSenderId: "656113996506"
  };
  firebase.initializeApp(config);

var db = firebase.database();

$("#submitTrain").on("click", function(event){

    event.preventDefault();

    var trainName = $("#trainName").val();
    var trainDestination = $("#trainDestination").val();
    var firstTrain = $("#firstTrain").val();
    var trainFrequency = $("#trainFrequency").val();

    if (trainName !== "" && trainDestination!== "" && firstTrain !== "" && trainFrequency !== "") {
        db.ref().push({
            trainName: trainName,
            trainDestination: trainDestination,
            firstTrain: firstTrain,
            trainFrequency: trainFrequency,
        });

        $("#trainName").val("");
        $("#trainDestination").val("");
        $("#firstTrain").val("");
        $("#trainFrequency").val("");

    } else {
        alert("All fileds must be completed");
    }
})

db.ref().on("child_added", function(snap){
    //creating html elements to place text into
    var newRow = $("<div class='row'>");
    var newTrainName = $("<div class='col-md-3'>");
    var newTrainDestination = $("<div class='col-md-3'>");
    var newTrainFrequency = $("<div class='col-md-2'>");
    var newNextArrival = $("<div class='col-md-2'>");
    var newMinutesAway = $("<div class='col-md-2'>");
    //creating variables to calculate time until next train
    var firstTrain = snap.val().firstTrain;
    var trainFrequency = parseInt(snap.val().trainFrequency);
    var firstTrainConverted = moment(firstTrain, "HH:mm");
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
    var timeRemainder = diffTime % trainFrequency
    var minutesTilNextTrain;
    var nextTrain;

    if (moment().isAfter(firstTrainConverted)) {
        minutesTilNextTrain = trainFrequency - timeRemainder;
        nextTrain = moment().add(minutesTilNextTrain, "minutes").format("HH:mm");
    } else {
        minutesTilNextTrain = firstTrainConverted.diff(moment(), "minutes");
        nextTrain = firstTrainConverted.format("HH:mm");
    }


    newTrainName.text(snap.val().trainName);
    newTrainDestination.text(snap.val().trainDestination);
    newTrainFrequency.text(snap.val().trainFrequency);
    newNextArrival.text(nextTrain);
    newMinutesAway.text(minutesTilNextTrain);

    newRow.append(newTrainName, newTrainDestination, newTrainFrequency, newNextArrival, newMinutesAway);
    $("#trainList").append(newRow);
})