import { Signal } from "./../Tool";


/**
 * Signals emitted by a SideralObject
 */
export interface ISignals {

    /**
     * Signal emitted everytime the object is updating
     */
    update: Signal;

    /**
     * Signal emitted when a property (which the name is passed in parameter) has changed
     */
    propChange: Signal;

    /**
     * Signal emitted when a new SideralObject is adding to the current object
     */
    addChild: Signal;

    /**
     * Signal emitted when a SideralObject is removing from the current object
     */
    removeChild: Signal;
}


/**
 * Signals emitted by the Keyboard Object
 */
export interface IKeyboardSignals extends ISignals {

    /**
     * Signal emitted everytime a key is pressed or released
     */
    keyChange: Signal;

    /**
     * Signal emitted when a key is pressed
     */
    keyPress: Signal;

    /**
     * Signal emitted when a key is released
     */
    keyRelease: Signal;
}


/**
 * Signals emitted by a Module
 */
export interface IModuleSignals extends ISignals {

    /**
     * Signal emitted on click on the module
     */
    click: Signal;
}

/**
 * Signals emitted by a Skill
 */
export interface ISkillSignals extends ISignals {

    /**
     * When the preparation timer is started
     */
    preparationStart: Signal;

    /**
     * When the preparation timer is updating
     */
    preparationUpdate: Signal;

    /**
     * When the preparation timer is completed
     */
    preparationComplete: Signal;

    /**
     * When the skill is started
     */
    skillStart: Signal;

    /**
     * When the skill is updating
     */
    skillUpdate: Signal;

    /**
     * When the skill is completed
     */
    skillComplete: Signal;

    /**
     * When the reload timer is started
     */
    reloadStart: Signal;

    /**
     * When the reload timer is updating
     */
    reloadUpdate: Signal;

    /**
     * When the reload timer is completed
     */
    reloadComplete: Signal;
}

/**
 * Signals of Entity
 */
export interface IEntitySignals extends IModuleSignals {

    /**
     * When entity is entering in collision with an other entity
     */
    beginCollision: Signal;

    /**
     * Signal emitted every update if the entity is currently in collision with an other entity
     */
    collision: Signal;

    /**
     * When entity is not in collision anymore
     */
    endCollision: Signal;
}
