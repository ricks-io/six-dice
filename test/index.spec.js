import game from "../src/index.js"
import chai from "chai";
const expect = chai.expect;

describe("Six dice game", function(){
  describe("Dice rolling", function(){
    it("Throws an error if no parameter is passed to the function", function(){
      expect(()=>game.roll()).to.throw("Invalid argument exception, undefined is not a valid number of dice to roll.")
    })
    it("Throws an error if the argument is less than 1", function(){
      expect(()=>game.roll(0)).to.throw("Invalid argument exception, 0 is not a valid number of dice to roll.")
      expect(()=>game.roll(-1)).to.throw("Invalid argument exception, -1 is not a valid number of dice to roll.")
    })
    it("Throws an error if the argument is more than the maximum number of dice.", function(){
      expect(()=>game.roll(game.maxDie+1)).to.throw("Invalid argument exception, " + (game.maxDie + 1) + " is not a valid number of dice to roll.")
    })
  })
  it("Scores rolls correctly", function(){
    let tests = [["122222", 2100],
    ["123344", 100],
    ["224444", 1500],
    ["222244", 1500],
    ["334466", 1500],
    ["123456", 1500],
    ["333333", 3000],
    ["555556", 2000],
    ["234444", 1000],
    ["111234", 300],
    ["222346", 200],
    ["233346", 300],
    ["234446", 400],
    ["235556", 500],
    ["234666", 600],
    ["111666", 2500]];

    for (let i = 0; i < tests.length; i++) {
      let test = tests[i];
      let roll = test[0];
      let score = test[1];
      let rollArr = roll.split("").map(i => parseFloat(i));

      let givenScore = game.score(rollArr);
      expect(givenScore).equal(score);
      
        
    }

  })
})