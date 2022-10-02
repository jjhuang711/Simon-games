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
    playSound(userClickedColour);
    animatePress(userClickedColour);

    var currentIndex = userClickedPattern.length - 1;
    checkAnswer(currentIndex);
  } //Leave empty the else statement because we dont want the button click event to do anything when the game is not started.
});

function checkAnswer(currentIndex) {
  if (gamePattern[currentIndex] === userClickedPattern[currentIndex]) {
    console.log("success");

    if (gamePattern.length === userClickedPattern.length) {
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    alertWrong();
    startOver();
  }
}

function alertWrong() {
  var wrong = new Audio("sounds/wrong.mp3");
  wrong.play();
  $("body").addClass("game-over");
  setTimeout(function () {
    $("body").removeClass("game-over");
  }, 200);
  $("h1").text("Press anykey to restart");

  if (level > highScore) {
    highScore = level;
    $("#high-score").text(level);
  }
}

function startOver() {
  started = false;
  level = 0;
  gamePattern = [];
}

function nextSequence() {
  userClickedPattern = [];
  level++;
  $("#level-title").text(level);

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  playSound(randomChosenColour);

  $("#" + randomChosenColour)
    .fadeOut(100)
    .fadeIn(100)
    .fadeOut(100)
    .fadeIn(100);
}

function playSound(chosenColour) {
  var audio = new Audio("sounds/" + chosenColour + ".mp3");
  audio.play();
}

function animatePress(currentColour) {
  $("#" + currentColour).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}
