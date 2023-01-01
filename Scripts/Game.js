"use strict";

let graph = {
    A: { coords: new Vector2(-270, -230), neighbors: ["B", "K"] },
    B: { coords: new Vector2(-210, -10), neighbors: ["A", "C"] },
    C: { coords: new Vector2(-270, 230), neighbors: ["B", "D"] },
    D: { coords: new Vector2(-170, 270), neighbors: ["C", "E"] },
    E: { coords: new Vector2(-50, 230), neighbors: ["D", "F", "H"] },
    F: { coords: new Vector2(210, 270), neighbors: ["E", "G", "H"] },
    G: { coords: new Vector2(270, 110), neighbors: ["F", "H"] },
    H: { coords: new Vector2(110, -10), neighbors: ["E", "F", "G", "I", "K"] },
    I: { coords: new Vector2(190, -170), neighbors: ["H", "J"] },
    J: { coords: new Vector2(70, -290), neighbors: ["I", "K"] },
    K: { coords: new Vector2(-150, -170), neighbors: ["A", "J", "H"] },
}

function DrawLine(c1, c2) {
    context.moveTo(c1.x, c1.y)
    context.lineTo(c2.x, c2.y)
}

class DrawGraph extends Component {
    Awake() {
        this.path = []
    }

    LateUpdate() {
        context.beginPath();
        for (const [key] of Object.keys(graph)) {
            for (const neighbor of graph[key].neighbors) {
                DrawLine(Vector2.Sum(graph[key].coords), Vector2.Sum(graph[neighbor].coords));
            }
        }

        context.strokeStyle = "gray";
        context.stroke();

        context.beginPath();
        for (let i = 0; i < this.path.length - 1; i++) {
            DrawLine(this.path[i], this.path[i + 1]);
        }

        // context.moveTo(-500, -500);
        // context.lineTo(-200, -200);

        context.strokeStyle = 'red';
        context.stroke();
    }
}

let environment = new GameObject();

let box1 = environment.AddComponent(BoxCollider); box1.scale.Set(680, 20); box1.offset.Set(-10, -340); box1.draw = true;
let box2 = environment.AddComponent(BoxCollider); box2.scale.Set(20, 680); box2.offset.Set(-340, 10); box2.draw = true;
let box3 = environment.AddComponent(BoxCollider); box3.scale.Set(680, 20); box3.offset.Set(10, 340); box3.draw = true;
let box4 = environment.AddComponent(BoxCollider); box4.scale.Set(20, 680); box4.offset.Set(340, -10); box4.draw = true;
let box5 = environment.AddComponent(BoxCollider); box5.scale.Set(20, 100); box5.offset.Set(-160, -280); box5.draw = true;
let box6 = environment.AddComponent(BoxCollider); box6.scale.Set(20, 80); box6.offset.Set(-160, -90); box6.draw = true;
let box7 = environment.AddComponent(BoxCollider); box7.scale.Set(60, 160); box7.offset.Set(-140, 30); box7.draw = true;
let box8 = environment.AddComponent(BoxCollider); box8.scale.Set(100, 60); box8.offset.Set(-160, 140); box8.draw = true;
let box9 = environment.AddComponent(BoxCollider); box9.scale.Set(160, 60); box9.offset.Set(-30, 20); box9.draw = true;
let box10 = environment.AddComponent(BoxCollider); box10.scale.Set(60, 80); box10.offset.Set(-300, -30); box10.draw = true;
let box11 = environment.AddComponent(BoxCollider); box11.scale.Set(80, 300); box11.offset.Set(290, -180); box11.draw = true;
let box12 = environment.AddComponent(BoxCollider); box12.scale.Set(180, 40); box12.offset.Set(240, -10); box12.draw = true;
let box13 = environment.AddComponent(BoxCollider); box13.scale.Set(80, 140); box13.offset.Set(70, -180); box13.draw = true;

// let player = new GameObject("player", new Vector2(40), new Vector2(20));
// player.AddComponent(BoxCollider).draw = true;
//player.AddComponent(Movement);

let gObj = new GameObject();
let pathfinding = gObj.AddComponent(Pathfinding);
let draw = gObj.AddComponent(DrawGraph);
pathfinding.graph = graph;
pathfinding.environment = environment;
