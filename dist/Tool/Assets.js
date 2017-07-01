"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Memory let you preload and use resources for your game
 */
var Assets = (function () {
    function Assets() {
    }
    /* METHODS */
    /**
     * Preload an image
     * @param url - Url of the image to preload
     * @param env - Choose an environment to preload the assets
     */
    Assets.preload = function (url, env) {
        var loader = Assets.getLoader(env);
        [].concat(url).forEach(function (nextUrl) {
            if (!Object.keys(loader).find(function (key) { return key === nextUrl; })) {
                loader.add(nextUrl);
            }
        });
        return Assets;
    };
    /**
     * Load all assets from an environment
     * @param afterCallback - Callback to be launched after the full load
     * @param env - Environnement to load
     */
    Assets.load = function (afterCallback, env) {
        var loader = Assets.getLoader(env);
        loader.load(afterCallback);
    };
    /**
     * Preload all assets for a tilemap
     * @param data - data of a tilemap
     * @param env - Environment to preload the assets
     */
    Assets.preloadTilemap = function (data, env) {
        if (data.backgrounds) {
            Assets.preload(data.backgrounds.map(function (background) { return background.path; }), env);
        }
        if (data.decorators) {
            Assets.preload(Object.keys(data.decorators.data).map(function (key) { return data.decorators.data[key]; }), env);
        }
        Assets.preload(data.path, env);
        return Assets;
    };
    /**
     * Know if a loader is ready
     * @param env - Environment of the loader
     */
    Assets.isReady = function (env) {
        if (env === void 0) { env = "global"; }
        var loader = Assets.getLoader(env);
        return loader.progress >= 100 && !loader.loading;
    };
    /**
     * Get the PIXI Loader by its environment
     * @param env - Loader of the environment
     */
    Assets.getLoader = function (env) {
        if (env === void 0) { env = "global"; }
        var loader = Assets.Loaders[env];
        if (!loader) {
            loader = Assets.Loaders[env] = new PIXI.loaders.Loader();
        }
        return loader;
    };
    /**
     * Get a resource loaded
     * @param url - Url of the image to get
     * @param onLoad - Callback when the resource is ready
     * @param env - The environment to get the resource
     */
    Assets.get = function (url, onLoad, env) {
        var loader = Assets.getLoader(env), resources = Array.isArray(url) ? url.map(function (nextUrl) { return loader.resources[nextUrl]; }) : loader.resources[url];
        if (Assets.isReady(env)) {
            onLoad(resources);
        }
        else {
            loader.onComplete.add(function () { return onLoad(resources); });
        }
    };
    /**
     * Get an image loaded
     * @param url - Url of the image to get
     * @param onLoad - Callback when the resource is ready
     * @param env - The environment to get the resource
     */
    Assets.getImage = function (url, onLoad, env) {
        Assets.get(url, function (resource) { return onLoad(Array.isArray(resource) ? resource.map(function (x) { return x.data; }) : resource.data); }, env);
    };
    /**
     * Get a texture loaded
     * @param url - Url of the texture to get
     * @param onLoad - Callback when the resource is ready
     * @param env - The environment to get the resource
     */
    Assets.getTexture = function (url, onLoad, env) {
        Assets.get(url, function (resource) { return onLoad(Array.isArray(resource) ? resource.map(function (x) { return x.texture; }) : resource.texture); }, env);
    };
    return Assets;
}());
/* ATTRIBUTES */
/**
 * PIXI Loaders
 * @readonly
 */
Assets.Loaders = {};
exports.Assets = Assets;
