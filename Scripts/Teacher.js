"use strict";

class Teacher extends Component {
    pathfinding;
    graph;

    // speed = 1.5;
    // #patrolling = false;
    // #wandering = false;
    // #target = new Vector2();

    Awake() {
        this.pathfinding = this.gameObject.GetComponent(Pathfinding);

        if (typeof this.pathfinding === "undefined")
            this.pathfinding = this.gameObject.AddComponent(Pathfinding);

        this.pathfinding.graph = this.graph;
    }

    // Update() {
    //     if (this.#patrolling) {
    //         this.transform.position.Set(Vector2.MoveTowards(this.transform.position, this.#target, this.speed));
    //         if (this.transform.position.Equals(this.#target)) {
    //             this.#patrolling = false;
    //             this.#wandering = true;
    //             setTimeout(this.#StopWandering, Math.random() * 5 + 5);
    //         }
    //     }
    // }
    //
    // #StopWandering = () => this.#wandering = false;
}
