var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];

var started = false;
var level = 0;
var playerName;
var timeout;
var timeCounter;

// Function to get and format player name
function getPlayerName() {
  playerName = prompt("Enter your name: ");
  playerName =
    playerName.charAt(0).toUpperCase() + playerName.slice(1).toLowerCase();
}

// Function to display game-over alert with player name and level
function gameOverAlert() {
  alert("Game Over, " + playerName + "! Your level was " + level);
  // You can customize the game-over alert as needed
}

$(document).keypress(function () {
  if (!started) {
    getPlayerName(); // Get player name when the game starts
    $("#level-title").text("Level " + level);
    startTimer(30); // Start the timer with 30 seconds
    nextSequence();
    started = true;
  }
});

$(".btn").click(function () {
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);

  checkAnswer(userClickedPattern.length - 1);
});

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      clearTimeout(timeout); // Clear the timeout when the player completes the sequence
      clearInterval(timeCounter); // Clear the timer interval
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    playSound("wrong");
    $("body").addClass("game-over");
    $("body").css("background-color", "#FF0000").fadeOut(100).fadeIn(100); // Change to the color you want
    $("#level-title").text(
      "Game Over, " + playerName + "! Press Any Key to Restart"
    );

    setTimeout(function () {
      $("body").removeClass("game-over");
      $("body").css("background-color", "#011f3f"); // Reset to the original background color
      gameOverAlert();

      // Send data to PHP script
      sendGameData();

      startOver();
    }, 200);
  }
}

function sendGameData() {
  $.ajax({
    type: "GET", //post
    url: "storedata.php",
    data: { playerName: playerName, score: level },
    dataType: "json", // Parse response as JSON
    success: function (response) {
      if (response.status === "success") {
        console.log("Data stored successfully:", response.message);
      } else {
        console.error("Error storing data:", response.message);
      }
    },
    /*error: function (xhr, status, error) {
      console.error("AJAX request error:", status, error);
    },*/ //not to be commented
  });
}

function startTimer(seconds) {
  var timeRemaining = seconds;

  // Update the time counter on the right side
  timeCounter = setInterval(function () {
    $("#time-counter").text("Time: " + timeRemaining + "s");

    if (timeRemaining === 0) {
      playSound("wrong");
      $("body").addClass("game-over");
      $("body").css("background-color", "#FF0000").fadeOut(100).fadeIn(100); // Change to the color you want
      $("#level-title").text(
        "Time's up, " + playerName + "! Press Any Key to Restart"
      );

      clearInterval(timeCounter); // Clear the timer interval
      setTimeout(function () {
        $("body").removeClass("game-over");
        $("body").css("background-color", "#011f3f"); // Reset to the original background color
        gameOverAlert();

        // Send data to PHP script
        sendGameData();

        startOver();
      }, 200);
    } else {
      timeRemaining--;
    }
  }, 1000); // Update every second
}

function nextSequence() {
  clearTimeout(timeout); // Clear the timeout from the previous round
  userClickedPattern = [];
  level++;
  $("#level-title").text("Level " + level);
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  $("#" + randomChosenColour)
    .fadeIn(100)
    .fadeOut(100)
    .fadeIn(100);
  playSound(randomChosenColour);

  // Set a timeout for 30 seconds
  timeout = setTimeout(function () {
    playSound("wrong");
    $("body").addClass("game-over");
    $("body").css("background-color", "#FF0000").fadeOut(100).fadeIn(100); // Change to the color you want
    $("#level-title").text(
      "Time's up, " + playerName + "! Press Any Key to Restart"
    );

    clearInterval(timeCounter); // Clear the timer interval
    setTimeout(function () {
      $("body").removeClass("game-over");
      $("body").css("background-color", "#011f3f"); // Reset to the original background color
      gameOverAlert();

      // Send data to PHP script
      sendGameData();

      startOver();
    }, 200);
  }, 30000); // 30 seconds
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
  $("#time-counter").text(""); // Clear the time counter text
}
