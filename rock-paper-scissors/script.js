const RPSApp = {}; // main rock paper scissors game app

RPSApp.startGame = false;
RPSApp.maxGamePlay = 3;
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
RPSApp.winningMessage = {
    human : "😎 YOU WIN 😎" , // human wins
    computer : "😔 YOU LOSE 😔"//computer wins
};
RPSApp.finalWinnerMessage = {
    human : ["Congratulations", "WINNNER!"],
    computer : ["OOps", "LOSER!"]
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
    RPSApp.mainPage = document.querySelector("main")
    RPSApp.humanScore = document.querySelector(".human-score");
    RPSApp.computerScore = document.querySelector(".computer-score");
    RPSApp.resultsMessage = document.querySelector("#result-message");
    RPSApp.messageWinner = document.querySelector("#winner-message");
    RPSApp.playBtn = document.querySelector("#play-btn");
    RPSApp.humanImgContainer = document.querySelector("#human-img-container");
    RPSApp.humanImg = document.querySelector("#human-img");
    RPSApp.computerImgContainer = document.querySelector("#computer-img-container");
    RPSApp.computerImg = document.querySelector("#computer-img");
    RPSApp.humanHandsBtn = document.querySelectorAll(".hands-container>div");
    RPSApp.resetBtn = document.querySelector(".reset-score");
    RPSApp.humanSelect = document.querySelector("#human-select");
    RPSApp.scoreStars = {
        human : document.querySelectorAll(".human-score i"),
        computer : document.querySelectorAll(".computer-score i")
    };
    RPSApp.finalResultsContainer = document.querySelector("article");
    RPSApp.finalResultsCard = document.querySelector(".final-results");
    RPSApp.finalResultsText = {
        message : document.querySelector(".final-results h2"),
        winStatus : document.querySelector(".final-results h3")
    };
    RPSApp.finalResultsCloseBtn = document.querySelector(".final-results i");
    RPSApp.playAgainBtn = document.querySelector("#play-again");
};

RPSApp.renderhumanHands = (toShow) => {
    RPSApp.humanSelect.style.display = toShow ? "block" : "none";
    RPSApp.playBtn.style.display = toShow ? "none" : "block";
};

RPSApp.getComputerChoice = () =>{
    const choices = Object.keys(RPSApp.gameChoicesImgs); // save the keys of the gameChoiceImgs object into an array
    const randomIndex = Math.floor(Math.random() * choices.length); // get random index number from array of choices
    const randomChoice = choices[randomIndex];//use the random key to get a random choice from the object of choices

    return randomChoice;
};

RPSApp.getChoices = () => {
    return new Promise((resolve) => {// because we need to get result of a clicked hand asynchronously
        RPSApp.humanHandsBtn.forEach(choice => {
            choice.onclick = (e) => {
                e.preventDefault();
                const humanChoice = choice.getAttribute("data-choice"); // preset attributes in html ,i.e., rock, paper, scissors
                const computerChoice = RPSApp.getComputerChoice();
                resolve({ humanChoice , computerChoice }); // export the human and computer choices
            };
        });
    });
};

RPSApp.setAnimation = (isRocking , humanChoice = null , computerChoice = null) => {
    if (isRocking){
        RPSApp.humanImg.src = RPSApp.gameChoicesImgs.rock.human; //update the human image with the rock image and render it on the webpage
        RPSApp.humanImgContainer.classList.add("human-side"); // add the CSS class with the human shake animation
        RPSApp.computerImg.src = RPSApp.gameChoicesImgs.rock.computer; //update the computer image rockimage and render it on the webpage
        RPSApp.computerImgContainer.classList.add("computer-side"); // add the CSS class with the computer shake animation
        RPSApp.messageWinner.textContent = "";
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
        RPSApp.scoreStars[winner][index-1].classList.replace(RPSApp.starClass.plain, RPSApp.starClass.coloured);
    }else {
        RPSApp.scoreStars[winner][index].classList.replace(RPSApp.starClass.coloured, RPSApp.starClass.plain);
    }
};

