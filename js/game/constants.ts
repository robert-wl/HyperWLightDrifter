import { Outfit } from './model/utility/enums/Outfit.js';

const GameSettings = {
    GAME: {
        GAME_SCALE: 2,
        GAME_SPEED: 60,
        ELEVATOR: {
            POSITION: {
                X: 950,
                Y: 2000,
            },
        },
        SCREEN_WIDTH: 1920,
        SCREEN_HEIGHT: 1080,
        FOREST_STAGE: {
            FLOOR_WIDTH: 128,
            GENERATE_DISTANCE: 7,
            SETPIECE_TREE_INITIAL_CHANCE: 0.5,
            SETPIECE_ENEMY_INITIAL_CHANCE: 0.15,
            SETPIECE_HEALTH_INITIAL_CHANCE: 0.1,
            SETPIECE_ELEVATOR_INITIAL_CHANCE: 0.001,
            SETPIECE_PLANTS_INITIAL_CHANCE: 0.15,
            SETPIECE_STONES_INITIAL_CHANCE: 0.1,
            SETPIECE_ELEVATOR_MAX_CHANCE: 0.03,
            SPIDER_SPAWN_CHANCE: 0.75,
        },
        MAIN_MENU: {
            SELECTION: {
                IMAGE_OUTFIT_REF: ['../assets/ui/player_select/player-red.png', '../assets/ui/player_select/player-dark.png', '../assets/ui/player_select/player-yellow.png'],
                OUTFIT: [Outfit.default, Outfit.dark, Outfit.yellow],
            },
        },
        ENEMY: {
            CRYSTAL_SPIDER: {
                WIDTH: 66,
                HEIGHT: 50,
                MAX_HEALTH: 1,
                ATTACK_SPEED: 20,
                COIN_DROP_CHANCE: 0.1,
            },
            CRYSTAL_BRUTE: {
                CRYSTAL_SPIKE: {
                    WIDTH: 27,
                    HEIGHT: 45,
                },
                WIDTH: 136,
                HEIGHT: 140,
                MAX_HEALTH: 10,
                SPEED: 3,
                ATTACK_PATTERN: [[0], [0, -1 / 6, 1 / 6], [1 / 10, -1 / 10, 2 / 10, -2 / 10]],
                COIN_DROP_CHANCE: 0.75,
            },
            JUDGEMENT: {
                MOVE_SPEED: 1,
                WIDTH: 260,
                HEIGHT: 358,
                MAX_HEALTH: 100,
                ATTACK_POSITION: [
                    { x: 700, y: 550 },
                    { x: 700, y: 1050 },
                    { x: 1500, y: 550 },
                    { x: 1500, y: 1050 },
                    { x: 1100, y: 800 },
                ],
            },
            JUDGEMENT_BOMB: {
                WIDTH: 40,
                HEIGHT: 40,
                MAX_HEALTH: 5,
                LIFETIME: 300,
                OFFSET: 120,
                SPEED: 3,
            },
            JUDGEMENT_BULLET: {
                WIDTH: 20,
                HEIGHT: 20,
                MAX_HEALTH: 1,
            },
            JUDGEMENT_LASER: {
                WIDTH: 20,
                HEIGHT: 20,
                MAX_HEALTH: 1000,
                MAX_LIFETIME: 200,
                SPEED: 12.5,
            },
        },
        CHEAT_CODES: {
            erwinganteng: 'erwinganteng',
            felix: 'felixmarah',
            phoebus: 'lordpibus',
            hesoyam: 'hesoyam',
            obert: 'oobacachat',
            dutisa: '23-1',
            tatuil: 'tatuil',
            deeplearner: 'deeplearner',
            dbdesigner: 'dbdesigner',
        },
        COLOR: {
            default: [
                [197, 60, 84],
                [213, 108, 98],
                [187, 0, 41],
                [101, 14, 57],
                [166, 212, 52],
            ],
            dark: [
                [26, 8, 32], // 1
                [61, 20, 69],
                [105, 30, 116], //3
                [35, 35, 35],
                [213, 85, 24],
            ],
            yellow: [
                [249, 171, 9],
                [247, 199, 10],
                [21, 21, 21],
                [68, 23, 9],
                [70, 85, 255],
            ],
        },
    },
    PLAYER: {
        MAX_IMMUNITY: 30,
        MAX_HEALTH: 6,
        MAX_HEALTHPACKS: 3,
        MAX_STAMINA: 100,
        MAX_BOMBS: 2,
        MAX_BULLETS: 3,
        FRICTION: 0.2,
        MAX_SPEED: 4,
        ATTACK_MOVE_SPEED: 2,
        DASH_MOVE_SPEED: 12,
        START_POSITION: {
            x: 200,
            y: 200,
        },
        IS_INVULNERABLE: false,
        INTERACTION_MAX_DISTANCE: 200,
        DAMAGE: {
            HIT: 1,
            BULLET: 2,
            GRENADE: 5,
            SELF: 1,
            SELF_BOMB: 3,
        },
        GRENADE: {
            WIDTH: 16,
            HEIGHT: 16,
            VELOCITY: 10,
        },
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
        EFFECT_DISTANCE: 40,
        SHADOW_OFFSET: {
            X: -24.5,
            Y: -5,
        },
    },
    ASSETS: {
        SPAWN: [
            {
                ref: 'particles/firefly/fireflies.png',
                name: 'fireflies',
                amount: 4,
            },
            {
                ref: 'menu/action.wav',
                name: 'menu_action_audio',
                isAudio: true,
            },
            {
                ref: 'menu/move.wav',
                name: 'menu_move_audio',
                isAudio: true,
            },
            {
                ref: 'menu/background.ogg',
                name: 'menu_background_audio',
                isAudio: true,
            },
        ],
        PLAYER: [
            {
                ref: 'player/aim/gun/railgun.png',
                name: 'railgun',
            },
            {
                ref: 'player/aim/aim_top.png',
                name: 'aim_top',
                isOutfit: true,
            },
            {
                ref: 'player/aim/aim_bottom.png',
                name: 'aim_bottom',
                isOutfit: true,
            },
            {
                ref: 'player/move/up/move_up.png',
                name: 'move_up',
                amount: 12,
                isOutfit: true,
            },
            {
                ref: 'player/move/down/move_down.png',
                name: 'move_down',
                amount: 12,
                isOutfit: true,
            },
            {
                ref: 'player/move/left/move_left.png',
                name: 'move_left',
                amount: 12,
                isOutfit: true,
            },
            {
                ref: 'player/move/right/move_right.png',
                name: 'move_right',
                amount: 12,
                isOutfit: true,
            },
            {
                ref: 'player/idle/idle_up.png',
                name: 'idle_up',
                isOutfit: true,
            },
            {
                ref: 'player/idle/idle_left.png',
                name: 'idle_left',
                isOutfit: true,
            },
            {
                ref: 'player/idle/idle_right.png',
                name: 'idle_right',
                isOutfit: true,
            },
            {
                ref: 'player/idle/idle_down.png',
                name: 'idle_down',
                isOutfit: true,
            },
            {
                ref: 'player/hurt/player_hurt.png',
                name: 'player_hurt',
                amount: 3,
                isOutfit: true,
            },
            {
                ref: 'player/dash/animation/dash_animation.png',
                name: 'dash_animation',
                amount: 4,
                isOutfit: true,
            },
            {
                ref: 'player/dash/down/dash.png',
                name: 'dash_down',
                amount: 11,
                isOutfit: true,
            },
            {
                ref: 'player/dash/side/dash.png',
                name: 'dash_side',
                amount: 11,
                isOutfit: true,
            },
            {
                ref: 'player/dash/up/dash.png',
                name: 'dash_up',
                amount: 11,
                isOutfit: true,
            },
            {
                ref: 'player/attack/up/attack.png',
                name: 'attack_up',
                amount: 11,
                isOutfit: true,
            },
            {
                ref: 'player/attack/side/attack.png',
                name: 'attack_side',
                amount: 19,
                isOutfit: true,
            },
            {
                ref: 'player/attack/down/attack.png',
                name: 'attack_down',
                amount: 11,
                isOutfit: true,
            },
            {
                ref: 'player/attack_two/up/attack.png',
                name: 'attack_two_up',
                amount: 11,
                isOutfit: true,
            },
            {
                ref: 'player/attack_two/side/attack.png',
                name: 'attack_two_side',
                amount: 19,
                isOutfit: true,
            },
            {
                ref: 'player/attack_two/down/attack.png',
                name: 'attack_two_down',
                amount: 11,
                isOutfit: true,
            },
            {
                ref: 'player/spawn/spawn.png',
                name: 'player_spawn',
                amount: 15,
                isOutfit: true,
            },
            {
                ref: 'player/aim/aim_side.png',
                name: 'aim_side',
                isOutfit: true,
            },
            {
                ref: 'player/aim/gun/ray.png',
                name: 'gun_ray',
            },
            {
                ref: 'player/aim/gun/impact.png',
                name: 'gun_impact',
                amount: 2,
            },
            {
                ref: 'player/grenade/grenade.png',
                name: 'grenade',
                amount: 11,
            },
            {
                ref: 'player/grenade/throw/side/throw.png',
                name: 'player_throw_side',
                amount: 8,
                isOutfit: true,
            },
            {
                ref: 'player/grenade/throw/down/throw.png',
                name: 'player_throw_down',
                amount: 8,
                isOutfit: true,
            },
            {
                ref: 'player/grenade/throw/up/throw.png',
                name: 'player_throw_up',
                amount: 8,
                isOutfit: true,
            },
            {
                ref: 'player/death/death.png',
                name: 'player_death',
                amount: 6,
                isOutfit: true,
            },
            {
                ref: 'ui/damaged.png',
                name: 'damaged_ui',
            },
            {
                ref: 'player/medkit/use.wav',
                name: 'player_medkit_use_audio',
                isAudio: true,
            },
            {
                ref: 'player/coin/pickup.wav',
                name: 'player_coin_pickup_audio',
                isAudio: true,
            },
            {
                ref: 'player/gun_fire.wav',
                name: 'player_gun_fire_audio',
                isAudio: true,
            },
            {
                ref: 'player/gun_aim.wav',
                name: 'player_gun_aim_audio',
                isAudio: true,
            },
            {
                ref: 'player/interact.wav',
                name: 'player_interact_audio',
                isAudio: true,
            },
            {
                ref: 'player/grenade/explode.wav',
                name: 'player_grenade_explode_audio',
                isAudio: true,
            },
            {
                ref: 'player/grenade/throw.wav',
                name: 'player_grenade_throw_audio',
                isAudio: true,
            },
            {
                ref: 'player/dash.wav',
                name: 'player_dash_audio',
                isAudio: true,
            },
            {
                ref: 'player/attack_1.wav',
                name: 'player_attack_one_audio',
                isAudio: true,
            },
            {
                ref: 'player/attack_2.wav',
                name: 'player_attack_two_audio',
                isAudio: true,
            },
            {
                ref: 'player/death.wav',
                name: 'player_death_audio',
                isAudio: true,
            },
            {
                ref: 'player/footstep_1.wav',
                name: 'player_footstep_one_audio',
                isAudio: true,
            },
            {
                ref: 'player/footstep_2.wav',
                name: 'player_footstep_two_audio',
                isAudio: true,
            },
            {
                ref: 'player/teleport_arrive.wav',
                name: 'player_teleport_arrive_audio',
                isAudio: true,
            },
            {
                ref: 'player/hurt.wav',
                name: 'player_hurt_audio',
                isAudio: true,
            },
        ],
        STAGE_ONE: [
            {
                ref: 'particles/firefly/fireflies.png',
                name: 'fireflies',
                amount: 4,
            },
            {
                ref: 'ui/interaction_bar/interaction_bar.png',
                name: 'interaction_bar',
                amount: 4,
            },
            {
                ref: 'world/elevator/elevator.png',
                name: 'elevator',
            },
            {
                ref: 'world/elevator/lock.png',
                name: 'lock',
            },
            {
                ref: 'world/forest/set_pieces/plant/plant.png',
                name: 'set_pieces_plants',
                amount: 5,
            },
            {
                ref: 'world/forest/set_pieces/stone/big/stone.png',
                name: 'set_pieces_stone_big',
                amount: 3,
            },
            {
                ref: 'world/forest/set_pieces/stone/small/stone.png',
                name: 'set_pieces_stone_small',
                amount: 5,
            },
            {
                ref: 'enemy/crystal_brute/idle/idle.png',
                name: 'crystal_brute_idle',
            },
            {
                ref: 'enemy/crystal_brute/walk/crystal_brute_walk.png',
                name: 'crystal_brute_walk',
                amount: 6,
            },
            {
                ref: 'enemy/crystal_brute/attack/attack.png',
                name: 'crystal_brute_attack',
                amount: 20,
            },
            {
                ref: 'enemy/crystal_brute/die/crystal_brute_die.png',
                name: 'crystal_brute_die',
            },
            {
                ref: 'enemy/crystal_brute/spike/spike.png',
                name: 'crystal_spike',
                amount: 11,
            },
            {
                ref: 'enemy/crystal_spider/idle/idle.png',
                name: 'crystal_spider_idle',
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
                ref: 'other/shadow/shadow.png',
                name: 'shadow',
            },
            {
                ref: 'world/forest/floor/floor.png',
                name: 'forest_floor',
                amount: 8,
            },
            {
                ref: 'world/forest/floor/floor_elevator.png',
                name: 'forest_floor_elevator',
            },
            {
                ref: 'world/forest/set_pieces/tree/tree.png',
                name: 'set_pieces_tree',
                amount: 8,
            },
            {
                ref: 'world/forest/set_pieces/enemy/enemy.png',
                name: 'set_pieces_enemy',
                amount: 7,
            },
            {
                ref: 'world/forest/set_pieces/health/health.png',
                name: 'set_pieces_health',
                amount: 5,
            },
            {
                ref: 'other/medkit/medkit.png',
                name: 'medkit',
                amount: 2,
            },
            {
                ref: 'other/keys/keys.png',
                name: 'keys',
                amount: 6,
            },
            {
                ref: 'ui/HUD.png',
                name: 'HUD',
            },
            {
                ref: 'enemy/crystal_spider/attack.wav',
                name: 'crystal_spider_attack_audio',
                isAudio: true,
            },
            {
                ref: 'enemy/crystal_spider/death.wav',
                name: 'crystal_spider_death_audio',
                isAudio: true,
            },
            {
                ref: 'enemy/crystal_spider/hurt.wav',
                name: 'crystal_spider_hurt_audio',
                isAudio: true,
            },
            {
                ref: 'enemy/crystal_spider/walk.wav',
                name: 'crystal_spider_walk_audio',
                isAudio: true,
            },
            {
                ref: 'enemy/crystal_brute/spike_spawn.wav',
                name: 'crystal_brute_spike_spawn_audio',
                isAudio: true,
            },
            {
                ref: 'enemy/crystal_brute/walk.wav',
                name: 'crystal_brute_walk_audio',
                isAudio: true,
            },
            {
                ref: 'enemy/crystal_brute/hurt.wav',
                name: 'crystal_brute_hurt_audio',
                isAudio: true,
            },
            {
                ref: 'enemy/crystal_brute/death.wav',
                name: 'crystal_brute_death_audio',
                isAudio: true,
            },
            {
                ref: 'forest_stage/background.ogg',
                name: 'forest_stage_background_audio',
                isAudio: true,
            },
            {
                ref: 'elevator/move.wav',
                name: 'elevator_move_audio',
                isAudio: true,
            },
            {
                ref: 'elevator/mount.wav',
                name: 'elevator_mount_audio',
                isAudio: true,
            },
        ],
        STAGE_TWO: [
            {
                ref: 'boss/bomb/judgement_bomb.png',
                name: 'judgement_bomb',
                amount: 11,
            },
            {
                ref: 'boss/bomb/explosion/judgement_explosion.png',
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
                ref: 'boss/laser/bullet/judgement_laser_bullet.png',
                name: 'judgement_laser_bullet',
            },
            {
                ref: 'ui/interaction_bar/interaction_bar.png',
                name: 'interaction_bar',
                amount: 4,
            },
            {
                ref: 'world/boss/boss_room.png',
                name: 'map_ground_second',
            },
            {
                ref: 'other/shadow/shadow.png',
                name: 'shadow',
            },
            {
                ref: 'elevator/move.wav',
                name: 'elevator_move_audio',
                isAudio: true,
            },
            {
                ref: 'elevator/mount.wav',
                name: 'elevator_mount_audio',
                isAudio: true,
            },
            {
                ref: 'boss/scream.wav',
                name: 'judgement_scream_audio',
                isAudio: true,
            },
            {
                ref: 'boss/hurt.wav',
                name: 'judgement_hurt_audio',
                isAudio: true,
            },
            {
                ref: 'boss/bullet.wav',
                name: 'judgement_bullet_audio',
                isAudio: true,
            },
            {
                ref: 'boss/laser.wav',
                name: 'judgement_laser_audio',
                isAudio: true,
            },
            {
                ref: 'boss/bomb_summon.wav',
                name: 'judgement_bomb_summon_audio',
                isAudio: true,
            },
            {
                ref: 'boss/smash_ground.wav',
                name: 'judgement_smash_ground_audio',
                isAudio: true,
            },
            {
                ref: 'boss/death.wav',
                name: 'judgement_death_audio',
                isAudio: true,
            },
            {
                ref: 'boss/spawn.wav',
                name: 'judgement_spawn_audio',
                isAudio: true,
            },
            {
                ref: 'boss_stage/background.ogg',
                name: 'boss_stage_background_audio',
                isAudio: true,
            },
        ],
    },
    DEBUG: {
        COLOR: {
            CAMERA_BOX: 'rgb(255, 255, 255, 0.25)',
        },
    },
};

export default GameSettings;
