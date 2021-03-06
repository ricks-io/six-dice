/**
 * A function that needs to be described
 */

function clone(obj) {
  if(arguments.length != 1) throw new Error("clone function expects one argument.");
  return JSON.parse(JSON.stringify(obj));
}

export default {
  GAME_STATE_STARTING: 0,
  GAME_STATE_PLAYING: 1,
  GAME_STATE_FINAL_ROLL: 2,
  GAME_STATE_GAME_OVER: 3,
  MAX_SCORE: 10000,
  state: 0,
  sub_state: 5,

  playerWhoTriggerFinalRoll: -1,//Who trigger the final roll?
  dieRoll: [1, 2, 3, 4, 5, 6], //Numbers on each die
  maxDie: 6, //Number of dice in the game
  rollResult: [], //Current dice that have been rolled
  players: 2, //Numbers of players playing
  scores: [], //Listed on current scores
  runningScore: 0,  //The running score for the current player for this turn
  selectedScore: 0, //The score for the selected die
  currentPlayer: 0, //Whose turn is it?
  keptDice: [], //For the current turn, which dice has the player chose to keep
  isAI: false,
  remainingDice: 6,
  isCurrentPlayer(player) {
    if(arguments.length != 1) throw new Error("isCurrentPlayer function expects one argument.");
      return this.currentPlayer == player - 1
  },
  isGameOver() {
    if(arguments.length !=0) throw new Error("isGameOver function expects zero argument.");
    return this.state == this.GAME_STATE_GAME_OVER;
  },
  isGameStarting() {
    if(arguments.length != 0) throw new Error("isGameStarting function expects zero argument.");
    return this.state == this.GAME_STATE_STARTING
  },
  isGamePlayable() {
    if(arguments.length != 0) throw new Error("isGamePlayable function expects one argument.");
    return this.state == this.GAME_STATE_PLAYING || this.state == this.GAME_STATE_FINAL_ROLL;
  },
  isFinalTurn() {
    if(arguments.length != 0) throw new Error("isFinalTurn function expects one argument.");
    return this.state == this.GAME_STATE_FINAL_ROLL;
  },
  //Called by the js
  startTurn() {
    if(arguments.length != 0) throw new Error("startTurn function expects one argument.");
    
    this.runningScore = 0;
    this.selectedScore = 0;
    this.keptDice = [];
    this.rollResult = [];
  },
  //Called by the js
  resetGame() {
    if(arguments.length != 0) throw new Error("resetGame function expects one argument.");
    
    this.player = 0;
    this.resetScores();
    this.state = this.GAME_STATE_STARTING
  },
  startAIGame() {
    if(arguments.length != 0) throw new Error("startAI game function expects one argument.");
    
    this.isAI = true;
    this.state = this.GAME_STATE_PLAYING;
    this.resetScores();
  },
  startGame() {
    if(arguments.length != 0) throw new Error("startGame function expects one argument.");
    
    this.state = this.GAME_STATE_PLAYING;
    this.resetScores();
  },
  restartGame() {
    if(arguments.length != 0) throw new Error("restartGame function expects zero argument.");
    
    this.resetGame();
  },
  //Called by the js
  resetScores() {
    if(arguments.length != 0) throw new Error("resetScores function expects one argument.");
    
    this.scores = [];
    for (let i = 0; i < this.players; i++) this.scores.push(0);
    this.startTurn();
  },
  fakeRoll() {
    if(arguments.length != 0) throw new Error("fakeRoll function expects one argument.");
    this.doRoll(false);
  },
  tempScore() {
    if(arguments.length != 0) throw new Error("tempRoll function expects one argument.");
    
    this.keptDice = [];
    this.runningScore += this.selectedScore;
    this.selectedScore = 0;
  },
  doRoll(lightning) {
    if(arguments.length != 1) throw new Error("doRoll function expects one argument.");
    

    this.rollResult = this.roll(this.remainingDice);

    if (lightning) {
      this.selectScorableDice(false);
    }
  },
  async selectScorableDice(sleep) {
    if(arguments.length != 1) throw new Error("selectScorableDice function expects one argument.");
    
    let desiredIndeces = [];
    for (let i = 0; i < this.rollResult.length; i++) {
      this.selectDie(i);
    }
    for (let i = 0; i < this.rollResult.length; i++) {
      if (this.contributesToScore(i)) {
        desiredIndeces.push(i);
      }
    }
    for (let i = 0; i < this.rollResult.length; i++) {
      this.selectDie(i);
    }
    for (let i = 0; i < desiredIndeces.length; i++) {
      if (sleep)
        await this.sleep(500)
      this.selectDie(desiredIndeces[i])
    }
  },
  preRollTurn() {
    if(arguments.length != 0) throw new Error("preRollTurn  function expects zero argument.");
    this.remainingDice = this.tempRemainingDice();
    this.tempScore();

  },
  //Called by the js
  rollTurn(lightning = false) {
    if(arguments.length > 1) throw new Error("rollTurn function expects zero or one arguments.length.");
    
    //Figure out how many dice to roll
    this.tempScore();
    this.doRoll(lightning);


    if (this.isAI && this.currentPlayer == 1 /*Player 2*/)
      this.takeAITurn();
  },
  //Called by the JS
  isBadLuck() {
    if(arguments.length != 0) throw new Error("clone function expects zero argument.");
    
    if (this.rollResult.length == 0) return false;
    return this.score(this.rollResult) == 0;
  },
  //Called by the User
  endTurnBadLuck() {
    if(arguments.length != 0) throw new Error("endTurnBackLuck function expects zero argument.");
    
    this.endTurn();
  },
  //Called by the User
  endTurnScore() {
    if(arguments.length != 0) throw new Error("endTurnScore function expects zero argument.");
    
    this.runningScore += this.selectedScore;
    this.scores[this.currentPlayer] += this.runningScore;
    if (this.state == this.GAME_STATE_PLAYING && this.scores[this.currentPlayer] >= this.MAX_SCORE) {
      this.state = this.GAME_STATE_FINAL_ROLL;
      this.playerWhoTriggerFinalRoll = this.currentPlayer;
    }
    this.endTurn();
  },
  //Internal
  endTurn() {
    if(arguments.length != 0) throw new Error("endTurn function expects one argument.");
    
    this.runningScore = 0;
    this.selectedScore = 0;
    this.keptDice = [];
    this.rollResult = [];
    this.currentPlayer++;
    this.currentPlayer = this.currentPlayer % this.players;
    if (this.state == this.GAME_STATE_FINAL_ROLL && this.currentPlayer == this.playerWhoTriggerFinalRoll) {
      this.state = this.GAME_STATE_GAME_OVER;
    }
    if (this.isAI && this.currentPlayer == 1 /*Player 2 */) {
      //Then the AI takes it's turn
      this.takeAITurn();
    }

  },
  sleep(ms) {
    if(arguments.length != 1) throw new Error("sseep function expects one argument.");
    
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  canDoAnything() {
    if(arguments.length != 0) throw new Error("canDoAnything function expects zero argument.");
    
    return this.canRoll() || this.shouldEndTurn() || this.isBadLuck();
  },
  async takeAITurn() {
    if(arguments.length != 0) throw new Error("takeAITurn function expects zero argument.");
    
    //if(this.canDoAnything()){
    if (this.isBadLuck()) {
      await this.sleep(1000)
      return this.endTurnBadLuck();

    }
    //We're not in a farkle...yet
    if (this.shouldEndTurn()) {
      await this.sleep(1000)
      return this.endTurnScore();
    }
    if (this.canRoll()) {
      await this.sleep(1000)
      this.rollTurn();

    }
    else {
      this.selectScorableDice(true);

      await this.sleep(1000)
      this.takeAITurn();
    }

    //}

  },
  //Called by the JS
  shouldEndTurn() {
    if(arguments.length != 0) throw new Error("shouldEndTurn function expects zero argument.");
    
    if (this.score(this.getSelected()) > 0) return true;
    return false;
  },
  //Called by the JS
  canRoll() {
    if(arguments.length != 0) throw new Error("canEndTurn function expects zero argument.");
    
    return this.score(this.getSelected()) > 0 || this.rollResult.length == 0;
  },
  //Internal
  getSelected() {
    if(arguments.length != 0) throw new Error("getSelected function expects zero argument.");
    
    let toReturn = [];
    for (let i = 0; i < this.keptDice.length; i++) {
      toReturn.push(this.rollResult[this.keptDice[i]])
    }
    return toReturn;
  },
  //Called by JS
  contributesToScore(index) {
    if(arguments.length != 1) throw new Error("contributesToScore function expects one argument.");
    
    let score = this.score(this.getSelected());
    let tempRollResult = [];
    for (let j = 0; j < this.keptDice.length; j++) {
      if (index != this.keptDice[j]) {
        tempRollResult.push(this.rollResult[this.keptDice[j]]);
      }
    }

    let tempScore = this.score(tempRollResult);
    if (tempScore == score)
      return false;
    return true;
  },
  //Internal
  remainingDie() {
    if(arguments.length != 0) throw new Error("remainingDie function expects zero argument.");
    
    if (this.rollResult.length == 0) return 6;
    //Go through each of the dice to see if it contributes to the final score
    //If not, we can drop it

    let indecesToDrop = [];
    for (let i = 0; i < this.keptDice.length; i++) {
      if (!this.contributesToScore(i)) indecesToDrop.push(i);
    }
    this.keptDice = this.keptDice.filter(k => !indecesToDrop.includes(k));
    return this.rollResult.length - this.keptDice.length;
  },
  //Figure out how many of the die are remaining
  //It's a little tricky because we have to ignore dice that
  //are selected by don't contribute to the score.
  tempRemainingDice() {
    if(arguments.length != 0) throw new Error("tempRemainingDice function expects zero argument.");
    
    let currentRemaining = this.remainingDie();
    if (currentRemaining == 0)
      return 6;
    else return currentRemaining;
  },
  //Called by JS
  isSelected(i) {
    if(arguments.length != 1) throw new Error("isSelected function expects one argument.");
    
    return this.keptDice.includes(i);
  },
  //Called by User
  selectDie(index) {
    if(arguments.length != 1) throw new Error("selectedDie function expects one argument.");
    
    if (this.keptDice.includes(index)) {
      this.keptDice = this.keptDice.filter(x => x != index);
    }
    else {
      this.keptDice.push(index);
    }
    this.selectedScore = this.score(this.getSelected());
  },
  //Internal
  roll(count) {
    if(arguments.length != 1) throw new Error("roll function expects one argument.");
    
    if (count !== 0) //We want to handle 0 as if it were an integer specification.
      //int check from https://stackoverflow.com/a/14636652/10047920
      if (!count || !(count === parseInt(count, 10)) || arguments.length.length > 1) throw new "roll must have one integer argument.";

    let toReturn = [];

    if (!count || count < 1 || count > this.maxDie) throw "Invalid argument exception, " + count + " is not a valid number of dice to roll."

    for (let i = 0; i < count; i++) {
      let randomIndex = Math.floor(Math.random() * this.dieRoll.length);
      let die = this.dieRoll[randomIndex];
      toReturn.push(die);
    }

    return toReturn;
  },
  //Helps us do the recursive scoreing
  helpScore(base, arr, start, stop) {
    if(arguments.length != 4) throw new Error("helpScore function expects four argument.");
    
    let newArray = arr.filter((x, index) => index < start || index > stop);
    if (newArray.length == 0) return base;
    let remainingScore = this.score(newArray);
    return base + remainingScore;
  },
  //Score the array of dice
  score(arr) {
    if(arguments.length != 1) throw new Error("score function expects one argument.");
    

    if (!arr || !Array.isArray(arr) || arguments.length.length > 1) throw new "Score must have one argument of type array.";
    arr = clone(arr).sort();
    if (arr.length == 0) return 0;
    let toReturn = [];

    //Simple 1s and 5s
    let onesAndFives = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == 1) {
        let temp = this.helpScore(100, arr, i, i);
        toReturn.push(temp);
      }
      else if (arr[i] == 5) {
        let temp = this.helpScore(50, arr, i, i);
        toReturn.push(temp);
      }
    }
    toReturn.push(onesAndFives)

    //Look for triples
    for (let i = 1; i <= this.maxDie; i++) {
      if (arr.lastIndexOf(i) - arr.indexOf(i) == 2) {
        if (i == 1) {
          let temp = this.helpScore(300, arr, arr.indexOf(i), arr.lastIndexOf(i));
          toReturn.push(temp);
        }
        else {
          let temp = this.helpScore(i * 100, arr, arr.indexOf(i), arr.lastIndexOf(i));
          toReturn.push(temp);
        }
      }
    }

    //Look for quadruples
    for (let i = 1; i <= this.maxDie; i++) {
      if (arr.lastIndexOf(i) - arr.indexOf(i) == 3) {
        let temp = this.helpScore(1000, arr, arr.indexOf(i), arr.lastIndexOf(i));
        toReturn.push(temp);
      }
    }

    //Look for quintuples
    for (let i = 1; i <= this.maxDie; i++) {
      if (arr.lastIndexOf(i) - arr.indexOf(i) == 4) {
        let temp = this.helpScore(2000, arr, arr.indexOf(i), arr.lastIndexOf(i));
        toReturn.push(temp);
      }
    }

    if (arr.length == 6) {
      //Look for all the same
      if (arr.length == 6 && arr[0] == arr[5]) {
        toReturn.push(3000)
      }

      //Look for straight
      let isStraight = true;
      for (let i = 0; i < 6 && isStraight; i++) {
        if (parseFloat(arr[i]) != 1 + i) isStraight = false;
      }
      if (isStraight) toReturn.push(1500);

      //Look for three pairs
      if ([...new Set(arr)].length == 3 &&
        arr[0] == arr[1] &&
        arr[2] == arr[3] &&
        arr[4] == arr[5]
      )
        toReturn.push(1500);

      //Look for two triples
      if ([...new Set(arr)].length == 2 &&
        arr[0] == arr[2] &&
        arr[3] == arr[5]
      )
        toReturn.push(2500);

      //Look for 4+pair
      if ([...new Set(arr)].length == 2 &&
        (arr[0] == arr[3] &&
          arr[4] == arr[5]) ||
        (arr[0] == arr[1] &&
          arr[2] == arr[5])
      )
        toReturn.push(1500);
    }

    return Math.max(...toReturn);
  },
  getWinners() {
    if(arguments.length != 0) throw new Error("getWinners function expects zero argument.");
    
    let maxScore = Math.max(...this.scores);
    let mappedScores = this.scores.map((s, i) => { return { score: s, index: i + 1 } });
    let winners = mappedScores.filter(i => i.score == maxScore);
    return winners;
  },
  getWinnerText() {
    if(arguments.length != 0) throw new Error("getWinnerText function expects one argument.");
    
    let winners = this.getWinners();
    if (winners.length == 1) {
      return "Player " + (winners[0].index) + " wins";
    }
    else {
      return "It was a tie between players " + (winners.map(i => i.index)).join(", ");
    }
  }

};