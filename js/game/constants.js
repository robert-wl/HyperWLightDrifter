

const GameSettings = {
    GAME: {
        GAME_SCALE: 2,
    },
    game: {
        GAME_SCALE: 2,
        SCREEN_WIDTH: 1920,
        SCREEN_HEIGHT: 1080,
    },
    enemy: {
        SPAWN_RADIUS: 1000,
        SPAWN_RANDOM_RADIUS: 1000,
    },
    player: {
        MAX_IMMUNITY: 30,
        MAX_HEALTH: 6,
        MAX_HEALTHPACKS: 3,
        MAX_STAMINA: 100,
        MAX_BOMBS: 3,
        MAX_BULLETS: 3,
        FRICTION: 0.8,
        MAX_SPEED: 4,
        ATTACK_MOVE_SPEED: 4,
        DASH_MOVE_SPEED: 16,
        START_POSITION: {
            x: 200,
            y: 200,
        },
        WIDTH: 50,
        HEIGHT: 60,
        HITBOX: {
            x: 15,
            y: 0,
            w: 15,
            h: 0,
        },
        LAST_DIRECTION: 's',
        DEBUG_COLOR: 'rgb(0, 255, 0, 0.5)',
        ATTACK_BOX: {
            up: {
                x: -20,
                y: -30,
                w: 100,
                h: 75,
            },
            left: {
                x: -50,
                y: -10,
                w: 100,
                h: 85,
            },
            right: {
                x: 0,
                y: -10,
                w: 110,
                h: 85,
            },
            down: {
                x: -25,
                y: 10,
                w: 100,
                h: 100,
            }
        },
        PROJECTILE_OFFSET: 45,
        GUN: {
            RECOIL: 3,
            OFFSET: {
                UP: {
                    X: 35,
                    Y: 20,
                },
                LEFT: {
                    X: 25,
                    Y: 30,
                },
                RIGHT: {
                    X: 45,
                    Y: 30,
                },
                BOTTOM: {
                    X: 35,
                    Y: 32.5,
                }
            }
        },
        EXPLOSION_DISTANCE: 35,
        SHADOW_OFFSET: {
            X: -24.5,
            Y: -5,
        }
    },
    IMAGES: {
        STAGE_ONE: [
            {
                ref: 'player/aim/gun/railgun.png',
                name: 'railgun',
            },
            {
                ref: 'player/aim/aim_top.png',
                name: 'aim_top',
            },
            {
                ref: 'player/aim/aim_bottom.png',
                name: 'aim_bottom',
            },
            {
                ref: 'player/aim/aim_side.png',
                name: 'aim_side',
            },
            {
                ref: 'player/aim/gun/gun_explosion.png',
                name: 'gun_explosion',
            },
            {
                ref: 'particles/firefly/fireflies.png',
                name: 'fireflies',
                amount: 4,
            }
        ],
        STAGE_TWO: [
            {
                ref: 'player/aim/gun/railgun.png',
                name: 'railgun',
            },
            {
                ref: 'player/aim/aim_top.png',
                name: 'aim_top',
            },
            {
                ref: 'player/aim/aim_bottom.png',
                name: 'aim_bottom',
            },
            {
                ref: 'player/aim/aim_side.png',
                name: 'aim_side',
            },
            {
                ref: 'player/aim/gun/gun_explosion.png',
                name: 'gun_explosion',
            },
            {
                ref: 'boss/bomb/judgement_bomb.png',
                name: 'judgement_bomb',
                amount: 11,
            },
            {
                ref: 'boss/bomb/judgement_explosion.png',
                name: 'judgement_explosion',
                amount: 8,
            },
            {
                ref: 'boss/move/judgement_move.png',
                name: 'judgement_move',
                amount: 4,
            },
            {
                ref: 'boss/spawn/judgement_spawn.png',
                name: 'judgement_spawn',
                amount: 21,
            },
            {
                ref: 'boss/attack/judgement_attack.png',
                name: 'judgement_attack',
                amount: 6,
            },
            {
                ref: 'boss/laser/judgement_laser.png',
                name: 'judgement_laser',
                amount: 13,
            }
        ]
    }
}

export default GameSettings;
