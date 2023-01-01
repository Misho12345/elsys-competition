class PolygonCollider extends Collider {
    #localPoints = [];
    #currRotPoints = [];
    points = [];

    #connected;

    #prevPos = new Vector2();
    #prevRotation = 0;

    constructor() { super() }

    SetPoints(points = [], connect = true) {
        this.#connected = connect;

        for (const point of points) {
            this.#localPoints.push(point.copy);
            this.#currRotPoints.push(new Vector2());
            this.points.push(new Vector2());
        }

        if (connect) {
            this.#localPoints.push(points[0].copy);
            this.#currRotPoints.push(new Vector2());
            this.points.push(new Vector2());
        }

        this.set = true;
        this.enabled = true;

        this.UpdateRotationOfPoints();
        this.UpdatePositionOfPoints();
    }

    GetBounds() {
        let min = Vector2.positiveInfinity;
        let max = Vector2.negativeInfinity;

        for (const point of this.points) {
            if (point.x < min.x) min.x = point.x;
            else if (point.x > max.x) max.x = point.x;

            if (point.y < min.y) min.y = point.y;
            else if (point.y > max.y) max.y = point.y;
        }

        this.bounds.tl.Set(min);
        this.bounds.size.Set(Vector2.Subtraction(max, min));
    }


    UpdateRotationOfPoints() {
        this.#prevRotation = this.transform.rotation;

        for (const i in this.#currRotPoints) {
            let angle = Vector2.SignedAngle(this.#localPoints[i], Vector2.right) + this.#prevRotation;
            this.#currRotPoints[i].Set(Math.cos(angle), Math.sin(angle));
            this.#currRotPoints[i].Scale(this.#localPoints[i].magnitude);
        }

        this.UpdatePositionOfPoints();
    }

    UpdatePositionOfPoints() {
        this.#prevPos.Set(this.transform.position);

        this.centerPoint.Set(this.transform.position);
        this.centerPoint.Add(this.offset);

        for (let i = 0; i < this.points.length; i++) {
            this.points[i].Set(this.#currRotPoints[i]);
            this.points[i].Add(this.centerPoint);
        }

        this.GetBounds();
    }

    Update() {
        if (!this.set) return;

        if (this.#prevRotation !== this.transform.rotation) this.UpdateRotationOfPoints();
        if (!this.#prevPos.Equals(this.transform.position)) this.UpdatePositionOfPoints();
    }

    Draw() {
        super.Draw();

        context.beginPath();

        for (const point of this.points) {
            context.lineTo(point.x, point.y);
        }

        context.fillStyle = this.#connected ? "#5f55" : "#5f52";
        context.fill();

        context.strokeStyle = "#3f3";
        context.lineWidth = 3;
        context.stroke();
    }
}