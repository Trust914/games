const RPSApp = {}; // main rock paper scissors game app

RPSApp.startGame = false;
RPSApp.maxGameRoundsDefault = 3;
RPSApp.gameChoicesImgs = {
    rock : {
        human : "./images/HUMANrock.svg",
        computer : "./images/AIrock.svg"
    },
    paper : {
        human : "./images/HUMANpaper.svg",
        computer : "./images/AIpaper.svg"
    },
    scissors : {
        human : "./images/HUMANscissors.svg",
        computer : "./images/AIscissors.svg"
    }
};
RPSApp.messages = {
    runningWinner : {
        human : "😎 YOU WIN 😎" , // human wins
        computer : "😔 YOU LOSE 😔"//computer wins
    },
    finalWinner : {
        human : ["Congratulations", "WINNNER!"],
        computer : ["OOps", "LOSER!"]
    }
};
RPSApp.winningRules = {
    rock : "scissors",//rock beats scissors
    scissors : "paper", // scissors beats paper
    paper : "rock", // paper beats rock
};
RPSApp.scores = {
    human : 0,
    computer : 0
};
RPSApp.starClass = {
    common: 'bx',
    plain : 'bx-star',
    coloured : 'bxs-star',
};

RPSApp.targetElements = () => {
    RPSApp.mainPage = document.querySelector("main");
    RPSApp.roundSelectionContainer = document.querySelector("#round-selection");
    RPSApp.playerMaxGameRound = document.querySelector("#max-rounds");
    RPSApp.humanScore = document.querySelector(".human-score");
    RPSApp.computerScore = document.querySelector(".computer-score");
    RPSApp.resultsMessage = document.querySelector("#result-message");
    RPSApp.winnerMessage = document.querySelector("#winner-message");
    RPSApp.playBtn = document.querySelector("#play-btn");
    RPSApp.resetBtn = document.querySelector(".reset-score");
    RPSApp.humanHandsBtn = document.querySelectorAll(".hands-container>div");
    RPSApp.humanImgContainer = document.querySelector("#human-img-container");
    RPSApp.humanImg = document.querySelector("#human-img");
    RPSApp.computerImgContainer = document.querySelector("#computer-img-container");
    RPSApp.computerImg = document.querySelector("#computer-img");
    RPSApp.humanSelect = document.querySelector("#human-select");
    RPSApp.scoreStars = {
        human : {
            container : document.querySelector(".human-score"),
            stars : document.querySelectorAll(".human-score i"),
        },
        computer : {
            container : document.querySelector(".computer-score"),
            stars : document.querySelectorAll(".computer-score i")
        }
    };
    RPSApp.finalResults = {
        container : document.querySelector("article"),
        innerCard : document.querySelector(".final-results"),
        message : document.querySelector(".final-results h2"),
        winStatus : document.querySelector(".final-results h3"),
        closeBtn : document.querySelector(".final-results i"),
        playAgainBtn : document.querySelector("#play-again"),
    };
};

RPSApp.updateScoreStars = (maxRounds) => {
    RPSApp.scoreStars.human.container.innerHTML = "";
    RPSApp.scoreStars.computer.container.innerHTML = "";

    for (let i = 0; i < maxRounds; i++) {
        const humanStar = document.createElement("i");
        const computerStar = document.createElement("i");

        humanStar.className = `${RPSApp.starClass.common} ${RPSApp.starClass.plain}`;
        computerStar.className = `${RPSApp.starClass.common} ${RPSApp.starClass.plain}`;

        RPSApp.scoreStars.human.container.appendChild(humanStar);
        RPSApp.scoreStars.computer.container.appendChild(computerStar);
    }

    RPSApp.scoreStars.human.stars = RPSApp.scoreStars.human.container.querySelectorAll("i");
    RPSApp.scoreStars.computer.stars = RPSApp.scoreStars.computer.container.querySelectorAll("i");
};

RPSApp.getMaxRounds = () => {
    let selectedRound = RPSApp.playerMaxGameRound.value;
    if (selectedRound === "Choose"){
      selectedRound = RPSApp.maxGameRoundsDefault;
    }else{
        selectedRound = parseInt(selectedRound);
    }
    return selectedRound;
};

