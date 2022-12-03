"use strict";

let deltaTime;
let time;

function resizePage() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function init() {
    resizePage();
    time = new Date();

    for (const gObj of gameObjects)
        for (const component of gObj.components)
            if (typeof component.Awake !== "undefined")
                component.Awake();

    for (const gObj of gameObjects) {
        if (!gObj.active) continue;
        for (const component of gObj.components) {
            if (!component.enabled || typeof component.Start === "undefined") continue;
            component.Start();
        }
    }

    UpdateScene();
}

function UpdateScene() {
    deltaTime = (new Date() - time) / 100;
    time = new Date();

    window.onresize = resizePage();

    context.translate(canvas.width / 2, canvas.height / 2);

    context.globalAlpha = 1;
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (const gObj of gameObjects) {
        if (!gObj.active) continue;
        for (const component of gObj.components) {
            if (!component.enabled || typeof component.EarlyUpdate === "undefined") continue;
            component.EarlyUpdate();
        }
    }

    for (const gObj of gameObjects) {
        if (!gObj.active) continue;
        for (const component of gObj.components) {
            if (!component.enabled || typeof component.Update === "undefined") continue;
            component.Update();
        }
    }

    for (const gObj of gameObjects) {
        if (!gObj.active) continue;
        for (const component of gObj.components) {
            if (!component.enabled || typeof component.LateUpdate === "undefined") continue;
            component.LateUpdate();
        }
    }

    setTimeout(UpdateScene, 0);
}
