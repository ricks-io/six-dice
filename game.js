let Scenes = {
  startScene: "StartScene",
  allScenes: [
    {
      name: "StartScene",
      objects: [
        {
          def: "Canvas",
          children:
            [
              {
                def: "Player1Text, 10, 50, Text",
                componentValues: ["TextComponent|text|1"],
                components: ["RectTransform|anchorHorizontal|left", "RectTransform|anchorVertical|top"]
              },
              {
                def: "Player1Points, 10, 100, Text",
                componentValues: ["TextComponent|text|0"],
                components: ["RectTransform|anchorHorizontal|left", "RectTransform|anchorVertical|top"]
              },
              {
                def: "Player2Text, -110, 50, Text",
                componentValues: ["TextComponent|text|2"],
                components: ["RectTransform|anchorHorizontal|right", "RectTransform|anchorVertical|top"]

              },
              {
                def: "Player2Pointes, -110, 100, Text",
                componentValues: ["TextComponent|text|0"],
                components: ["RectTransform|anchorHorizontal|right", "RectTransform|anchorVertical|top"]

              },
              {
                def: "RollButton, 0, 0, Rectangle",
                components: ["RectTransform|anchorHorizontal|center|anchorVertical|middle"],
                children: [
                  {
                    def: "RollButtonText,Text",
                    componentValues: ["TextComponent|text|Roll"],

                  }
                ]
              },
              {
                def: "KeepButton, 0, 100, Rectangle",
                components: ["RectTransform|anchorHorizontal|center|anchorVertical|middle"],
                children: [
                  {
                    def: "RollButtonText,Text",
                    componentValues: ["TextComponent|text|Keep"],

                  }
                ]
              },
              {
                def: "BadLuckButton, 0, 200, Rectangle",
                components: ["RectTransform|anchorHorizontal|center|anchorVertical|middle"],
                children: [
                  {
                    def: "RollButtonText,Text",
                    componentValues: ["TextComponent|text|Bad Luck"],

                  }
                ]
              },
              {
                def: "Master,EmptyGameObject",
                components: ["MasterBehavior"]
              }
            ]
        },

        {
          def: "Circle",
          componentValues: ["CircleComponent|radius| 1", "CircleComponent|fill|black"],
          components: ["BallBehavior"]
        },
        {
          def: "Paddle, 0, 10, .05, .01, Rectangle",
          componentValues: ["RectangleComponent|fill|orange"],
          components: ["MovementBehavior"]
        },
        { def: "RectangleLeft, -10, 0, .01, .2, Rectangle", },
        { def: "RectangleRight, 10, 0, .01, .2, Rectangle", },
        { def: "RectangleTop, 0, -10, .2, .01, Rectangle", },
        { def: "Camera, 0, 0, 1, 1, Camera", },
      ]
    }
  ]
}

let prefabs = {
  name: "Die",
  components: ["Rectangle"],
  children: [
    {
      name: "CircleA,Circle",
      componentValues: ["CircleComponent|radius|.1"]
    },
    {
      name: "CircleB,Circle",
      componentValues: ["CircleComponent|radius|.1"]
    },
    {
      name: "CircleC,Circle",
      componentValues: ["CircleComponent|radius|.1"]
    },
    {
      name: "CircleD,Circle",
      componentValues: ["CircleComponent|radius|.1"]
    },
    {
      name: "CircleE,Circle",
      componentValues: ["CircleComponent|radius|.1"]
    },
    {
      name: "CircleF,Circle",
      componentValues: ["CircleComponent|radius|.1"]
    },
    {
      name: "G,Circle",
      componentValues: ["CircleComponent|radius|.1"]
    },
  ]
}


let GameBehaviors = {
  MasterBehavior: class MasterBehavior extends Base.Behavior {
    start() {
      Base.SceneManager.instantiate("Die", new Base.Point(200, 200), new Base.Point(1, 1), 0);
    }
    update() {

    }
  },
  MovementBehavior: class MovementBehavior extends Base.Behavior {
    start() {
      this.speed = .5;
    }
    update() {
      this.camera = Base.SceneManager.currentScene.findByName("Camera");
      if (Base.Input.keys['ArrowLeft']) { this.gameObject.x -= +this.speed }
      if (Base.Input.keys['ArrowRight']) { this.gameObject.x += +this.speed }
      this.gameObject.x += Base.Input.getTouchMove()[0].x / this.camera.scaleX;
      let extents = 10 - 2.5;
      if (this.gameObject.x < -extents) { this.gameObject.x = -extents; }
      if (this.gameObject.x > extents) { this.gameObject.x = extents }
    }
  },
  BallBehavior: class BallBehavior extends Base.Behavior {
    start() {
      this.speed = .4;
      this.angle = -1;
      this.sceneChangeCountDown = 5;
    }
    update() {
      this.paddle = Base.SceneManager.currentScene.findByName("Paddle");
      let x = Math.cos(this.angle);
      let y = Math.sin(this.angle);
      this.gameObject.x += x * this.speed;
      this.gameObject.y += y * this.speed;

      if (this.paddle) {
        let extents = 10 - 1;
        if (this.gameObject.x > extents) {
          this.angle = Math.atan2(y, -x);
          this.gameObject.x = extents - .01;
        }
        if (this.gameObject.x < -extents) {
          this.angle = Math.atan2(y, -x);
          this.gameObject.x = -extents + .01
        }
        if (this.gameObject.y < -extents) {
          this.angle = Math.atan2(-y, x);
          this.gameObject.y = -extents + .01
        }

        if (this.gameObject.y > extents) {
          if (Math.abs(this.paddle.x - this.gameObject.x) < 2.5) {
            this.angle = Math.atan2(-y, x);
            this.speed *= 1.1;
          }
          else {
            Base.SceneManager.destroy(this.paddle);
          }
        }

      }
      else {
        this.sceneChangeCountDown -= .1;
        if (this.sceneChangeCountDown <= 0) { Base.SceneManager.currentScene = "StartScene"; }
      }
    }
  }
}




Base.main(prefabs, GameBehaviors, Scenes);