println("********************************************************")
println("Welcome to Red Light, Green Light Game");
println("Move on Green, Stop on Red");
println("Enjoy the game");
println("********************************************************")
//Stores the data for up to a user defined limit before it is cleared
var tries = [];
var triesLimit = readInt("Enter Maximum Tries(Default 5; Max 75): ");
if(triesLimit < 1){
    triesLimit = 5;
}
else if(triesLimit > 75){
    triesLimit = 75;
}

var wins = 0;
var losses = 0;
var restarts = 0;

//Sets the radius of the player
//Ensures radius has a limit
var radius = readInt("Player icon Size(Limit 50): ");

if(radius > 50){
    radius = 50;
}
else if(radius < 1){
    radius = 1;
}

//The signal global variable
var signal = signalSquare();

//The player global variable
var player = createPlayer(radius);

//Determines if the w key is pressed or not
var isMoving = false;

//Randomizer for the signal
var time = readLine("Difficulty level(Type In Lowercase): Easy, Medium(Default), Hard: ");

if(time.toLowerCase() == "easy"){
    time = Randomizer.nextInt(10000, 12000);
}else if(time.toLowerCase() == "medium"){
    time = Randomizer.nextInt(7000, 9000);
}else if(time.toLowerCase() == "hard"){
    time = Randomizer.nextInt(4000, 6000);
}else{
    time = Randomizer.nextInt(7000, 9000);
}

//Adds the start text and score text
//starts the key detection function
function start(){
    keyDownMethod(keyDown);
    keyUpMethod(keyUp);
    startText();
    scoreText();
}

//Code for detecting key presses
function keyDown(e){
    //If the letter "s" is pressed:
    //Removes all objects on canvas and stops all running timers
    //Adds the background, finish line, signal, and player
    //If the user defined score limit is reached, scores are deleted
    if(e.keyCode == Keyboard.letter('s')){
        if(tries.length < triesLimit){
            removeAll();
            stopTimer(colorSwitch);
            background();
            finishLine();
            signal.setColor(Color.green);
            add(signal);
            add(player);
            setTimer(colorSwitch, time);
            player.setPosition(getWidth()/2, getHeight() - radius);
        }else{
            checkNumberOfTries(triesLimit);
        }
    }

    //When the letter "w" is pressed:
    //Player moves one pixel on the canvas
    //y value is found and if it is less than 50, the game is won
    //Sets isMoving to true
    //If the player moves while signal is red, the player loses the game
    if(e.keyCode == Keyboard.letter('w')){
        player.move(0, -1);
        isMoving = true;
        var y = player.getY();
        if(y < 50){
            wonGame();
        }
        lostGame();
    }

    //If the "r" key is pressed, restart the game
    if(e.keyCode == Keyboard.letter('r')){
        restartGame();
    }

    //If a player presses q, the canvas becomes blank and scores are deleted
    if(e.keyCode == Keyboard.letter("q")){
        removeAll();
        stopTimer(colorSwitch);
        signal.setColor(Color.black);
        restartText();
        wins = 0;
        losses = 0
        restarts = 0;
        tries = [];
    }
    //If t is pressed, all attempts are shown in order
    if(e.keyCode == Keyboard.letter('t')){
        removeAll();
        stopTimer(colorSwitch);
        signal.setColor(Color.black);
        scoreText();
        var xPosition = 25;
        var yPosition = 50;
        if(tries.length > 0){
            for(var i = 0; i < tries.length; i++){
                var triesText = new Text("Play " + (i + 1) + ": " + tries[i], "10pt Arial");
                triesText.setPosition(xPosition, yPosition);
                triesText.setColor(Color.black);
                add(triesText);
                yPosition = yPosition + 15;
                if(yPosition > getHeight() - 60){
                    yPosition = 50;
                    xPosition = xPosition + 125;
                }
            }
            var reenterText = new Text("Press s to Start Again", "20pt Arial");
            reenterText.setPosition(getWidth()/2 - 135, getHeight() - 25);
            reenterText.setColor(Color.black);
            add(reenterText);
        }else{
            var triesText = new Text("No Attempts made", "20pt Arial");
            triesText.setPosition(getWidth()/2 - 120, getHeight()/2 - 50);
            triesText.setColor(Color.black);
            add(triesText);
            restartText();
        }
    }

    //Ensures that the player does not move when you are not playing
    if(signal.color == Color.black){
        player.setPosition(getWidth()/2, getHeight() - radius);
    }
}

//Code for detecting if a key is up
function keyUp(e){
    isMoving = false;
}

//Code for creating the player
function createPlayer(radius){
    player = new Circle(radius);
    player.setPosition(getWidth()/2, getHeight() - radius);
    player.setColor(Color.black);
    return player;
}

//Code for the background image
function background(){
    var background = new WebImage("https://thumbs.dreamstime.com/b/textured-grass-vertical-american-football-field-illustration-eps-file-contains-transparencies-63252174.jpg");
    background.setSize(getWidth(), getHeight());
    background.setPosition(0, 0);
    add(background);
}

//Code for the finish line image
function finishLine(){
    var finishLine = new WebImage("https://static.vecteezy.com/system/resources/thumbnails/002/082/517/small/black-and-white-checkered-header-simple-chessboard-abstract-square-texture-vector.jpg");
    finishLine.setSize(getWidth() - 50, 56);
    finishLine.setPosition(50,0);
    add(finishLine);
}

//Code for the signal
function signalSquare(){
    signal = new Rectangle(50, 56);
    signal.setPosition(0,0);
    signal.setColor(Color.black);
    return signal;
}

