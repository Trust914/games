const RPSApp = {};

RPSApp.startGame = false;
RPSApp.maxGamePlay = 3;
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
    RPSApp.mainPage = document.querySelector("main")
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
    RPSApp.playerSelect = document.querySelector("#player-select");
    RPSApp.ScoreStars = {
        player : document.querySelectorAll(".human-score i"),
        computer : document.querySelectorAll(".computer-score i")
    };
    RPSApp.finalResultsContainer = document.querySelector("article");
    RPSApp.finalResultsCard = document.querySelector(".final-results");
    RPSApp.finalResultsText = document.querySelector(".final-results h1");
    RPSApp.finalResultsCloseBtn = document.querySelector(".final-results i");
};


RPSApp.renderPlayerHands = (toShow) => {
    RPSApp.playerSelect.style.display = toShow ? "block" : "none";
    RPSApp.playBtn.style.display = toShow ? "none" : "block";
};

RPSApp.getComputerChoice = () =>{
    const objKeys = Object.keys(RPSApp.gameChoicesImgs); // save the keys of the object into an array
    const randomIndex = Math.floor(Math.random() * objKeys.length); // get random key from array of keys
    const randomChoice = objKeys[randomIndex];//use the random key to get a random choice from the object of choices

    return randomChoice;
};

RPSApp.getChoices = () => {
    return new Promise((resolve) => {// because we need to get result of a clicked hand asynchronously
        RPSApp.playerHandsBtn.forEach(choice => {
            choice.onclick = (e) => {
                e.preventDefault();
                const playerChoice = choice.getAttribute("data-choice"); // preset attributes in html ,i.e., rock, paper, scissors
                const computerChoice = RPSApp.getComputerChoice();
                resolve({ playerChoice , computerChoice }); // export the player and computer choices
            };
        });
    });
};

RPSApp.getWinner = (playerChoice , computerChoice) => {
    if (playerChoice === computerChoice) return "tie";

    if(RPSApp.winningRules[playerChoice] === computerChoice){// e.g., if player chooses rock and computer chooses scissors (winningRules[rock] is scissors from declared winning Rules) then player wins
        return "player";
    }else {
        return "computer"
    }
};

RPSApp.updateWinnerStar = (winner,index,revert) => { 
    if (!revert){
        RPSApp.ScoreStars[winner][index-1].classList.replace('bx-star', 'bxs-star');
    }else {
        RPSApp.ScoreStars[winner][index].classList.replace('bxs-star', 'bx-star');
    }

};

RPSApp.resultsPlaceHolder = (winner, playerChoice, computerChoice) => {
    RPSApp.resultsMessage.textContent = RPSApp.winningMessage[winner];
    if (winner === "player"){
        RPSApp.messageWinner.textContent = `${playerChoice} beats ${computerChoice}`.toUpperCase();
    }else if(winner === "computer"){
        RPSApp.messageWinner.textContent = `${computerChoice} beats ${playerChoice}`.toUpperCase();
    }
    RPSApp.scores[winner] +=1 ;
    RPSApp.updateWinnerStar(winner, RPSApp.scores[winner],false);
};

RPSApp.updateScores = (playerChoice , computerChoice) => {
    const currentPlayWinner = RPSApp.getWinner(playerChoice , computerChoice);
    if (currentPlayWinner === "player" || currentPlayWinner === "computer" ){
        RPSApp.resultsPlaceHolder(currentPlayWinner, playerChoice, computerChoice);
    }else if (currentPlayWinner === "tie"){
        RPSApp.resultsMessage.textContent = "DRAW!!";
    }
};

RPSApp.resetValues = () => {
    RPSApp.resultsMessage.textContent = "CLICK TO PLAY";
    RPSApp.messageWinner.textContent = "";
    RPSApp.computerImg.src = RPSApp.gameChoicesImgs.rock.computer; //update the computer image rockimage and render it on the webpage
    RPSApp.playerImg.src = RPSApp.gameChoicesImgs.rock.player; //update the player image with the rock image and render it on the webpage
    RPSApp.scores.computer = 0;
    RPSApp.scores.player = 0;
    for (let i = 0; i < RPSApp.maxGamePlay; i++){
        RPSApp.updateWinnerStar("player",i,true);
        RPSApp.updateWinnerStar("computer",i,true);
    }
};

RPSApp.showFinalResultsCard = (finalWinner) => {
    RPSApp.mainPage.style.filter = "blur(10px)";
    RPSApp.mainPage.style.pointerEvents = "none";
    RPSApp.finalResultsContainer.style.visibility = "visible";

    if (finalWinner == "player"){
        RPSApp.finalResultsText.textContent = RPSApp.winningMessage[finalWinner];
    }else {
        RPSApp.finalResultsText.textContent = RPSApp.winningMessage.computer;
    }
}

RPSApp.closeFinalResultsCard = () => {
    RPSApp.mainPage.style.filter = "blur(0)";
    RPSApp.mainPage.style.pointerEvents = "auto";
    RPSApp.finalResultsContainer.style.visibility = "hidden";
    RPSApp.resetGame();
}

RPSApp.gameOn = async () => { // this function has to be asynchronous because we have to get a promise from the function getPlayerChoice
    while (RPSApp.startGame) { //as long as player keeps selecting an option (rock,paper or scissors) run the below functionality
        const { playerChoice, computerChoice }= await RPSApp.getChoices();

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

            if (RPSApp.scores.player === RPSApp.maxGamePlay || RPSApp.scores.computer === RPSApp.maxGamePlay) {
                RPSApp.showFinalResultsCard();
                RPSApp.startGame = false;
            }
        }, 1000);
    }
};

RPSApp.resetGame = () => {
    RPSApp.startGame = false;
    RPSApp.renderPlayerHands(false); //hide the hands option for player to select from and show the play button
    RPSApp.resetValues();
};

RPSApp.runGame = () => {
    RPSApp.playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        RPSApp.startGame = true;
        RPSApp.resultsMessage.textContent = "";
        RPSApp.renderPlayerHands(true); //show the hands option for player to select from and hide the play button
        RPSApp.gameOn(); 
    });

    RPSApp.resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        RPSApp.resetGame();
    });

    RPSApp.finalResultsCloseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        RPSApp.closeFinalResultsCard();
    })
};

RPSApp.init = () => {
    RPSApp.targetElements(); //initialise the document objects to interact with
    RPSApp.resetGame();
    RPSApp.runGame();
};

if (document.readyState === 'loading'){//initialise and run the application
    document.addEventListener('DOMContentLoaded', RPSApp.init);
}else {
    RPSApp.init();
}