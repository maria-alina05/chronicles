import { createPlayerSprites, createEnemySprites, createItemSprites, createTileSprites } from '../sprites/SpriteFactory.js';

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    create() {
        // Generate all sprite textures
        createPlayerSprites(this);
        createEnemySprites(this);
        createItemSprites(this);
        createTileSprites(this);

        // Create a simple loading animation
        const text = this.add.text(480, 270, 'Loading...', {
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            color: '#e94560'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: text,
            alpha: 0,
            duration: 500,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                this.scene.start('TitleScene');
            }
        });
    }
}
