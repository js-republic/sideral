const enums = {
    TYPE: {
        NONE    : -2,
        GHOST   : -1,
        STATIC  : 0,
        WEAK    : 1,
        SOLID   : 2
    },

    BOX: {
        RECTANGLE   : "rectangle",
        CIRCLE      : "circle"
    },

    GROUP: {
        NONE    : 1,
        ALL     : 2,
        GROUND  : 3,
        ALLY    : 4,
        ENEMY   : 5,
        NEUTRAL : 6,
        ENTITIES: 7
    },

    DURATION_TYPE: {
        FRAME           : "frame",
        MS              : "ms",
        ANIMATION_LOOP  : "animationLoop"
    }
};


export default enums;