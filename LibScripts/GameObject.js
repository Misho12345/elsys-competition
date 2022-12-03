"use strict";

let gameObjects = [];


function UpdateGameObjectsIndexes(idx) {
    for (let i = idx; i < gameObjects.length; i++) {
        gameObjects[i].idx = i;
    }
}

class GameObject {
    #active = true;
    idx;

    components = [];


    constructor(name = `new_GameObject_${gameObjects.length}`, position = Vector2.zero, scale = Vector2.one, rotation = 0, parent) {
        this.idx = gameObjects.length;
        gameObjects.push(this);

        this.transform = this.AddComponent(Transform);

        this.transform.name = name;

        if (typeof this.transform.parent !== "undefined" && CheckInstance(this.transform.parent, Transform, this.constructor)) {
            this.transform.parent.transform = parent;
        }

        this.transform.position = position;
        this.transform.scale = scale;
        this.transform.rotation = rotation;
    }


    static FindObjectByName(wanted) {
        for (const gameObj of gameObjects) {
            if (gameObj.name === wanted) {
                return gameObj;
            }
        }

        return undefined;
    }

    get active() { return this.#active }


    OnEnabled() { }

    OnDisabled() { }

    OnDestroyed() { }


    UpdateComponents(idx) {
        for (let i = idx; i < this.components.length; i++) {
            this.components[i].idx = i;
        }
    }


    AddComponent(Type) {
        const component = new Type;

        if (!CheckInstance(component, Component, this.AddComponent)) return undefined;

        this.components.push(component);

        component.idx = this.components.length - 1;
        component.gameObject = this;
        component.transform = this.transform;

        return component;
    }

    FindComponent(type) {
        const found = this.components.find(component => component instanceof type);
        return typeof found !== "undefined" ? found.idx : undefined;
    }

    RemoveComponent(type) {
        if (type instanceof Transform) {
            console.warn(`You can't remove 'Transform' component`);
            return;
        }

        const foundIdx = this.FindComponent(type);

        if (typeof foundIdx === "undefined") {
            console.warn(`'${type.name}' component not found - cannot remove`);
            return;
        }

        this.components.splice(foundIdx);
        this.UpdateComponents(foundIdx);
    }

    GetComponent(type) {
        return this.components[this.FindComponent(type)];
    }

    GetComponents(type) {
        const components = [];

        for (const component of this.components)
            if (component instanceof type)
                components.push(component);

        return components;
    }


    Destroy() {
        gameObjects.splice(this.idx);
        UpdateGameObjectsIndexes(this.idx);

        this.OnDestroyed();

        delete this;
    }

    SetActive(state) {
        if (state === this.#active) return;

        this.#active = state;

        if (state) this.OnEnabled();
        else this.OnDisabled();
    }

    MoveTowards(targetPosition, maxDistance) {
        this.transform.position = Vector2.MoveTowards(this.transform.position, targetPosition, maxDistance);
    }
}
