import Element from "./Element";
import Engine from "./Engine";
import Entity from "./Entity";
import Scene from "./Scene";
import Component from "./components/Component";

import * as components from "./components";


const Sideral = {
    Element: Element,
    Engine: Engine,
    Entity: Entity,
    Scene: Scene,
    Component: Component,

    components: components
};

export default Sideral;
