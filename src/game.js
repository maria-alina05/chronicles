import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { CharacterSelectScene } from './scenes/CharacterSelectScene.js';
import { StoryScene } from './scenes/StoryScene.js';
import { BaseLevel } from './scenes/BaseLevel.js';
import { EndingScene } from './scenes/EndingScene.js';

// Create level instances from BaseLevel
class Level1Scene extends BaseLevel { constructor() { super('Level1Scene', 0); } }
class Level2Scene extends BaseLevel { constructor() { super('Level2Scene', 1); } }
class Level3Scene extends BaseLevel { constructor() { super('Level3Scene', 2); } }
class Level4Scene extends BaseLevel { constructor() { super('Level4Scene', 3); } }
class Level5Scene extends BaseLevel { constructor() { super('Level5Scene', 4); } }
class Level6Scene extends BaseLevel { constructor() { super('Level6Scene', 5); } }

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 960,
    height: 540,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        BootScene,
        TitleScene,
        CharacterSelectScene,
        StoryScene,
        Level1Scene,
        Level2Scene,
        Level3Scene,
        Level4Scene,
        Level5Scene,
        Level6Scene,
        EndingScene
    ]
};

const game = new Phaser.Game(config);
