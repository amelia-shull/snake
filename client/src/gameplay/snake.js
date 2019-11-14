export class Snake {
    constructor(p5) {
        this.body = [];
        this.body[0] = p5.createVector(0, 0);
        this.xDir = 0;
        this.yDir = 0;
        this.p5 = p5;
    }
 
    update() {
        let head = this.body[this.body.length - 1].copy();
        this.body.shift();
        head.x += this.xDir;
        head.y += this.yDir;
        this.body.push(head);
    }
 
    show(p5) {
        this.body.forEach(function(element) {
            p5.fill(0);
            p5.noStroke();
            p5.rect(element.x, element.y, 1, 1);
        })
    }
 
    setDir(xDir, yDir) {
        this.xDir = xDir;
        this.yDir = yDir;
    }
 
    grow() {
        let head = this.body[this.body.length - 1].copy();
        this.body.push(head);
    }
   
    eat(food) {
        if (food.x === this.body[this.body.length - 1].x &&
            food.y === this.body[this.body.length - 1].y) {
            this.grow();
            return true;
        }
        return false;
    }
 
    dead() {
        return false;
    }
  }