RPSApp.toggleDisplay = (toShow) => {
    RPSApp.humanSelect.style.display = toShow ? "block" : "none";
    RPSApp.playBtn.style.display = toShow ? "none" : "block";
    RPSApp.roundSelectionContainer.style.display = toShow ? "none" : "block";
};

RPSApp.getComputerChoice = () =>{
    const choices = Object.keys(RPSApp.gameChoicesImgs); // save the keys of the gameChoiceImgs object into an array
    const randomIndex = Math.floor(Math.random() * choices.length); // get random index number from array of choices
    const randomChoice = choices[randomIndex];//use the random key to get a random choice from the object of choices

    return randomChoice;
};

RPSApp.setAnimation = (isRocking , humanChoice = null , computerChoice = null) => {
    if (isRocking){
        RPSApp.humanImg.src = RPSApp.gameChoicesImgs.rock.human; //update the human image with the rock image and render it on the webpage
        RPSApp.humanImgContainer.classList.add("human-side"); // add the CSS class with the human shake animation
        RPSApp.computerImg.src = RPSApp.gameChoicesImgs.rock.computer; //update the computer image rockimage and render it on the webpage
        RPSApp.computerImgContainer.classList.add("computer-side"); // add the CSS class with the computer shake animation
        RPSApp.winnerMessage.textContent = "";
    }else {
        RPSApp.humanImg.src = RPSApp.gameChoicesImgs[humanChoice].human; //update the human selection(rock,paper or scissors) with the proper image and render it on the webpage
        RPSApp.humanImgContainer.classList.remove("human-side"); // remove the CSS class with the human shake animation
        RPSApp.computerImg.src = RPSApp.gameChoicesImgs[computerChoice].computer; //update the computer selection(rock,paper or scissors) with the proper image and render it on the webpage
        RPSApp.computerImgContainer.classList.remove("computer-side"); // remove the CSS class with the computer shake animation
    }
};

RPSApp.getWinner = (humanChoice , computerChoice) => {
    if (humanChoice === computerChoice) return "tie";

    if(RPSApp.winningRules[humanChoice] === computerChoice){// e.g., if human chooses rock and computer chooses scissors (winningRules[rock] is scissors from declared winning Rules) then human wins
        return "human";
    }else {
        return "computer"
    }
};

RPSApp.updateWinnerStar = (winner,index,revertAnimation) => { 
    if (!revertAnimation){
        RPSApp.scoreStars[winner].stars[index-1].classList.replace(RPSApp.starClass.plain, RPSApp.starClass.coloured);
    }else {
        RPSApp.scoreStars[winner].stars[index].classList.replace(RPSApp.starClass.coloured, RPSApp.starClass.plain);
    }
};

RPSApp.displayResults = (winner, humanChoice, computerChoice) => {
    RPSApp.resultsMessage.textContent = RPSApp.messages.runningWinner[winner];
    if (winner === "human"){
        RPSApp.winnerMessage.textContent = `${humanChoice} beats ${computerChoice}`.toUpperCase();
    }else if(winner === "computer"){
        RPSApp.winnerMessage.textContent = `${computerChoice} beats ${humanChoice}`.toUpperCase();
    }
    RPSApp.updateWinnerStar(winner, RPSApp.scores[winner],false);
};

RPSApp.updateScores = (humanChoice , computerChoice) => {
    const currentPlayWinner = RPSApp.getWinner(humanChoice , computerChoice);
    if (currentPlayWinner === "human" || currentPlayWinner === "computer" ){
        RPSApp.scores[currentPlayWinner] ++ ;
        RPSApp.displayResults(currentPlayWinner, humanChoice, computerChoice);
    }else if (currentPlayWinner === "tie"){
        RPSApp.resultsMessage.textContent = "DRAW!!";
    }
};

RPSApp.getFinalRoundWinner = (numRounds) => {
    if (RPSApp.scores.human === numRounds){
        return "human";
    }
    return "computer"
};

