const RPSApp = {}; // main rock paper scissors game app

RPSApp.startGame = false;
RPSApp.humanClicked = false;
RPSApp.selectedNumRounds = 3;
RPSApp.humanChoice = null;
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
        computer : "😔 COMPUTER WINS 😔"//computer wins
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
    plain : 'bx-star',
    coloured : 'bxs-star',
};

RPSApp.targetElements = () => {
    RPSApp.mainPage = document.querySelector("main");
    RPSApp.roundSelectionContainer = document.querySelector("#round-selection");
    RPSApp.playerMaxGameRound = document.querySelector("#max-rounds");
    RPSApp.resultsMessage = document.querySelector("#result-message");
    RPSApp.winnerMessage = document.querySelector("#winner-message");
    RPSApp.playBtn = document.querySelector("#play-btn");
    RPSApp.resetBtn = document.querySelector(".reset-score");
    RPSApp.humanImgContainer = document.querySelector("#human-img-container");
    RPSApp.humanImg = document.querySelector("#human-img");
    RPSApp.computerImgContainer = document.querySelector("#computer-img-container");
    RPSApp.computerImg = document.querySelector("#computer-img");
    RPSApp.scoreStars = {
        human : {
            container : document.querySelector(".human-score"),
            stars : [],
        },
        computer : {
            container : document.querySelector(".computer-score"),
            stars : []
        }
    };
    RPSApp.finalResults = {
        container : document.querySelector(".modal-dialog"),
        message : document.querySelector(".final-winner-message h2"),
        winStatus : document.querySelector(".final-winner-message h3"),
        closeBtn : document.querySelector(".btn-close"),
        playAgainBtn : document.querySelector("#play-again"),
    };
};

RPSApp.updateScoreStars = () => {
    RPSApp.updateMaxRounds();
    Object.values(RPSApp.scoreStars).forEach((parent) => {
        parent.container.innerHTML = "";
        for (let i = 0; i < RPSApp.selectedNumRounds; i++) {
            const star = document.createElement("i");
            star.className = `bx ${RPSApp.starClass.plain}`;
            parent.container.appendChild(star);
        }
    })
    RPSApp.scoreStars.human.stars = RPSApp.scoreStars.human.container.querySelectorAll("i");
    RPSApp.scoreStars.computer.stars = RPSApp.scoreStars.computer.container.querySelectorAll("i");
};

RPSApp.updateMaxRounds = () => RPSApp.selectedNumRounds =  parseInt(RPSApp.playerMaxGameRound.value);

RPSApp.toggleDisplay = (toShow) => RPSApp.roundSelectionContainer.style.visibility = toShow ? "hidden" : "visible";

RPSApp.getComputerChoice = () =>{
    const choices = Object.keys(RPSApp.gameChoicesImgs); // save the keys of the gameChoiceImgs object into an array
    const randomIndex = Math.floor(Math.random() * choices.length); // get random index number from array of choices
    const randomChoice = choices[randomIndex];//use the random key to get a random choice from the object of choices
    return randomChoice;
};

RPSApp.getHumanChoice = () => {
    const choiceList = Object.keys(RPSApp.gameChoicesImgs);
    const currentChoice = RPSApp.humanImg.getAttribute("data-choice");  
    if (!RPSApp.humanClicked){
        RPSApp.humanChoice = currentChoice;
    }else{
        const currentChoiceIndex = choiceList.indexOf(currentChoice);
        let nextChoiceIndex  = currentChoiceIndex + 1;
        if(nextChoiceIndex > 2){
            nextChoiceIndex = 0;
        }
        const nextChoice = choiceList[nextChoiceIndex];
        RPSApp.humanImg.src = RPSApp.gameChoicesImgs[nextChoice].human;
        RPSApp.humanImg.setAttribute("data-choice", nextChoice);
        RPSApp.humanChoice = nextChoice;
    }
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

RPSApp.updateWinnerStar = (winner,scoreIndex,) => RPSApp.scoreStars[winner].stars[scoreIndex].classList.replace(RPSApp.starClass.plain, RPSApp.starClass.coloured);

RPSApp.displayResults = (winner, humanChoice, computerChoice) => {
    RPSApp.resultsMessage.textContent = RPSApp.messages.runningWinner[winner];
    if (winner === "human"){
        RPSApp.winnerMessage.textContent = `${humanChoice} beats ${computerChoice}`.toUpperCase();
    }else if(winner === "computer"){
        RPSApp.winnerMessage.textContent = `${computerChoice} beats ${humanChoice}`.toUpperCase();
    }
    RPSApp.updateWinnerStar(winner, RPSApp.scores[winner]-1);
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
    return "computer";
};

RPSApp.showFinalResultsCard = (finalWinner) => {
    RPSApp.mainPage.style.filter = "blur(6px)";
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
    RPSApp.updateScoreStars();
    RPSApp.computerImg.src = RPSApp.gameChoicesImgs.rock.computer; //update the computer image rockimage and render it on the webpage
    RPSApp.humanImg.src = RPSApp.gameChoicesImgs.rock.human; //update the human image with the rock image and render it on the webpage
    RPSApp.scores.computer = RPSApp.scores.human = 0;
    RPSApp.playerMaxGameRound.value = "3";
};

RPSApp.resetGame = () => {
    RPSApp.startGame = false;
    RPSApp.playBtn.textContent = "START GAME";
    RPSApp.humanImgContainer.classList.add("disabled");
    RPSApp.toggleDisplay(false); //hide the hands option for human to select from and show the play button
    RPSApp.resetValues();
};

RPSApp.startNewGame = () => {
    RPSApp.startGame = true;
    RPSApp.humanImgContainer.classList.remove("disabled");
    RPSApp.playBtn.textContent = "PLAY";
    RPSApp.resultsMessage.textContent = "CLICK 👈 TO SELECT";
    RPSApp.toggleDisplay(true); //show the hands option for human to select from and hide the play button and round selection
};

RPSApp.handleUserChoice = () =>{
    if (!RPSApp.startGame) return;
    const computerChoice = RPSApp.getComputerChoice();
    RPSApp.resultsMessage.textContent = "ROCKING.....";
    RPSApp.setAnimation(true);

    setTimeout(() => { // this function runs after 1000ms(1s) has elapsed
        RPSApp.setAnimation(false, RPSApp.humanChoice, computerChoice);
        RPSApp.updateScores(RPSApp.humanChoice, computerChoice);

        if (RPSApp.scores.human === RPSApp.selectedNumRounds || RPSApp.scores.computer === RPSApp.selectedNumRounds) {
            const finalRoundWinner = RPSApp.getFinalRoundWinner(RPSApp.selectedNumRounds);
            RPSApp.showFinalResultsCard(finalRoundWinner);
            RPSApp.startGame = false;
        }
    }, 1000);
};

RPSApp.bindEvents = () => {
    RPSApp.playerMaxGameRound.addEventListener('change' , (e) => {
        e.preventDefault();
        RPSApp.updateScoreStars();
    });
    RPSApp.playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (RPSApp.startGame && RPSApp.humanClicked){
            RPSApp.handleUserChoice();
            RPSApp.humanClicked = false
        }else if ((RPSApp.startGame && ( RPSApp.humanChoice === null || RPSApp.humanChoice !== null))){
            RPSApp.getHumanChoice();
            RPSApp.handleUserChoice();
        }
        else{
            RPSApp.resetGame();
            RPSApp.startNewGame();
        }
    });
    RPSApp.humanImg.addEventListener('click' , (e) =>{
        RPSApp.humanClicked = true;
        RPSApp.getHumanChoice();
    });
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
        RPSApp.updateScoreStars();
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