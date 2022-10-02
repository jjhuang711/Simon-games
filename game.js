//Check if jquery is loaded, only during first test
// window.onload = function () {
//   if (window.jQuery) {
//     alert("loaded jQuery");
//   } else {
//     alert("jQuery not loaded");
//   }
// };

//------- Global variables --------------------------------------------------

//Create arrays for button colors available. Will need this to generate random colors based on random number of 0-4.
var buttonColours = ["red", "blue", "green", "yellow"];

//Empty array to keep the random generated game pattern
var gamePattern = [];

//Empty array to keep the user generated pattern
var userClickedPattern = [];

//Variable to store the level of the game
var level = 0;

//Variable to keep start status. Default to false which means not started.
var started = false;

//Variable to store high score
var highScore = 0;

//------- Main functions and flow --------------------------------------------------

//Detect keypress and run this code only if the game is not started (if you press the key when the game is started already, nothing will happen)
$(document).on("keypress", function () {
  if (!started) {
    //Change the h1 to started, change the started status to true, and call the next sequence
    $("h1").text("Let's get started!");
    started = true;
    nextSequence();
  } //Leave empty the else statement because we dont want the keypress event to do anything when the game already started.
});

//Detect a click event on all the .btn class only if the game is already started.
$(".btn").on("click", function () {
  if (started) {
    // For all button clicked, get their id which will be either red, yellow, green or blue and save in userChosen Colour.
    var userClickedColour = this.id; //or var userChosenColour = $(this).attr("id");
    //Push the user clicked color to the userClicked Pattern array, we need this to compare it with game Pattern later.
    userClickedPattern.push(userClickedColour);
    //Play the sound based on the user clicked colour
    playSound(userClickedColour);
    //Animate the button pressed based on the user clicked colour
    animatePress(userClickedColour);

    //Check if the current pressed button is the same with the current index in the gamePattern array
    var currentIndex = userClickedPattern.length - 1;
    checkAnswer(currentIndex);
  } //Leave empty the else statement because we dont want the button click event to do anything when the game is not started.
});

//---------Custom functions -------------------------------------------------------------

//Custom function to check answer (current index)
function checkAnswer(currentIndex) {
  //if user clicked current index is the same with game pattern current index, no need do anything until if all user clicked pattern completed, then go next level.
  //The length of userclicked pattern will keep changing when a button is clicked. We use that -1 as the current index reference earlier.
  //Let say if finish checking, it will go to new sequence after 1s where user clicked pattern will be emptied again so the next time we run this code, it will start checking from 0 again.
  if (gamePattern[currentIndex] === userClickedPattern[currentIndex]) {
    if (gamePattern.length === userClickedPattern.length) {
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    //If user clicked current index is different, straight away alert wrong and start over
    alertWrong();
    startOver();
  }
}

//Custom function to alert wrong clicked button
function alertWrong() {
  //Initialise new Audio object as a variable named wrong. And use play() method to play the audio
  var wrong = new Audio("sounds/wrong.mp3");
  wrong.play();

  //Change the visual/css to the body by adding class and removing it after a timeout of 200ms .
  $("body").addClass("game-over");
  setTimeout(function () {
    $("body").removeClass("game-over");
  }, 200);

  //Change h1 text to "press key to restart"
  $("h1").text("Press anykey to restart");

  //Check if the current level is more than the high score, if yes, then save the new highscore and display it in html
  if (level > highScore) {
    highScore = level;
    $("#high-score").text(level);
  }
}

//Custom function to start over, reset all values to default, game not start, level still 0 and empty pattern
function startOver() {
  started = false;
  level = 0;
  gamePattern = [];
}

//Custom function to go to the next sequence.
function nextSequence() {
  //Whenever we call this function, clear the userclicked pattern so that later on we can start checking from index 0, add the level count, and display new level
  userClickedPattern = [];
  level++;
  $("#level-title").text(level);

  //Create variables to save a random number (0-3) and map it onto the buttonColours array earlier so we can know the "random generated color"
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];

  //Push the random generated color that we got from mapping the random number against the array of colors
  gamePattern.push(randomChosenColour);

  //Play the sound whenver a random chosen color get pushed, and make the corresponding button flash by making fadeout fadein combination.
  playSound(randomChosenColour);
  $("#" + randomChosenColour)
    .fadeOut(100)
    .fadeIn(100)
    .fadeOut(100)
    .fadeIn(100);
}

//Custom function to play sound of the chosen color. Use new Audio to create audio object and play it.
function playSound(chosenColour) {
  var audio = new Audio("sounds/" + chosenColour + ".mp3");
  audio.play();
}

//Custom function to animate or change the css style of a pressed key by adding class to the button and removing it after 100ms.
function animatePress(currentColour) {
  $("#" + currentColour).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}
