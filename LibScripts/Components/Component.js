"use strict";

function CheckInstance(v, t, func) {
    if (v instanceof t) return true;

    console.warn(`Value must be an instance of ${t.name} when calling ${func.name}()`);
    return false;
}

class Component {
    #enabled = true;

    idx;
    gameObject;
    transform;

    get enabled() { return this.#enabled }
    set enabled(v) {
        if (this.#enabled === v) return;

        this.#enabled = v;

        if (this.#enabled) this.OnEnabled();
        else this.OnDisabled();
    }

    OnEnabled() { }
    OnDisabled() { }
}
