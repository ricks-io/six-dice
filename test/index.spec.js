import game from "../src/index.js"
import chai from "chai";
const expect = chai.expect();

describe("Test Scores", function(){
  it("You should replace this with a real test", function(){
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
      let test = this.tests[i];
      let roll = test[0];
      let score = test[1];
      let rollArr = roll.split("").map(i => parseFloat(i));

      let givenScore = this.score(rollArr);
      expect(givenScore).equal(score);
      
        
    }

  })
})