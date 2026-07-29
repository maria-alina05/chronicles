import { BaseLevel } from './BaseLevel.js';

export class Level5Scene extends BaseLevel {
    constructor() {
        super('Level5Scene', 4);
    }

    getEnemyTypes() {
        return ['wedding', 'wedding', 'paper', 'doubt'];
    }

    createBackground() {
        const { width, height } = this.cameras.main;
        
        // City hall - blue sky
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x87ceeb, 0x87ceeb, 0x4a90d9, 0x4a90d9);
        bg.fillRect(0, 0, width, height);
        
        // City buildings
        for (let x = 0; x < width; x += 80) {
            const bh = Phaser.Math.Between(80, 180);
            const bw = Phaser.Math.Between(40, 60);
            this.add.rectangle(x, height - bh / 2, bw, bh,
                Phaser.Math.Between(0, 1) ? 0x445566 : 0x556677, 0.25
            );
            // Windows
            for (let wy = height - bh + 10; wy < height - 20; wy += 20) {
                for (let wx = x - bw / 4; wx < x + bw / 4; wx += 14) {
                    this.add.rectangle(wx, wy, 6, 8, 0xffee88, 0.2);
                }
            }
        }
        
        // Confetti
        for (let i = 0; i < 15; i++) {
            const conf = this.add.rectangle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                3, 6, Phaser.Math.Between(0, 0xffffff)
            ).setAlpha(0.25);
            this.tweens.add({
                targets: conf, y: conf.y + 150, angle: 360, alpha: 0,
                duration: Phaser.Math.Between(3000, 6000), repeat: -1
            });
        }
    }

    createEasterEggs() {
        const { width, height } = this.cameras.main;
        
        // MARRIED badge
        const badge = this.add.text(width - 80, height - 40, 'MARRIED!', {
            fontFamily: '"Press Start 2P"', fontSize: '10px', color: '#ffd700'
        }).setOrigin(0.5).setAlpha(0.5);
        this.tweens.add({ targets: badge, scale: 1.2, duration: 600, yoyo: true, repeat: -1 });
        
        // Palworld sphere
        const sphere = this.add.graphics();
        sphere.fillStyle(0x4488ff, 0.3);
        sphere.fillCircle(80, height - 40, 12);
        sphere.fillStyle(0xffffff, 0.3);
        sphere.fillCircle(80, height - 40, 6);
        this.add.text(80, height - 60, 'Catch rate: 100%', {
            fontFamily: '"Press Start 2P"', fontSize: '6px', color: '#88ccff'
        }).setOrigin(0.5).setAlpha(0.4);
    }

    getLevelDialogs() {
        return [
            { speaker: 'marabeige', text: "Today's the day! I'm so nervous!" },
            { speaker: 'zanuff', text: "Paperwork golem ahead! So realistic." },
            { speaker: 'marabeige', text: "Did you bring the documents??" },
            { speaker: 'zanuff', text: "I'd rather fight a Pal than fill forms." },
            { speaker: 'marabeige', text: "I DO!" }
        ];
    }
}
