/**
 * A function that needs to be described
 */

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}


export default {
  dieRoll: [1, 2, 3, 4, 5, 6],
  maxDie: 6,
  rollResult: [],
  players: 2,
  scores: [],
  runningScore: 0,
  selectedScore: 0,
  currentPlayer: 0,
  keptDice: [],
  startTurn() {
    this.runningScore = 0;
    this.selectedScore = 0;
    this.keptDice = [];
    this.rollResult = [];
  },
  resetGame() {
    this.player = 0;
    this.resetScores();
  },
  resetScores() {
    this.scores = [];
    for (let i = 0; i < this.players; i++) this.scores.push(0);
    this.startTurn();
  },
  rollTurn() {
    let tempToRoll = this.tempRemainingDice();
    this.keptDice = [];
    this.runningScore += this.selectedScore;
    this.selectedScore = 0;

    this.rollResult = this.roll(tempToRoll);
  },
  isBadLuck() {
    if (this.rollResult.length == 0) return false;
    let arrCopy = clone(this.rollResult);
    return arrCopy.length != 0 && this.score(arrCopy.sort()) == 0;
  },
  endTurnBadLuck() {
    this.endTurn();
  },
  endTurnScore() {
    this.runningScore += this.selectedScore;
    this.scores[this.currentPlayer] += this.runningScore;
    this.endTurn();
  },
  endTurn() {
    this.runningScore = 0;
    this.selectedScore = 0;
    this.keptDice = [];
    this.rollResult = [];
    this.currentPlayer++;
    this.currentPlayer = this.currentPlayer % this.players;
  },
  shouldEndTurn() {
    if (this.rollResult.length == 0 || this.keptDice.length == 0) return false;
    return true;
  },
  canRoll() {
    let anySelected = this.rollResult.length != 0 && this.keptDice.length == 0;
    return this.score(this.getSelected()) > 0 || this.rollResult.length == 0;
  },
  getSelected() {
    let toReturn = [];
    for (let i = 0; i < this.keptDice.length; i++) {
      toReturn.push(this.rollResult[this.keptDice[i]])
    }
    toReturn.sort();
    return toReturn;
  },
  contributesToScore(index) {
    let score = this.score(this.getSelected());
    let tempRollResult = [];
    for (let j = 0; j < this.keptDice.length; j++) {
      if (index != this.keptDice[j]) {
        tempRollResult.push(this.rollResult[this.keptDice[j]]);
      }
    }
    tempRollResult = tempRollResult.sort();
    let tempScore = this.score(tempRollResult);
    if (tempScore == score)
      return false;
    return true;
  },
  remainingDie() {
    if (this.rollResult.length == 0) return 6;
    //Go through each of the dice to see if it contributes to the final score
    //If not, we can drop it
    let score = this.score(this.getSelected());
    let indecesToDrop = [];
    for (let i = 0; i < this.keptDice.length; i++) {
      let tempRollResult = [];
      for (let j = 0; j < this.keptDice.length; j++) {
        if (i != j) {
          tempRollResult.push(this.rollResult[this.keptDice[j]]);
        }
      }
      tempRollResult = tempRollResult.sort();
      let tempScore = this.score(tempRollResult);
      if (tempScore == score)
        indecesToDrop.push(i);
    }
    this.keptDice = this.keptDice.filter(k => !indecesToDrop.includes(k));
    return this.rollResult.length - this.keptDice.length;
  },
  tempRemainingDice() {
    let currentRemaining = this.remainingDie();
    if (currentRemaining == 0)
      return 6;
    else return currentRemaining;
  },
  isSelected(i) {
    return this.keptDice.includes(i);
  },
  selectDie(index) {
    if (this.keptDice.includes(index)) {
      this.keptDice = this.keptDice.filter(x => x != index);
    }
    else {
      this.keptDice.push(index);
    }
    this.selectedScore = this.score(this.getSelected());
  },
  preRollPhrase() {
    if (this.rollResult.length == 0) {
      return "";
    }
    else {
      return `+${this.selectedScore} & `;
    }
  },
  roll: function (count) {
    if (count !== 0) //We want to handle 0 as if it were an integer specification.
      //int check from https://stackoverflow.com/a/14636652/10047920
      if (!count || !(count === parseInt(count, 10)) || arguments.length > 1) throw new "roll must have one integer argument.";

    let toReturn = [];

    if (!count || count < 1 || count > this.maxDie) throw "Invalid argument exception, " + count + " is not a valid number of dice to roll."

    for (let i = 0; i < count; i++) {
      let randomIndex = Math.floor(Math.random() * this.dieRoll.length);
      let die = this.dieRoll[randomIndex];
      toReturn.push(die);
    }

    return toReturn;
  },
  helpScore: function (base, arr, start, stop) {
    let newArray = arr.filter((x, index) => index < start || index > stop);
    if (newArray.length == 0) return base;
    let remainingScore = this.score(newArray);
    return base + remainingScore;
  },
  isScorable: function (index, dice) {
    if (dice[index] == 1) return true;
    if (dice[index] == 5) return true;
    //We know the number of the die at the index is a 2,3,4, or 6
    if (dice.length < 3) return false;
    //We have a total of 3, 4, 5, or 6 dice left



  },
  score: function (arr) {

    if (!arr || !Array.isArray(arr) || arguments.length > 1) throw new "Score must have one argument of type array.";
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
    for (let i = 1; i <= 6; i++) {
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
    for (let i = 1; i <= 6; i++) {
      if (arr.lastIndexOf(i) - arr.indexOf(i) == 3) {
        let temp = this.helpScore(1000, arr, arr.indexOf(i), arr.lastIndexOf(i));
        toReturn.push(temp);
      }
    }

    //Look for quintuples
    for (let i = 1; i <= 6; i++) {
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
  }
};