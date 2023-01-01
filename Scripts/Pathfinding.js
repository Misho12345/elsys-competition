"use strict";

class Pathfinding extends Component
{
    #environment = [];
    #originalGraph = {};
    #highLevelGraph = {};
    #lowLevelGraph = [];

    #density = 20;

    set environment(v) { this.#environment = v.GetComponents(PolygonCollider) }

    Awake() {
        let min = Vector2.positiveInfinity;
        let max = Vector2.negativeInfinity;

        for (const collider of this.#environment) {
            if (collider.bounds.tl.x < min.x) min.x = collider.bounds.tl.x;
            if (collider.bounds.tl.y < min.y) min.y = collider.bounds.tl.y;
            if (collider.bounds.tl.x + collider.bounds.size.x > max.x) max.x = collider.bounds.tl.x + collider.bounds.size.x;
            if (collider.bounds.tl.y + collider.bounds.size.y > max.y) max.y = collider.bounds.tl.y + collider.bounds.size.y;
        }

        let sub = Vector2.Subtraction(max, min);

        for (let i = 0; i <= sub.x; i += this.#density) {
            this.#lowLevelGraph.push([]);
            const x = i / this.#density;
            const last = this.#lowLevelGraph[x];

            for (let j = 0; j <= sub.y; j += this.#density) {
                const y = j / this.#density;
                let collides = false;

                for (const collider of this.#environment) {
                    if (CollidingPointAndPolygon(new Vector2(i + min.x, j + min.y), collider, this.#density)) {
                        collides = true;
                        break;
                    }
                }

                last.push(new Vector2(x, y));
                last[y].f = 0;
                last[y].g = 0;
                last[y].h = 0;
                last[y].neighbours = [];
                last[y].v = !collides;
            }
        }

        const rows = this.#lowLevelGraph.length;
        const cols = this.#lowLevelGraph[0].length;

        for (const row of this.#lowLevelGraph) {
            for (const el of row) {
                if (!el.v) continue;

                if (el.x > 0 && this.#lowLevelGraph[el.x - 1][el.y].v)        el.neighbours.push(this.#lowLevelGraph[el.x - 1][el.y]);
                if (el.x < cols - 1 && this.#lowLevelGraph[el.x + 1][el.y].v) el.neighbours.push(this.#lowLevelGraph[el.x + 1][el.y]);
                if (el.y > 0 && this.#lowLevelGraph[el.x][el.y - 1].v)        el.neighbours.push(this.#lowLevelGraph[el.x][el.y - 1]);
                if (el.y < rows - 1 && this.#lowLevelGraph[el.x][el.y + 1].v) el.neighbours.push(this.#lowLevelGraph[el.x][el.y + 1]);
            }
        }

        this.min = min;
    }

    set graph(v) {
        this.#originalGraph = v;
        for (const [key] of Object.keys(v)) {
            this.#highLevelGraph[key] = [];
            for (const neighbor of v[key].neighbors) {
                this.#highLevelGraph[key].push({ node: neighbor, weight: v[key].coords.DistanceFrom(v[neighbor].coords) });
            }
        }
    }

    LateUpdate() {
        context.fillStyle = "silver";
        for (const i in this.#lowLevelGraph)
            for (const j in this.#lowLevelGraph[i])
                if (this.#lowLevelGraph[i][j].v)
                    context.fillRect(this.min.x + i * this.#density - 2, this.min.y + j * this.#density - 2, 4, 4);
    }

    #AStar(start, goal) {
        let openList = [this.#lowLevelGraph[start.x][start.y]];
        let closedList = [];
        let path = [];

        while (openList.length > 0) {
            let lowestIdx = 0;

            for (let i = 0; i < openList.length; i++)
                if (openList[i].f < openList[lowestIdx].f)
                    lowestIdx = i;

            let curr = openList[lowestIdx];

            if (curr === this.#lowLevelGraph[goal.x][goal.y]) {
                let temp = curr;

                do {
                    path.push(Vector2.Sum(Vector2.Scale(temp, this.#density), this.min));
                    temp = temp.parent;
                } while (typeof temp !== "undefined");

                for (const i in this.#lowLevelGraph) {
                    for (const j in this.#lowLevelGraph[i]) {
                        this.#lowLevelGraph[i][j].parent = undefined;
                    }
                }

                return path.reverse();
            }

            openList.splice(lowestIdx, 1);
            closedList.push(curr);

            let neighbours = curr.neighbours;

            for (let i = 0; i < neighbours.length; i++) {
                let neighbour = neighbours[i];

                if (!closedList.includes(neighbour)) {
                    let possibleG = curr.g + 1;

                    if (!openList.includes(neighbour)) openList.push(neighbour);
                    else if (possibleG >= neighbour.g) continue;

                    neighbour.g = possibleG;
                    neighbour.h = neighbour.DistanceFrom(this.#lowLevelGraph[goal.x][goal.y]);
                    neighbour.f = neighbour.g + neighbour.h;
                    neighbour.parent = curr;
                }
            }
        }

        return [];
    }

    #SmoothPath(path) {
        let change = false;

        do {
            for (let i = 1; i < path.length - 1; i++) {
                for (const collider of this.#environment) {
                    if (!CollidingEdgeAndPolygon(path[i - 1], path[i + 1], collider)) {
                        change = true;
                        path.splice(i, 1);
                    }
                }
            }
        } while (change);

        return path;
    }

    Path(startNode, endNode) {
        const queue = [startNode];
        const distances = {};
        distances[startNode] = 0;
        const previous = {};

        const visited = new Set();
        while (queue.length > 0) {
            const node = queue.shift();

            if (visited.has(node)) continue;

            visited.add(node);

            if (node === endNode) break;

            const neighbours = this.#highLevelGraph[node];

            for (const neighbour of neighbours) {
                if (visited.has(neighbour.node)) continue;

                const distance = distances[node] + neighbour.weight;

                if (distances[neighbour.node] === undefined || distance < distances[neighbour.node]) {
                    distances[neighbour.node] = distance;
                    previous[neighbour.node] = node;

                    queue.push(neighbour.node);
                }
            }
        }

        let nodePath = [];
        let currentNode = endNode;

        while (typeof currentNode !== "undefined") {
            nodePath.unshift(currentNode);
            currentNode = previous[currentNode];
        }

        let path = [];
        for (let i = 0; i < nodePath.length - 1; i++) {
            let p1 = Vector2.Scale(Vector2.Subtraction(this.#originalGraph[nodePath[i]].coords, this.min), 1 / this.#density);
            let p2 = Vector2.Scale(Vector2.Subtraction(this.#originalGraph[nodePath[i + 1]].coords, this.min), 1 / this.#density);

            p1.Round();
            p2.Round();

            path = path.concat(this.#SmoothPath(this.#AStar(p1, p2)));
        }

        return path;
    }
}