RPSApp.showFinalResultsCard = (finalWinner) => {
    RPSApp.mainPage.style.filter = "blur(5px)";
    RPSApp.mainPage.style.pointerEvents = "none";
    RPSApp.finalResults.container.style.visibility = "visible";
    RPSApp.finalResults.message.textContent = `${RPSApp.messages.finalWinner[finalWinner][0]} , you are the`;
    RPSApp.finalResults.winStatus.textContent = `${RPSApp.messages.finalWinner[finalWinner][1]}`;
};

RPSApp.closeFinalResultsCard = (playAgain) => {
    if (playAgain) RPSApp.resetGame();
    RPSApp.mainPage.style.filter = "blur(0)";
    RPSApp.mainPage.style.pointerEvents = "auto";
    RPSApp.finalResults.container.style.visibility = "hidden";
    RPSApp.finalResults.message.textContent = RPSApp.finalResults.winStatus.textContent = "";  
};

RPSApp.resetValues = () => {
    RPSApp.resultsMessage.textContent = "CLICK TO PLAY";
    RPSApp.winnerMessage.textContent = "";
    RPSApp.computerImg.src = RPSApp.gameChoicesImgs.rock.computer; //update the computer image rockimage and render it on the webpage
    RPSApp.humanImg.src = RPSApp.gameChoicesImgs.rock.human; //update the human image with the rock image and render it on the webpage
    RPSApp.scores.computer = RPSApp.scores.human = 0;
    RPSApp.playerMaxGameRound.value = "Choose";
    Object.keys(RPSApp.scoreStars).forEach(player => {// convert the keys of the scoreStars object to a list and loop through it
        RPSApp.scoreStars[player].stars.forEach((star, index) => RPSApp.updateWinnerStar(player, index, true)); // each star item in the list of stars for each player (recall: each player should have a max of RPSApp.maxgame stars)
    });
};

RPSApp.resetGame = () => {
    RPSApp.startGame = false;
    RPSApp.toggleDisplay(false); //hide the hands option for human to select from and show the play button
    RPSApp.resetValues();
};


RPSApp.handleUserChoice = (event) =>{ //when a player selects a hand, the game is called
    if (!RPSApp.startGame) return;
    const totalRounds = RPSApp.getMaxRounds();
    const humanChoice = event.currentTarget.getAttribute("data-choice");
    const computerChoice = RPSApp.getComputerChoice();

    RPSApp.resultsMessage.textContent = "ROCKING.....";
    RPSApp.setAnimation(true);

    setTimeout(() => { // this function runs after 1000ms(1s) has elapsed
        RPSApp.setAnimation(false, humanChoice, computerChoice);
        RPSApp.updateScores(humanChoice, computerChoice);

        if (RPSApp.scores.human === totalRounds || RPSApp.scores.computer === totalRounds) {
            const finalRoundWinner = RPSApp.getFinalRoundWinner(totalRounds);
            RPSApp.showFinalResultsCard(finalRoundWinner);
            RPSApp.startGame = false;
        }
    }, 1000);
};

RPSApp.startNewGame = () => {
    RPSApp.startGame = true;
    RPSApp.resultsMessage.textContent = "";
    RPSApp.toggleDisplay(true); //show the hands option for human to select from and hide the play button and round selection
};

RPSApp.bindEvents = () => {
    RPSApp.playerMaxGameRound.addEventListener('change' , (e) => {
        RPSApp.updateScoreStars(RPSApp.getMaxRounds());
    });
    RPSApp.playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        RPSApp.resetGame();
        RPSApp.startNewGame();
    });
    RPSApp.humanHandsBtn.forEach(hand =>
        hand.addEventListener('click' , RPSApp.handleUserChoice)
    );
    RPSApp.resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        RPSApp.resetGame();
    });
    RPSApp.finalResults.closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        RPSApp.closeFinalResultsCard(false);
    });
    RPSApp.finalResults.playAgainBtn.addEventListener('click' , (e) => {
        e.preventDefault();
        RPSApp.closeFinalResultsCard(true);
    });
};

RPSApp.init = () => {
    RPSApp.targetElements(); //initialise the document objects to interact with
    RPSApp.resetGame();
    RPSApp.bindEvents();
};

if (document.readyState === 'loading'){//initialise and run the application
    document.addEventListener('DOMContentLoaded', RPSApp.init);
}else {
    RPSApp.init();
}