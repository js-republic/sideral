import { SoundManager, SoundLoader } from "./index";


/**
 * Interface for an Asset loader
 */
export interface ILoader {

    /**
     * Pixi loader
     */
    pixi: PIXI.loaders.Loader;

    /**
     * Sound manager
     */
    sound: SoundLoader;
}


/**
 * Memory let you preload and use resources for your game
 */
export class Assets {

    /* ATTRIBUTES */

    /**
     * Sound manager
     * @readonly
     */
    sounds: SoundManager = new SoundManager();

    /**
     * PIXI & Sound Loaders
     * @readonly
     */
    static Loaders: { [s: string]: ILoader } = {};

    /**
     * Current environment of the Assets
     * @readonly
     */
    static env: string = "global";


    /* METHODS */

    /**
     * Load all assets from an environment
     * @param afterCallback - Callback to be launched after the full load
     * @param env - Environnement to load
     */
    static load (afterCallback?: Function, env?: string): void {
        env = env || "global";

        let pixiLoaded      = false,
            soundLoaded     = false;

        const loader        = Assets.getLoader(env),
            onLoad          = () => {
                if (afterCallback && soundLoaded && pixiLoaded) {
                    afterCallback();
                }
            },
            onSoundLoaded   = () => {
                soundLoaded = true;
                onLoad();
            },
            onPixiLoaded    = () => {
                pixiLoaded = true;
                onLoad();
            };

        Assets.env = env;

        loader.pixi.load(onPixiLoaded);
        loader.sound.load(onSoundLoaded);
    }

    /**
     * Preload an image
     * @param id - Id of the image
     * @param url - Url of the image to preload
     * @param env - Choose an environment to preload the assets
     */
    static preload (id: string, url: string, env?: string): typeof Assets {
        const loader = Assets.getLoader(env);

        if (!loader.pixi.resources[id]) {
            loader.pixi.add(id, url);
        }

        return Assets;
    }

    /**
     * Preload a sound
     * @param id - id of the sound
     * @param url - Url of the sound to preload
     * @param env - Choose an environment to preload the assets
     */
    static preloadSound (id: string, url: Array<string> | string, env?: string): typeof Assets {
        const loader = Assets.getLoader(env);

        loader.sound.preload(id, url);

        return Assets;
    }

    /**
     * Preload all assets for a tilemap
     * @param data - data of a tilemap
     * @param env - Environment to preload the assets
     */
    static preloadTilemap (data: any, env?: string): typeof Assets {
        if (data.backgrounds) {
            data.backgrounds.forEach(background => Assets.preload(background.path, background.path, env));
        }

        if (data.decorators) {
            Object.keys(data.decorators.data).forEach(key => Assets.preload(data.decorators.data[key], data.decorators.data[key], env));
        }

        Assets.preload(data.path, data.path, env);

        return Assets;
    }

    /**
     * Know if a loader is ready
     * @param env - Environment of the loader
     */
    static isReady (env: string = "global"): boolean {
        const loader = Assets.getLoader(env);

        return loader.pixi.progress >= 100 && !loader.pixi.loading && !loader.sound;
    }

    /**
     * Get the PIXI Loader by its environment
     * @param env - Loader of the environment
     */
    static getLoader (env: string = "global"): ILoader {
        let loader = Assets.Loaders[env];

        if (!loader) {
            loader = Assets.Loaders[env] = {
                pixi: new PIXI.loaders.Loader(),
                sound: new SoundLoader()
            };
        }

        return loader;
    }

    /**
     * Get a resource loaded
     * @param id - Id of the image
     * @param onLoad - Callback when the resource is ready
     * @param env - The environment to get the resource
     */
    static get (id: Array<string> | string, onLoad: Function, env?: string): void {
        const loader = Assets.getLoader(env);
        let resources = Array.isArray(id) ? id.map(x => loader.pixi.resources[x]) : loader.pixi.resources[id],
            validated = false;

        if (Array.isArray(resources)) {
            resources = resources.filter(resource => Boolean(resource));
            validated = Boolean(resources.length);

        } else {
            validated = Boolean(resources);

        }

        if (!validated) {
            console.warn(`Assets warning: some image are missing. [${Array.isArray(id) ? id.join(",") : id }]`);
            return null;
        }

        if (Assets.isReady(env)) {
            onLoad(resources);

        } else {
            loader.pixi.onComplete.add(() => onLoad(resources));
        }
    }

    /**
     * Get an image loaded
     * @param id - Id of the image
     * @param onLoad - Callback when the resource is ready
     * @param env - The environment to get the resource
     */
    static getImage (id: Array<string> | string, onLoad: Function, env?: string): void {
        Assets.get(id, resource => onLoad(Array.isArray(resource) ? resource.map(x => x.data) : resource.data), env);
    }

    /**
     * Get a texture loaded
     * @param id - Id of the image
     * @param onLoad - Callback when the resource is ready
     * @param env - The environment to get the resource
     */
    static getTexture (id: Array<string> | string, onLoad: Function, env?: string): void {
        Assets.get(id, resource => onLoad(Array.isArray(resource) ? resource.map(x => x.texture) : resource.texture), env);
    }

    /**
     * Get a Sound Manager
     * @param env - The environment of sound
     * @returns The sound manager
     */
    static getSound (env?: string): SoundManager {
        return this.getLoader(env).sound.manager;
    }
}