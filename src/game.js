import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { CharacterSelectScene } from './scenes/CharacterSelectScene.js';
import { StoryScene } from './scenes/StoryScene.js';
import { Level1Scene } from './scenes/Level1Scene.js';
import { Level2Scene } from './scenes/Level2Scene.js';
import { Level3Scene } from './scenes/Level3Scene.js';
import { Level4Scene } from './scenes/Level4Scene.js';
import { Level5Scene } from './scenes/Level5Scene.js';
import { Level6Scene } from './scenes/Level6Scene.js';
import { EndingScene } from './scenes/EndingScene.js';

// Detect orientation and set game dimensions accordingly
const isLandscape = window.innerWidth > window.innerHeight;
const gameWidth = isLandscape ? 960 : 540;
const gameHeight = isLandscape ? 540 : 960;

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: gameWidth,
    height: gameHeight,
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

// Reload on orientation change to re-initialize with correct dimensions
window.addEventListener('orientationchange', () => {
    setTimeout(() => window.location.reload(), 200);
});
window.addEventListener('resize', () => {
    const nowLandscape = window.innerWidth > window.innerHeight;
    if (nowLandscape !== isLandscape) {
        setTimeout(() => window.location.reload(), 200);
    }
});
