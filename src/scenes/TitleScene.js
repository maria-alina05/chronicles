import { GAME_DATA, COLORS } from '../constants.js';

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        
        // Starry background
        for (let i = 0; i < 100; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                Phaser.Math.Between(1, 2),
                0xffffff,
                Phaser.Math.FloatBetween(0.3, 1)
            );
            this.tweens.add({
                targets: star,
                alpha: 0.2,
                duration: Phaser.Math.Between(1000, 3000),
                yoyo: true,
                repeat: -1
            });
        }

        // Title
        const title = this.add.text(width / 2, 120, 'The Chronicles of', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#aaaacc'
        }).setOrigin(0.5);

        const names = this.add.text(width / 2, 160, 'Zanuff & Marabeige', {
            fontFamily: '"Press Start 2P"',
            fontSize: '28px',
            color: '#e94560'
        }).setOrigin(0.5);

        // Glow effect on names
        this.tweens.add({
            targets: names,
            alpha: 0.7,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Song quote
        this.add.text(width / 2, 210, '"Mad About You" - Hooverphonic', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#ffd700'
        }).setOrigin(0.5);

        // Characters standing together
        const zanuff = this.add.image(width / 2 - 40, 310, 'zanuff').setScale(2.5);
        const marabeige = this.add.image(width / 2 + 40, 315, 'marabeige').setScale(2.5);
        
        // Heart between them
        const heart = this.add.image(width / 2, 280, 'heart').setScale(1);
        this.tweens.add({
            targets: heart,
            scale: 1.3,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Dogs at their feet
        const frenchie = this.add.image(width / 2 - 80, 380, 'dog-frenchie').setScale(1.8);
        const pug = this.add.image(width / 2 + 80, 380, 'dog-pug').setScale(1.8);

        // Floating animation for characters
        this.tweens.add({
            targets: [zanuff, marabeige],
            y: '-=5',
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Start prompt
        const startText = this.add.text(width / 2, 440, 'Tap to start', {
            fontFamily: '"Press Start 2P"',
            fontSize: '11px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: startText,
            alpha: 0,
            duration: 600,
            yoyo: true,
            repeat: -1
        });

        // Controls info
        this.add.text(width / 2, 490, 'WASD / Arrows / Touch to move', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#666688'
        }).setOrigin(0.5);

        this.add.text(width / 2, 510, 'A love story survival game', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#666688'
        }).setOrigin(0.5);

        // Input
        const startGame = () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('CharacterSelectScene');
            });
        };
        if (this.input.keyboard) this.input.keyboard.on('keydown-ENTER', startGame);
        this.input.on('pointerdown', startGame);
    }
}
