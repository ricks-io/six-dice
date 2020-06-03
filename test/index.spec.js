import game from "../src/index.js"
import chai from "chai";
const expect = chai.expect;
import chaiInteger from "chai-integer";
chai.use(chaiInteger);

describe("Six dice game", function () {
  describe("roll function", function () {
    describe("Error handling", function () {
      it("Throws an error if no parameter is passed to the function", function () {
        expect(() => game.roll()).to.throw("roll must have one integer argument.")
      })
      it("Throws an error if the argument is not an integer", function () {
        expect(() => game.roll(1.5)).to.throw ("roll must have one integer argument.")
        expect(() => game.roll({})).to.throw  ("roll must have one integer argument.")
        expect(() => game.roll([])).to.throw  ("roll must have one integer argument.")
        expect(() => game.roll(1.01)).to.throw("roll must have one integer argument.")
      })
      it("Throws an error if the argument is less than 1", function () {
        expect(() => game.roll(0)).to.throw("Invalid argument exception, 0 is not a valid number of dice to roll.")
        expect(() => game.roll(-1)).to.throw("Invalid argument exception, -1 is not a valid number of dice to roll.")
      })
      it("Throws an error if the argument is more than the maximum number of dice.", function () {
        expect(() => game.roll(game.maxDie + 1)).to.throw("Invalid argument exception, " + (game.maxDie + 1) + " is not a valid number of dice to roll.")
      })
    })
    it("It returns a roll with length 1", function () {
      let result = game.roll(1);
      expect(result).to.be.an.instanceof(Array);
      expect(result[0]).to.be.an.integer;
      expect(result.length).to.equal(1);
    })
    it("It returns a roll with length 6", function () {
      let result = game.roll(6);
      expect(result).to.be.an.instanceof(Array);
      for (let i = 0; i < 6; i++) {
        expect(result[0]).to.be.an.integer;
      }
      expect(result.length).to.equal(6);
    })
    it("Generates random dice rolls", function(){
      let rolls = {};
      for(let i = 1; i <= game.maxDie; i++){
        rolls[i] = 0;
      }

      let trials = 1000;
      for(let i = 0; i< trials; i++){
        let result = game.roll(game.maxDie);
        for(let j = 0; j < result.length; j++){
          rolls[result[j]]++;
        }
      }
      for(let j = 1; j <= game.maxDie; j++){
        rolls[j]/=(trials*game.maxDie);
      }
      console.log(rolls);      

      let tolerance = .02;
      for(let i = 1; i <= game.maxDie; i++){
        let result = rolls[i];
        let expected = 1/game.maxDie;
        expect(Math.abs(result-expected)).to.be.lt(tolerance);
      }
    })
  })
  describe("score function", function () {
    it("It throw an exception if it is called without any arguments", function(){
      expect(()=>game.score()).to.throw("Score must have one argument of type array.");
    })
    it("It throw an exception if it is called without an array argument", function(){
      expect(()=>game.score(1)).to.throw("Score must have one argument of type array.");
      expect(()=>game.score({a:[]})).to.throw("Score must have one argument of type array.");
      expect(()=>game.score(null)).to.throw("Score must have one argument of type array.");
      expect(()=>game.score(undefined)).to.throw("Score must have one argument of type array.");
    })
    it("It throw an exception if it is called with more than one argument", function(){
      expect(()=>game.score([1,1,1,1,1,1],1)).to.throw("Score must have one argument of type array.");
    })
    it("Scores an empty roll correctly", function(){
      let score = game.score([]);
      expect(score).to.equal(0);
    })
    it("Scores rolls correctly", function () {
      let tests = [
      ["1", 100],
      ["2", 0],
      ["3", 0],
      ["4", 0],
      ["5", 50],
      ["6", 0],
      ["122222", 2100],
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
        expect(givenScore).to.equal(score);
      }
    })
  })
})