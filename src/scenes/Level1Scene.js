import { BaseLevel } from './BaseLevel.js';

export class Level1Scene extends BaseLevel {
    constructor() {
        super('Level1Scene', 0);
    }

    getEnemyTypes() {
        return ['mcdonalds', 'mcdonalds', 'doubt', 'generic'];
    }

    createBackground() {
        const { width, height } = this.cameras.main;
        
        // Evening park / twilight sky
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a0533, 0x1a0533, 0x2d1b69, 0x2d1b69);
        bg.fillRect(0, 0, width, height);
        
        // Stars
        for (let i = 0; i < 40; i++) {
            this.add.circle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height * 0.5),
                Phaser.Math.Between(1, 2),
                0xffffff,
                Phaser.Math.FloatBetween(0.3, 0.7)
            );
        }
        
        // Moon
        this.add.circle(width - 120, 80, 25, 0xfffde8, 0.7);
        
        // Background trees scattered
        for (let i = 0; i < 8; i++) {
            const tx = Phaser.Math.Between(40, width - 40);
            const ty = Phaser.Math.Between(height * 0.4, height - 60);
            const tree = this.add.graphics();
            tree.fillStyle(0x4a3218, 0.3);
            tree.fillRect(tx - 4, ty, 8, 30);
            tree.fillStyle(0x1a4d1a, 0.25);
            tree.fillCircle(tx, ty - 10, 20);
        }
        
        // Park benches (decorative)
        for (let i = 0; i < 3; i++) {
            const bx = Phaser.Math.Between(100, width - 100);
            const by = Phaser.Math.Between(height * 0.6, height - 40);
            const bench = this.add.graphics();
            bench.fillStyle(0x8b6914, 0.25);
            bench.fillRect(bx - 15, by, 30, 5);
            bench.fillRect(bx - 15, by - 10, 30, 5);
        }
    }

    createEasterEggs() {
        const { width, height } = this.cameras.main;
        
        // McDonald's near the start
        const mcX = 80;
        const mcY = height - 50;
        const mcGfx = this.add.graphics();
        mcGfx.fillStyle(0xcc0000, 0.4);
        mcGfx.fillRect(mcX - 14, mcY - 30, 28, 22);
        mcGfx.fillStyle(0xffcc00, 0.5);
        mcGfx.fillRect(mcX - 8, mcY - 26, 4, 14);
        mcGfx.fillRect(mcX + 4, mcY - 26, 4, 14);
        this.add.text(mcX, mcY - 40, "McDonald's!", {
            fontFamily: '"Press Start 2P"', fontSize: '7px', color: '#ffcc00'
        }).setOrigin(0.5).setAlpha(0.7);
        
        // Baldur's Gate D20
        const d20 = this.add.text(width - 100, 100, 'D20', {
            fontFamily: '"Press Start 2P"', fontSize: '12px', color: '#ff6666'
        }).setOrigin(0.5).setAlpha(0.4);
        this.tweens.add({ targets: d20, scale: 1.15, duration: 600, yoyo: true, repeat: -1 });
    }

    getLevelDialogs() {
        return [
            { speaker: 'zanuff', text: "Where are we?? This isn't the stream..." },
            { speaker: 'marabeige', text: "I want McNuggets!" },
            { speaker: 'zanuff', text: "Roll for initiative! Wait, wrong game." },
            { speaker: 'marabeige', text: "Watch out! Doubt clouds everywhere!" },
            { speaker: 'zanuff', text: "I miss our McDonald's already..." }
        ];
    }
}
