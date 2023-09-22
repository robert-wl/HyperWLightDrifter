const GameSettings = {
    GAME: {
        GAME_SCALE: 2,
        ELEVATOR: {
            POSITION: {
                X: 950,
                Y: 2000,
            }
        },
        SCREEN_WIDTH: 1920,
        SCREEN_HEIGHT: 1080,
    },
    game: {
        GAME_SCALE: 2,
        SCREEN_WIDTH: 1920,
        SCREEN_HEIGHT: 1080,
    },
    enemy: {
        SPAWN_RADIUS: 1500,
        SPAWN_RANDOM_RADIUS: 500,
    },
    player: {
        MAX_IMMUNITY: 30,
        MAX_HEALTH: 6,
        MAX_HEALTHPACKS: 3,
        MAX_STAMINA: 100,
        MAX_BOMBS: 3000,
        MAX_BULLETS: 3,
        FRICTION: 0.8,
        MAX_SPEED: 4,
        ATTACK_MOVE_SPEED: 2,
        DASH_MOVE_SPEED: 16,
        START_POSITION: {
            x: 200,
            y: 200,
        },
        WIDTH: 50,
        HEIGHT: 60,
        HITBOX: {
            x: -15,
            y: 0,
            w: 15,
            h: 0,
        },
        LAST_DIRECTION: 's',
        DEBUG_COLOR: 'rgb(0, 255, 0, 0.5)',
        ATTACK_BOX: {
            UP: {
                X: -50,
                Y: -60,
                W: 100,
                H: 75,
            },
            LEFT: {
                X: -60,
                Y: -40,
                W: 90,
                H: 85,
            },
            RIGHT: {
                X: -30,
                Y: -40,
                W: 90,
                H: 85,
            },
            DOWN: {
                X: -45,
                Y: -25,
                W: 100,
                H: 90,
            },
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
                },
            },
        },
        EFFECT_DISTANCE: 40,
        SHADOW_OFFSET: {
            X: -24.5,
            Y: -5,
        },
    },
    IMAGES: {
        SPAWN: [
            {
                ref: 'particles/firefly/fireflies.png',
                name: 'fireflies',
                amount: 4,
            },
        ],
        STAGE_ONE: [
            { //PLAYER ======================================
                ref: 'player/aim/gun/railgun.png',
                name: 'railgun',
            },
            {
                ref: 'player/aim/aim_top.png',
                name: 'aim_top',
                outfit: true,
            },
            {
                ref: 'player/aim/aim_bottom.png',
                name: 'aim_bottom',
                outfit: true,
            },
            {
                ref: 'player/move/move_up.png',
                name: 'move_up',
                amount: 12,
                outfit: true,
            },
            {
                ref: 'player/move/move_down.png',
                name: 'move_down',
                amount: 12,
                outfit: true,
            },
            {
                ref: 'player/move/move_left.png',
                name: 'move_left',
                amount: 12,
                outfit: true,
            },
            {
                ref: 'player/move/move_right.png',
                name: 'move_right',
                amount: 12,
                outfit: true,
            },
            {
                ref: 'player/idle/idle_up.png',
                name: 'idle_up',
                outfit: true,
            },
            {
                ref: 'player/idle/idle_left.png',
                name: 'idle_left',
                outfit: true,
            },
            {
                ref: 'player/idle/idle_right.png',
                name: 'idle_right',
                outfit: true,
            },
            {
                ref: 'player/idle/idle_down.png',
                name: 'idle_down',
                outfit: true,
            },
            {
                ref: 'player/hurt/player_hurt.png',
                name: 'player_hurt',
                amount: 3,
                outfit: true,
            },
            {
                ref: 'player/dash/animation/dash_animation.png',
                name: 'dash_animation',
                amount: 4,
                outfit: true,
            },
            {
                ref: 'player/dash/dash_down.png',
                name: 'dash_down',
                amount: 6,
                outfit: true,
            },
            {
                ref: 'player/dash/dash_side.png',
                name: 'dash_side',
                amount: 5,
                outfit: true,
            },
            {
                ref: 'player/dash/dash_up.png',
                name: 'dash_up',
                amount: 7,
                outfit: true,
            },
            {
                ref: 'player/attack/attack_up.png',
                name: 'attack_up',
                amount: 6,
                outfit: true,
            },
            {
                ref: 'player/attack/attack_side.png',
                name: 'attack_side',
                amount: 7,
                outfit: true,
            },
            {
                ref: 'player/attack/attack_down.png',
                name: 'attack_down',
                amount: 6,
                outfit: true,
            },
            {
                ref: 'player/attack/attack2_up.png',
                name: 'attack2_up',
                amount: 6,
                outfit: true,
            },
            {
                ref: 'player/attack/attack2_side.png',
                name: 'attack2_side',
                amount: 7,
                outfit: true,
            },
            {
                ref: 'player/attack/attack2_down.png',
                name: 'attack2_down',
                amount: 6,
                outfit: true,
            },
            {
                ref: 'player/spawn/spawn.png',
                name: 'player_spawn',
                amount: 9,
                outfit: true,
            },
            {
                ref: 'player/aim/aim_side.png',
                name: 'aim_side',
                outfit: true,
            },
            {
                ref: 'player/aim/gun/gun_effect.png',
                name: 'gun_effect',
            },
            {
                ref: 'player/aim/gun/ray.png',
                name: 'gun_ray',
            },
            {
                ref: 'player/aim/gun/impact.png',
                name: 'gun_impact',
                amount: 2
            },
            {
                ref: 'player/grenade/grenade.png',
                name: 'grenade',
                amount: 11,
            }, //PLAYER ======================================
            {
                ref: 'particles/firefly/fireflies.png',
                name: 'fireflies',
                amount: 4,
            },
            {
                ref: 'player/aim/gun/projectile.png',
                name: 'projectile'
            },
            {
                ref: 'ui/interaction_bar/interaction_bar.png',
                name: 'interaction_bar',
                amount: 4,
            },
            {
                ref: 'player/death/death.png',
                name: 'player_death',
                amount: 6,
            },
            {
                ref: 'world/elevator.png',
                name: 'elevator',
            },
            {
                ref: 'enemy/crystal_brute/walk/crystal_brute_walk.png',
                name: 'crystal_brute_walk',
                amount: 6,
            },
            {
                ref: 'enemy/crystal_brute/attack/crystal_brute_attack.png',
                name: 'crystal_brute_attack',
                amount: 11,
            },
            {
                ref: 'enemy/crystal_brute/die/crystal_brute_die.png',
                name: 'crystal_brute_die',
            },
            {
                ref: 'enemy/crystal_brute/spike/crystal_spike.png',
                name: 'crystal_spike',
                amount: 7,
            },
            {
                ref: 'enemy/crystal_spider/walk/walk.png',
                name: 'crystal_spider_walk',
                amount: 4,
            },
            {
                ref: 'enemy/crystal_spider/attack/attack.png',
                name: 'crystal_spider_attack',
            },
            {
                ref: 'enemy/crystal_spider/die/die.png',
                name: 'crystal_spider_die',
            },
            {
                ref: 'other/shadow.png',
                name: 'shadow',
            },
            {
                ref: 'world/map_ground.png',
                name: 'map_ground',
            },
            {
                ref: 'world/first_map_full.png',
                name: 'map_top',
            },
            {
                ref: 'world/first_map_full.png',
                name: 'map_top',
            },
            {
                ref: 'other/medkit/medkit.png',
                name: 'medkit',
                amount: 2
            },
            {
                ref: 'world/door/door.png',
                name: 'door',
                amount: 13
            },
            {
                ref: 'UI/HUD.png',
                name: 'HUD',
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
                outfit: true,
            },
            {
                ref: 'player/aim/aim_bottom.png',
                name: 'aim_bottom',
                outfit: true,
            },
            {
                ref: 'player/move/move_up.png',
                name: 'move_up',
                amount: 12,
                outfit: true,
            },
            {
                ref: 'player/move/move_down.png',
                name: 'move_down',
                amount: 12,
                outfit: true,
            },
            {
                ref: 'player/move/move_left.png',
                name: 'move_left',
                amount: 12,
                outfit: true,
            },
            {
                ref: 'player/move/move_right.png',
                name: 'move_right',
                amount: 12,
                outfit: true,
            },
            {
                ref: 'player/idle/idle_up.png',
                name: 'idle_up',
                outfit: true,
            },
            {
                ref: 'player/idle/idle_left.png',
                name: 'idle_left',
                outfit: true,
            },
            {
                ref: 'player/idle/idle_right.png',
                name: 'idle_right',
                outfit: true,
            },
            {
                ref: 'player/idle/idle_down.png',
                name: 'idle_down',
                outfit: true,
            },
            {
                ref: 'player/hurt/player_hurt.png',
                name: 'player_hurt',
                amount: 3,
                outfit: true,
            },
            {
                ref: 'player/dash/animation/dash_animation.png',
                name: 'dash_animation',
                amount: 4,
                outfit: true,
            },
            {
                ref: 'player/dash/dash_down.png',
                name: 'dash_down',
                amount: 6,
                outfit: true,
            },
            {
                ref: 'player/dash/dash_side.png',
                name: 'dash_side',
                amount: 5,
                outfit: true,
            },
            {
                ref: 'player/dash/dash_up.png',
                name: 'dash_up',
                amount: 7,
                outfit: true,
            },
            {
                ref: 'player/attack/attack_up.png',
                name: 'attack_up',
                amount: 6,
                outfit: true,
            },
            {
                ref: 'player/attack/attack_side.png',
                name: 'attack_side',
                amount: 7,
                outfit: true,
            },
            {
                ref: 'player/attack/attack_down.png',
                name: 'attack_down',
                amount: 6,
                outfit: true,
            },
            {
                ref: 'player/attack/attack2_up.png',
                name: 'attack2_up',
                amount: 6,
                outfit: true,
            },
            {
                ref: 'player/attack/attack2_side.png',
                name: 'attack2_side',
                amount: 7,
                outfit: true,
            },
            {
                ref: 'player/attack/attack2_down.png',
                name: 'attack2_down',
                amount: 6,
                outfit: true,
            },
            {
                ref: 'player/spawn/spawn.png',
                name: 'player_spawn',
                amount: 9,
                outfit: true,
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
            },
            {
                ref: 'boss/attack/bullet/judgement_bullet.png',
                name: 'judgement_bullet',
                amount: 4,
            },
            {
                ref: 'boss/death/judgement_death.png',
                name: 'judgement_death',
                amount: 21,
            },
            {
                ref: 'boss/laser/judgement_laser_bullet.png',
                name: 'judgement_laser_bullet',
            },
            {
                ref: 'player/grenade/grenade.png',
                name: 'grenade',
                amount: 11,
            },
            {
                ref: 'player/aim/gun/projectile.png',
                name: 'projectile'
            },
            {
                ref: 'ui/interaction_bar/interaction_bar.png',
                name: 'interaction_bar',
                amount: 4.
            },
            {
                ref: 'world/boss_room.png',
                name: 'map_ground_second',
            },
            {
                ref: 'other/shadow.png',
                name: 'shadow',
            },
        ],
    },
    DEBUG: {
        COLOR: {
            CAMERA_BOX: 'rgb(255, 255, 255, 0.25)'
        }
    }
};

export default GameSettings;
