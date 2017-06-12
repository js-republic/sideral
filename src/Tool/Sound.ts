import Howler from "howler";


export class SoundLoader {

    /* ATTRIBUTES */

    /**
     * List of all sounds to load
     * @readonly
     */
    sounds: any = {};

    /**
     * OnLoad event
     */
    onLoad: Function = null;


    /* METHODS */

    /**
     * Add a new sound to load
     * @param id - id of the sound
     * @param url - path of the sound
     */
    preload (id: string, url: Array<string> | string): void {
        console.log(Howler);

        const sound = new Howler({
            src     : [].concat(url),
            preload : false
        });

        sound.on("load", this._onSoundLoad.bind(this));

        this.sounds[id] = sound;
    }

    /**
     * Know if the sound has completly load all sounds
     */
    isReady (): boolean {
        return !Object.keys[this.sounds].
            map(key => this.sounds[key].state()).
            filter(state => state !== "loaded").length;
    }

    /**
     * Load all sounds
     */
    load (onLoad?: Function): void {
        this.onLoad = onLoad;

        this.getAll().forEach(sound => sound.load());
    }

    /**
     * Get all sounds in array
     */
    getAll (): Array<Howler> {
        return Object.keys[this.sounds].map(key => this.sounds[key]);
    }


    /* PRIVATE */

    /**
     * Event fired when a sound is loaded
     * @private
     */
    _onSoundLoad (): void {
        if (this.onLoad && this.isReady()) {
            this.onLoad();
        }
    }
}


/**
 * Sound manager (use it directly with Assets.sounds)
 */
export class SoundManager {

    /* ATTRIBUTES */

    /**
     * current music
     * @readonly
     */
    music: any = null;


    /* METHODS */

    /**
     * Play a sound
     * @param id - id of the sound to play
     */
    play (id: string): any {
        return null; // createjs.Sound.play(id);
    }

    /**
     * Play a music background
     * @param id - id of the sound to play
     */
    playMusic (id: string): any {
        return this.music = this.play(id);
    }
}