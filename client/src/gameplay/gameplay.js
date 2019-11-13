import React from 'react';
import Sketch from 'react-p5';
import { Snake } from './snake';

export function Gameplay() {

    var snake;
    var food;
    var w;
    var h;
    var size = 10;

    return (
        <Sketch setup={setup} draw={draw} keyPressed={keyPressed}></Sketch>
    );
    
    function setup(p5, canvasParentRef) {
        p5.createCanvas(600, 600).parent(canvasParentRef);
        w = p5.floor(p5.width / size);
        h = p5.floor(p5.width / size);
        p5.frameRate(8);
        snake = new Snake(p5);
        generateFood(p5);
    }
    
    function draw(p5) {
        p5.scale(size)
        p5.background(220);
    
        if (snake.eat(food)) {
            generateFood(p5);
        }
    
        if (snake.dead()) {
            p5.print("END");
            p5.background(200, 0, 0);
            p5.noLoop();
        }
    
        snake.update();
        snake.show(p5);
    
        // draw food
        p5.noStroke();
        p5.fill(255, 0, 0);
        p5.rect(food.x, food.y, 1, 1);
    }
    
    function generateFood(p5) {
        let x = p5.floor(p5.random(w));
        let y = p5.floor(p5.random(h));
        food = p5.createVector(x, y);
    }
    
    function keyPressed(p5) {
        if (p5.keyCode === p5.LEFT_ARROW) {
            snake.setDir(-1, 0);
        } else if (p5.keyCode === p5.RIGHT_ARROW) {
            snake.setDir(1, 0);
        } else if (p5.keyCode === p5.UP_ARROW) {
            snake.setDir(0, -1);
        } else if (p5.keyCode === p5.DOWN_ARROW) {
            snake.setDir(0, 1);
        }
    }

}