//Code for changing the color of the signal
function colorSwitch(){
    if(signal.color == Color.green){
        signal.setColor(Color.red);
    }else{
        signal.setColor(Color.green);
    }
    return signal;
}

//Code for restarting the game
//If the user defined score limit is reached, scores are deleted
function restartGame(){
    if(tries.length < triesLimit){
        removeAll();
        stopTimer(colorSwitch);
        signal.setColor(Color.black);
        tries.push("Restart");
        restarts++;
        restartText();
        scoreText();
    }else{
        checkNumberOfTries(triesLimit);
    }
}

//Code for restart text
function restartText(){
    var restartText = new Text("Press s to Start Again", "20pt Arial");
    restartText.setPosition(getWidth()/2 - 135, getHeight()/2);
    restartText.setColor(Color.black);
    add(restartText);
}

//Code for losing the game
function lostGame(){
    if(signal.color == Color.red){
        setTimeout(isMovingWait, 400);
    }
}

function isMovingWait(){
    if(isMoving == true){
        if(signal.color == Color.red){
            removeAll();
            stopTimer(colorSwitch);
            signal.setColor(Color.black);
            lostText();
            tries.push("Lost");
            losses++;
            scoreText();
        }
    }
}

//Code for losing text
function lostText(){
    var lostText = new Text("You Lost", "20pt Arial");
    lostText.setPosition(getWidth()/2 - 50, getHeight()/2);
    lostText.setColor(Color.black);
    add(lostText);
    var lostText = new Text("Press s to Start Again");
    lostText.setPosition(getWidth()/2 - 130, getHeight()/2 + 50);
    lostText.setColor(Color.black);
    add(lostText);
}

//Code for winning the game
function wonGame(){
    removeAll();
    stopTimer(colorSwitch);
    signal.setColor(Color.black);
    wonText();
    tries.push("Won");
    wins++;
    scoreText();
}

//Code for winning text
function wonText(){
    var wonText = new Text("You Won", "20pt Arial");
    wonText.setPosition(getWidth()/2 - 50, getHeight()/2);
    wonText.setColor(Color.black);
    add(wonText);
    var wonText = new Text("Press s to Start Again");
    wonText.setPosition(getWidth()/2 - 130, getHeight()/2 + 50);
    wonText.setColor(Color.black);
    add(wonText);
}

//If the length of the tries array is greater than
//the user defined limit, all tries data is deleted
function checkNumberOfTries(limit){
    if(tries.length >= limit){
        removeAll();
        stopTimer(colorSwitch);
        signal.setColor(Color.black);
        deletionText();
        for(var i = 0; i <= limit; i++){
            tries.pop();

        }
        wins = 0;
        losses = 0
        restarts = 0;
        scoreText();
    }
}

//Code for scoreText text
function scoreText(){
    var scoreText = new Text("Wins: "+ wins + " Losses: " + losses + " Restarts: " + restarts, "10pt Arial");
    scoreText.setPosition(200, 25);
    scoreText.setColor(Color.black);
    add(scoreText);
    var scoreText = new Text ("Red Light, Green Light Game", "10pt Arial");
    scoreText.setPosition(10, 25);
    scoreText.setColor(Color.black);
    add(scoreText);
}

//Code for the starting screen text
function startText(){
    var startText = new Text("Press s to Start", "20pt Arial");
    startText.setPosition(getWidth()/2 - 100, getHeight()/4 - 50);
    startText.setColor(Color.black);
    add(startText);
    var startText = new Text("Press t to See Results", "20pt Arial");
    startText.setPosition(getWidth()/2 - 140, getHeight()/4);
    startText.setColor(Color.black);
    add(startText);
    var startText = new Text("Press q to Quit", "20pt Arial");
    startText.setPosition(getWidth()/2 - 100, getHeight()/4 + 50);
    startText.setColor(Color.black);
    add(startText);
    var startText = new Text("Press r to Restart", "20pt Arial");
    startText.setPosition(getWidth()/2 - 110, getHeight()/4 + 100);
    startText.setColor(Color.black);
    add(startText);
    var startText = new Text("Press w to Move")
    startText.setPosition(getWidth()/2 - 100, getHeight()/4 + 150);
    startText.setColor(Color.black);
    add(startText);
    var startText = new Text("If You Move On Red,", "20pt Arial");
    startText.setPosition(getWidth()/2 - 120, getHeight()/4 + 200);
    startText.setColor(Color.black);
    add(startText);
    var startText = new Text("You lose", "20pt Arial");
    startText.setPosition(getWidth()/2 - 50, getHeight()/4 + 250);
    startText.setColor(Color.black);
    add(startText);
    var startText = new Text("Every " + triesLimit + " Attempts,", "20pt Arial");
    startText.setPosition(getWidth()/2 - 120, getHeight()/4 + 300);
    startText.setColor(Color.black);
    add(startText);
    var startText = new Text("Your game will restart", "20pt Arial");
    startText.setPosition(getWidth()/2 - 130, getHeight()/4 + 350);
    startText.setColor(Color.black);
    add(startText);
}

//Code for the deletion text
function deletionText(){
    var deletionText = new Text("You Have Played " + triesLimit + " times");
    deletionText.setPosition(25, getHeight()/3 + 50);
    deletionText.setColor(Color.black);
    add(deletionText);
    var deletionText = new Text("Your attempts are now deleted", "20pt Arial");
    deletionText.setPosition(10, getHeight()/3 +100);
    deletionText.setColor(Color.black);
    add(deletionText);
    var deletionText = new Text("Press s to start again");
    deletionText.setPosition(getWidth()/2 - 130, getHeight()/3 + 150);
    deletionText.setColor(Color.black);
    add(deletionText);
}
