"use strict";

class Movement extends Component {
    #velocity = Vector2.zero;
    speed = 1;

    Awake() {
        let input = this.gameObject.AddComponent(Input);

        input.AddAction("KeyW", undefined, _ => this.#velocity.y = -1, _ => this.#velocity.y = 0);
        input.AddAction("KeyA", undefined, _ => this.#velocity.x = -1, _ => this.#velocity.x = 0);
        input.AddAction("KeyS", undefined, _ => this.#velocity.y =  1, _ => this.#velocity.y = 0);
        input.AddAction("KeyD", undefined, _ => this.#velocity.x =  1, _ => this.#velocity.x = 0);
    }

    Update() {
        this.#velocity.Normalize();
        this.#velocity.Scale(this.speed);

        this.transform.position.Add(this.#velocity);

        for (const gObj of gameObjects)
            if (gObj !== this.gameObject)
                this.transform.position.Add(DetectCollision(this.gameObject, gObj, true));
    }
}