RPSApp.displayResults = (winner, humanChoice, computerChoice) => {
    RPSApp.resultsMessage.textContent = RPSApp.winningMessage[winner];
    if (winner === "human"){
        RPSApp.messageWinner.textContent = `${humanChoice} beats ${computerChoice}`.toUpperCase();
    }else if(winner === "computer"){
        RPSApp.messageWinner.textContent = `${computerChoice} beats ${humanChoice}`.toUpperCase();
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

RPSApp.getFinalRoundWinner = () => {
    if (RPSApp.scores.human >= RPSApp.maxGamePlay){
        return "human";
    }
    return "computer"
}

RPSApp.showFinalResultsCard = (finalWinner) => {
    RPSApp.mainPage.style.filter = "blur(5px)";
    RPSApp.mainPage.style.pointerEvents = "none";
    RPSApp.finalResultsContainer.style.visibility = "visible";
    RPSApp.finalResultsText.message.textContent = `${RPSApp.finalWinnerMessage[finalWinner][0]} , you are the`;
    RPSApp.finalResultsText.winStatus.textContent = `${RPSApp.finalWinnerMessage[finalWinner][1]}`;
}

RPSApp.closeFinalResultsCard = (playAgain) => {
    if (playAgain) RPSApp.resetGame();
    RPSApp.mainPage.style.filter = "blur(0)";
    RPSApp.mainPage.style.pointerEvents = "auto";
    RPSApp.finalResultsContainer.style.visibility = "hidden";
    RPSApp.finalResultsText.message.textContent = RPSApp.finalResultsText.winStatus.textContent = "";  
}

RPSApp.resetValues = () => {
    RPSApp.resultsMessage.textContent = "CLICK TO PLAY";
    RPSApp.messageWinner.textContent = "";
    RPSApp.computerImg.src = RPSApp.gameChoicesImgs.rock.computer; //update the computer image rockimage and render it on the webpage
    RPSApp.humanImg.src = RPSApp.gameChoicesImgs.rock.human; //update the human image with the rock image and render it on the webpage
    RPSApp.scores.computer = RPSApp.scores.human = 0;
    Object.keys(RPSApp.scoreStars).forEach(player => {// convert the keys of the scoreStars object to a list and loop through it
        RPSApp.scoreStars[player].forEach((star, index) => RPSApp.updateWinnerStar(player, index, true)); // each star item in the list of stars for each player (recall: each player should have a max of RPSApp.maxgame stars)
    });
};

RPSApp.resetGame = () => {
    RPSApp.startGame = false;
    RPSApp.renderhumanHands(false); //hide the hands option for human to select from and show the play button
    RPSApp.resetValues();
};

RPSApp.gameOn = async () => { // this function has to be asynchronous because we have to get a promise from the function gethumanChoice
    while (RPSApp.startGame) { //as long as human keeps selecting an option (rock,paper or scissors) run the below functionality
        const { humanChoice, computerChoice }= await RPSApp.getChoices();

        RPSApp.resultsMessage.textContent = "ROCKING.....";
        RPSApp.setAnimation(true);

        setTimeout(() => { // this function runs after 1000ms(1s) has elapsed
            RPSApp.setAnimation(false, humanChoice, computerChoice);
            RPSApp.updateScores(humanChoice, computerChoice);

            if (RPSApp.scores.human === RPSApp.maxGamePlay || RPSApp.scores.computer === RPSApp.maxGamePlay) {
                const finalRoundWinner = RPSApp.getFinalRoundWinner();
                RPSApp.showFinalResultsCard(finalRoundWinner);
                RPSApp.startGame = false;
            }
        }, 1000);
    }
};

RPSApp.bindEvents = () => {
    RPSApp.playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        RPSApp.startGame = true;
        RPSApp.resultsMessage.textContent = "";
        RPSApp.renderhumanHands(true); //show the hands option for human to select from and hide the play button
        RPSApp.gameOn(); 
    });

    RPSApp.resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        RPSApp.resetGame();
    });

    RPSApp.finalResultsCloseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        RPSApp.closeFinalResultsCard(false);
    })

    RPSApp.playAgainBtn.addEventListener('click' , (e) => {
        e.preventDefault();
        RPSApp.closeFinalResultsCard(true);
    })
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