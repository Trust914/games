const RPSApp = {};

RPSApp.gameChoicesImgs = {
    rock : {
        player : "./images/HUMANrock.svg",
        computer : "./images/AIrock.svg"
    },
    paper : {
        player : "./images/HUMANpaper.svg",
        computer : "./images/AIpaper.svg"
    },
    scissors : {
        player : "./images/HUMANscissors.svg",
        computer : "./images/AIscissors.svg"
    }
};
RPSApp.winningMessage = {
    player : "😎 YOU WIN 😎" , // player wins
    computer : "😔 YOU LOSE 😔"//computer wins
};
RPSApp.winningRules = {
    rock : "scissors",//rock beats scissors
    scissors : "paper", // scissors beats paper
    paper : "rock", // paper beats rock
};
RPSApp.scores = {
    player : 0,
    computer : 0
};

RPSApp.targetElements = () => {
    RPSApp.playerScore = document.querySelector(".human-score");
    RPSApp.computerScore = document.querySelector(".computer-score");
    RPSApp.resultsMessage = document.querySelector("#result-message");
    RPSApp.messageWinner = document.querySelector("#winner-message");
    RPSApp.playBtn = document.querySelector("#play-btn");
    RPSApp.playerImgContainer = document.querySelector("#player-img-container");
    RPSApp.playerImg = document.querySelector("#player-img");
    RPSApp.computerImgContainer = document.querySelector("#computer-img-container");
    RPSApp.computerImg = document.querySelector("#computer-img");
    RPSApp.playerHandsBtn = document.querySelectorAll(".hands-container>div");
    RPSApp.resetBtn = document.querySelector(".reset-score");
    RPSApp.playerSelect = document.querySelector("#player-select")
};

RPSApp.renderPlayerHands = (handsDisplay, playBtnDisplay) => {
    RPSApp.playerSelect.style.display = handsDisplay;
    RPSApp.playBtn.style.display = playBtnDisplay;
};

RPSApp.getComputerChoice = (obj) =>{
    const objKeys = Object.keys(obj); // save the keys of the object into an array
    const randomIndex = Math.floor(Math.random() * objKeys.length); // get random key from array of keys
    const randomChoice = objKeys[randomIndex];//use the random key to get a random choice from the object of choices

    return randomChoice;
};

RPSApp.getPlayerChoice = () => {
    return new Promise((resolve) => {// because we need to get result of a clicked hand asynchronously
        RPSApp.playerHandsBtn.forEach(choice => {
            choice.addEventListener("click", (e) => {
                e.preventDefault();
                const handChoice = choice.getAttribute("data-choice"); // preset attributes in html ,i.e., rock, paper, scissors

                resolve(handChoice); // export the user choice 
            });
        });
    });
};

RPSApp.getWinner = (playerChoice , computerChoice) => {
    if (playerChoice !== undefined && computerChoice !== undefined){
        if (playerChoice === computerChoice){
            return "tie";
        }
    
        if(RPSApp.winningRules[playerChoice] === computerChoice){// e.g., if player chooses rock and computer chooses scissors (winningRules[rock] is scissors from declared winning Rules) then player wins
            return "player";
        }else {
            return "computer"
        }
    }
};

RPSApp.resultsPlaceHolder = (winner, playerChoice, computerChoice) => {
    const winnerScoreVar = `${winner}Score`; //generate the variable used to render the scores on webpage e.g., RPSApp.playerScore ( see in above targetElements function)

    RPSApp.resultsMessage.textContent = RPSApp.winningMessage[winner];
    if (winner === "player"){
        RPSApp.messageWinner.textContent = `${playerChoice.toUpperCase()} BEATS ${computerChoice.toUpperCase()}`;
    }else if(winner === "computer"){
        RPSApp.messageWinner.textContent = `${computerChoice.toUpperCase()} BEATS ${playerChoice.toUpperCase()}`;
    }
    RPSApp.scores[winner] +=1 ;
    RPSApp[winnerScoreVar].textContent = `${RPSApp.scores[winner]}`;

};

RPSApp.updateScores = (playerChoice , computerChoice) => {
    const currentPlayWinner = RPSApp.getWinner(playerChoice , computerChoice);

    if (currentPlayWinner === "player" || currentPlayWinner === "computer" ){
        RPSApp.resultsPlaceHolder(currentPlayWinner, playerChoice, computerChoice);
    }else if (currentPlayWinner === "tie"){
        RPSApp.resultsMessage.textContent = "DRAW!!";
    }else{// reset button is clicked, hence, playerchoice and computerchoice are not defined, then reset scores
        RPSApp.resultsMessage.textContent = "CLICK TO PLAY";
        RPSApp.messageWinner.textContent = "";
        RPSApp.scores.computer = 0;
        RPSApp.computerScore.textContent = `${RPSApp.scores.computer}`;
        RPSApp.scores.player = 0;
        RPSApp.playerScore.textContent = `${RPSApp.scores.player}`;
    }
};

RPSApp.gameOn = async () => { // this function has to be asynchronous because we have to get a promise from the function getPlayerChoice
    while (true) { //as long as player keeps selecting an option (rock,paper or scissors) run the below functionality
        const playerChoice = await RPSApp.getPlayerChoice();
        const computerChoice = RPSApp.getComputerChoice(RPSApp.gameChoicesImgs);

        RPSApp.resultsMessage.textContent = "ROCKING.....";
        RPSApp.playerImg.src = RPSApp.gameChoicesImgs.rock.player; //update the player image with the rock image and render it on the webpage
        RPSApp.playerImgContainer.classList.add("player-side"); // add the CSS class with the player shake animation
        RPSApp.computerImg.src = RPSApp.gameChoicesImgs.rock.computer; //update the computer image rockimage and render it on the webpage
        RPSApp.computerImgContainer.classList.add("computer-side"); // add the CSS class with the computer shake animation
        RPSApp.messageWinner.textContent = "";

        setTimeout(() => { // this function runs after 1000ms(1s) has elapsed
            RPSApp.playerImg.src = RPSApp.gameChoicesImgs[playerChoice].player; //update the player selection(rock,paper or scissors) with the proper image and render it on the webpage
            RPSApp.playerImgContainer.classList.remove("player-side"); // remove the CSS class with the player shake animation
            RPSApp.computerImg.src = RPSApp.gameChoicesImgs[computerChoice].computer; //update the computer selection(rock,paper or scissors) with the proper image and render it on the webpage
            RPSApp.computerImgContainer.classList.remove("computer-side"); // remove the CSS class with the computer shake animation
            RPSApp.updateScores(playerChoice, computerChoice);
        }, 1000);

    }
};

RPSApp.playGame = () => {
    RPSApp.playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        RPSApp.resultsMessage.textContent = "";
        RPSApp.renderPlayerHands("block", "none"); //show the hands option for player to select from and hide the play button
    });
    RPSApp.gameOn(); 
}

RPSApp.resetGame = () => {
    RPSApp.renderPlayerHands("none", "block"); //hide the hands option for player to select from and show the play button
    RPSApp.updateScores(); // basically, reset the scores
};

RPSApp.runGame = () => {
    RPSApp.playGame();

    RPSApp.resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        RPSApp.resetGame();
    });
};

RPSApp.init = () => {
    RPSApp.targetElements(); //initialise the document objects to interact with
    RPSApp.runGame();
};

if (document.readyState === 'loading'){//initialise and run the application
    document.addEventListener('DOMContentLoaded', RPSApp.init);
}else {
    RPSApp.init();
}