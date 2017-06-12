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
     * @param url - Url of the image to preload
     * @param env - Choose an environment to preload the assets
     */
    static preload (url: Array<string> | string, env?: string): typeof Assets {
        const loader = Assets.getLoader(env);
        
        [].concat(url).forEach(nextUrl => {
            if (!Object.keys(loader).find(key => key === nextUrl)) {
                loader.pixi.add(nextUrl);
            }
        });

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
            Assets.preload(data.backgrounds.map(background => background.path), env);
        }

        if (data.decorators) {
            Assets.preload(Object.keys(data.decorators.data).map(key => data.decorators.data[key]), env);
        }

        Assets.preload(data.path, env);

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
     * @param url - Url of the image to get
     * @param onLoad - Callback when the resource is ready
     * @param env - The environment to get the resource
     */
    static get (url: Array<string> | string, onLoad: Function, env?: string): void {
        const loader = Assets.getLoader(env),
            resources = Array.isArray(url) ? url.map(nextUrl => loader.pixi.resources[nextUrl]) : loader.pixi.resources[url];

        if (Assets.isReady(env)) {
            onLoad(resources);

        } else {
            loader.pixi.onComplete.add(() => onLoad(resources));
        }
    }

    /**
     * Get an image loaded
     * @param url - Url of the image to get
     * @param onLoad - Callback when the resource is ready
     * @param env - The environment to get the resource
     */
    static getImage (url: Array<string> | string, onLoad: Function, env?: string): void {
        Assets.get(url, resource => onLoad(Array.isArray(resource) ? resource.map(x => x.data) : resource.data), env);
    }

    /**
     * Get a texture loaded
     * @param url - Url of the texture to get
     * @param onLoad - Callback when the resource is ready
     * @param env - The environment to get the resource
     */
    static getTexture (url: Array<string> | string, onLoad: Function, env?: string): void {
        Assets.get(url, resource => onLoad(Array.isArray(resource) ? resource.map(x => x.texture) : resource.texture), env);
    }
}