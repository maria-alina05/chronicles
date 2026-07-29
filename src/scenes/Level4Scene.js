import { BaseLevel } from './BaseLevel.js';

export class Level4Scene extends BaseLevel {
    constructor() {
        super('Level4Scene', 3);
    }

    getEnemyTypes() {
        return ['ring', 'ring', 'butterfly', 'doubt'];
    }

    createBackground() {
        const { width, height } = this.cameras.main;
        
        // Romantic evening - sunset
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a0033, 0x330044, 0xff6644, 0xff8866);
        bg.fillRect(0, 0, width, height);
        
        // Big moon
        this.add.circle(width - 150, 100, 40, 0xffd700, 0.5);
        
        // Floating pixel hearts
        for (let i = 0; i < 15; i++) {
            const hx = Phaser.Math.Between(0, width);
            const hy = Phaser.Math.Between(0, height);
            const heartGfx = this.add.graphics();
            const s = Phaser.Math.Between(2, 5);
            heartGfx.fillStyle(0xff4488, 0.15);
            heartGfx.fillCircle(hx - s, hy, s);
            heartGfx.fillCircle(hx + s, hy, s);
            heartGfx.fillTriangle(hx - s * 2, hy + 1, hx + s * 2, hy + 1, hx, hy + s * 2.5);
            this.tweens.add({
                targets: heartGfx, y: -20, alpha: 0,
                duration: Phaser.Math.Between(4000, 8000), yoyo: true, repeat: -1,
                delay: Phaser.Math.Between(0, 3000)
            });
        }
        
        // Candles
        for (let x = 80; x < width; x += 120) {
            const candleGfx = this.add.graphics();
            candleGfx.fillStyle(0xffffff, 0.3);
            candleGfx.fillRect(x - 1, height - 30, 3, 8);
            candleGfx.fillStyle(0xff8800, 0.3);
            candleGfx.fillCircle(x, height - 32, 3);
            const glow = this.add.circle(x, height - 32, 10, 0xff8800, 0.08);
            this.tweens.add({
                targets: glow, scale: 1.3, alpha: 0.03,
                duration: 800, yoyo: true, repeat: -1
            });
        }
    }

    createEasterEggs() {
        const { width, height } = this.cameras.main;
        
        // Pikachu
        const pika = this.add.graphics();
        pika.fillStyle(0xffdd00, 0.35);
        pika.fillCircle(width - 60, height - 60, 10);
        pika.fillStyle(0xff4444, 0.3);
        pika.fillCircle(width - 64, height - 57, 2);
        pika.fillCircle(width - 56, height - 57, 2);
        this.add.text(width - 60, height - 78, 'Pika!', {
            fontFamily: '"Press Start 2P"', fontSize: '6px', color: '#ffdd00'
        }).setOrigin(0.5).setAlpha(0.5);
        
        // Pokemon Ball at the end - proposal!
        const ballX = width - 80;
        const ballY = 80;
        const ball = this.add.graphics();
        ball.fillStyle(0xcc0000, 0.5);
        ball.fillCircle(ballX, ballY, 12);
        ball.fillStyle(0xffffff, 0.5);
        ball.fillRect(ballX - 12, ballY, 24, 12);
        ball.fillStyle(0xffffff, 0.5);
        ball.fillCircle(ballX, ballY, 4);
        const ballGlow = this.add.circle(ballX, ballY, 18, 0xff4444, 0.15);
        this.tweens.add({ targets: ballGlow, scale: 1.4, alpha: 0, duration: 1000, yoyo: true, repeat: -1 });
    }

    getLevelDialogs() {
        return [
            { speaker: 'zanuff', text: "One year since we found each other..." },
            { speaker: 'marabeige', text: "Why are there so many butterflies??" },
            { speaker: 'zanuff', text: "Those are MY butterflies. Nervous ones." },
            { speaker: 'marabeige', text: "Is that a Pokemon ball?!" },
            { speaker: 'zanuff', text: "I choose you. Forever." }
        ];
    }
}
