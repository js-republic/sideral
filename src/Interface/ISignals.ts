import { SignalEvent } from "./../Tool";


/**
 * Signals emitted by a SideralObject
 */
export interface ISignals {

    /**
     * Signal emitted everytime the object is updating
     */
    update: SignalEvent;

    /**
     * Signal emitted when a property (which the name is passed in parameter) has changed
     */
    propChange: SignalEvent;

    /**
     * Signal emitted when a new SideralObject is adding to the current object
     */
    addChild: SignalEvent;

    /**
     * Signal emitted when a SideralObject is removing from the current object
     */
    removeChild: SignalEvent;
}


/**
 * Signals emitted by the Keyboard Object
 */
export interface IKeyboardSignals extends ISignals {

    /**
     * Signal emitted everytime a key is pressed or released
     */
    keyChange: SignalEvent;

    /**
     * Signal emitted when a key is pressed
     */
    keyPress: SignalEvent;

    /**
     * Signal emitted when a key is released
     */
    keyRelease: SignalEvent;
}


/**
 * Signals emitted by a Module
 */
export interface IModuleSignals extends ISignals {

    /**
     * Signal emitted on click on the module
     */
    click: SignalEvent;

    /**
     * Signal emitted on doubleclick on the module
     */
    doubleClick: SignalEvent;

    /**
     * Signal emitted on right click on the module
     */
    rightClick: SignalEvent;

    /**
     * When mouse is hover
     */
    hover: SignalEvent;

    /**
     * When mouse enter in hover
     */
    hoverStart: SignalEvent;

    /**
     * When mouse is not hover anymore
     */
    hoverEnd: SignalEvent;
}

/**
 * Signals emitted by the Scene object
 */
export interface ISceneSignals extends IModuleSignals {
    /**
     * Signal emitted during the loading of assets (used only if the scene is considered has the loader of the game)
     */
    progress: SignalEvent;
}

/**
 * Signals emitted by a Skill
 */
export interface ISkillSignals extends ISignals {

    /**
     * When the preparation timer is started
     */
    preparationStart: SignalEvent;

    /**
     * When the preparation timer is updating
     */
    preparationUpdate: SignalEvent;

    /**
     * When the preparation timer is completed
     */
    preparationComplete: SignalEvent;

    /**
     * When the skill is started
     */
    skillStart: SignalEvent;

    /**
     * When the skill is updating
     */
    skillUpdate: SignalEvent;

    /**
     * When the skill is completed
     */
    skillComplete: SignalEvent;

    /**
     * When the reload timer is started
     */
    reloadStart: SignalEvent;

    /**
     * When the reload timer is updating
     */
    reloadUpdate: SignalEvent;

    /**
     * When the reload timer is completed
     */
    reloadComplete: SignalEvent;
}

/**
 * Signals of Physic
 */
export interface IEntitySignal extends IModuleSignals {

    /**
     * When entity is entering in collision with an other entity
     */
    beginCollision: SignalEvent;

    /**
     * Signal emitted every update if the entity is currently in collision with an other entity
     */
    collision: SignalEvent;

    /**
     * Signal emitted every time the entity hit a wall
     */
    wallCollision: SignalEvent;

    /**
     * When entity is not in collision anymore
     */
    endCollision: SignalEvent;
}

/**
 * Signal for graphic
 */
export interface IGraphicSignal extends IModuleSignals {

    /**
     * When the state of the graphic has changed
     */
    stateChange: SignalEvent;
}
