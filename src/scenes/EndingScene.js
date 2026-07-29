import { GAME_DATA, COLORS } from '../constants.js';

export class EndingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndingScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        this.cameras.main.fadeIn(1000);

        // Starry night background
        this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a1e);
        
        for (let i = 0; i < 150; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                Phaser.Math.Between(1, 2),
                0xffffff,
                Phaser.Math.FloatBetween(0.2, 0.9)
            );
            this.tweens.add({
                targets: star,
                alpha: 0.1,
                duration: Phaser.Math.Between(1000, 4000),
                yoyo: true,
                repeat: -1
            });
        }

        // Wedding scene title
        const ending = GAME_DATA.ending;
        
        this.add.text(width / 2, 40, ending.date, {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#ffd700'
        }).setOrigin(0.5);

        this.add.text(width / 2, 65, ending.title, {
            fontFamily: '"Press Start 2P"',
            fontSize: '20px',
            color: '#e94560'
        }).setOrigin(0.5);

        // Wedding scene - characters together with all companions
        const zanuff = this.add.image(width / 2 - 30, 200, 'zanuff-jump').setScale(3);
        const marabeige = this.add.image(width / 2 + 30, 205, 'marabeige-jump').setScale(3);
        
        // Floating together
        this.tweens.add({
            targets: [zanuff, marabeige],
            y: '-=8',
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Big heart between them
        const heart = this.add.image(width / 2, 175, 'heart').setScale(1.2);
        this.tweens.add({
            targets: heart,
            scale: 1.5,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Dogs at their feet
        this.add.image(width / 2 - 70, 245, 'dog-frenchie').setScale(1.5);
        this.add.image(width / 2 + 70, 245, 'dog-pug').setScale(1.5);

        // Fireworks
        this.time.addEvent({
            delay: 1200,
            loop: true,
            callback: () => this.createFirework(
                Phaser.Math.Between(100, width - 100),
                Phaser.Math.Between(50, 150)
            )
        });

        // Scrolling story text
        const lines = ending.lines;
        let currentY = 310;
        
        lines.forEach((line, i) => {
            const text = this.add.text(width / 2, currentY + i * 35, line, {
                fontFamily: '"Press Start 2P"',
                fontSize: '9px',
                color: i === lines.length - 1 ? '#e94560' : '#ccccee',
                wordWrap: { width: 700 },
                align: 'center'
            }).setOrigin(0.5).setAlpha(0);

            this.tweens.add({
                targets: text,
                alpha: 1,
                duration: 800,
                delay: 2000 + i * 1500
            });
        });

        // Song credit at the very end
        const songText = this.add.text(width / 2, height - 40, '"Mad About You" - Hooverphonic', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#ffd700'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: songText,
            alpha: 1,
            duration: 1000,
            delay: 2000 + lines.length * 1500
        });

        // Back to title after all text shown
        const replayText = this.add.text(width / 2, height - 15, 'Tap or press ENTER to replay', {
            fontFamily: '"Press Start 2P"',
            fontSize: '7px',
            color: '#666688'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: replayText,
            alpha: 1,
            duration: 500,
            delay: 3000 + lines.length * 1500,
            onComplete: () => {
                this.tweens.add({
                    targets: replayText,
                    alpha: 0.3,
                    duration: 600,
                    yoyo: true,
                    repeat: -1
                });
            }
        });

        if (this.input.keyboard) this.input.keyboard.on('keydown-ENTER', () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => {
                this.scene.start('TitleScene');
            });
        });
        this.input.on('pointerdown', () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => {
                this.scene.start('TitleScene');
            });
        });

        // Continuous hearts rising
        this.time.addEvent({
            delay: 600,
            loop: true,
            callback: () => {
                const hx = Phaser.Math.Between(50, width - 50);
                const h = this.add.image(hx, height + 20, 'heart').setScale(0.4).setAlpha(0.5);
                this.tweens.add({
                    targets: h,
                    y: -30,
                    alpha: 0,
                    duration: 4000,
                    onComplete: () => h.destroy()
                });
            }
        });
    }

    createFirework(x, y) {
        const colors = [0xff4444, 0xffaa00, 0xff44ff, 0x44ff44, 0x4444ff, 0xffd700];
        const color = Phaser.Utils.Array.GetRandom(colors);
        
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const dist = Phaser.Math.Between(20, 50);
            const particle = this.add.circle(x, y, 3, color);
            
            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist,
                alpha: 0,
                scale: 0,
                duration: 800,
                ease: 'Cubic.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }
}
