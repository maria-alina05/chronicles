import { BaseLevel } from './BaseLevel.js';

export class Level2Scene extends BaseLevel {
    constructor() {
        super('Level2Scene', 1);
    }

    getEnemyTypes() {
        return ['bmw', 'bmw', 'email', 'teams', 'paper'];
    }

    createBackground() {
        const { width, height } = this.cameras.main;
        
        // Office interior
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x2a2a3e, 0x2a2a3e, 0x1a1a2e, 0x1a1a2e);
        bg.fillRect(0, 0, width, height);
        
        // Office windows
        for (let x = 80; x < width; x += 140) {
            for (let y = 60; y < height - 80; y += 100) {
                this.add.rectangle(x, y, 50, 35, 0x334455, 0.25);
                for (let b = 0; b < 3; b++) {
                    this.add.rectangle(x, y - 10 + b * 12, 45, 2, 0x556677, 0.15);
                }
            }
        }
        
        // Fluorescent lights
        for (let x = 120; x < width; x += 250) {
            const light = this.add.rectangle(x, 30, 60, 4, 0xccffcc, 0.3);
            this.tweens.add({
                targets: light, alpha: 0.15, duration: Phaser.Math.Between(2000, 4000),
                yoyo: true, repeat: -1
            });
        }
        
        // Cubicle walls
        for (let x = 0; x < width; x += 200) {
            const cub = this.add.graphics();
            cub.fillStyle(0x666688, 0.15);
            cub.fillRect(x, height - 120, 5, 80);
            cub.fillRect(x, height - 120, 70, 5);
        }
    }

    createEasterEggs() {
        const { width, height } = this.cameras.main;
        
        // Civ 6 reference
        this.add.rectangle(width - 150, height - 60, 130, 20, 0x000022, 0.5);
        const civText = this.add.text(width - 150, height - 60, '"One more turn..."', {
            fontFamily: '"Press Start 2P"', fontSize: '7px', color: '#aaccff'
        }).setOrigin(0.5);
        this.tweens.add({ targets: civText, alpha: 0.3, duration: 1500, yoyo: true, repeat: -1 });
        
        // BMW logo (subtle)
        const bmw = this.add.graphics();
        bmw.lineStyle(1, 0xffffff, 0.3);
        bmw.strokeCircle(60, 60, 14);
        bmw.fillStyle(0x0066bb, 0.3);
        bmw.fillRect(60, 46, 12, 12);
        bmw.fillRect(48, 58, 12, 12);
        this.add.text(60, 80, 'BMW', {
            fontFamily: '"Press Start 2P"', fontSize: '7px', color: '#4488cc'
        }).setOrigin(0.5).setAlpha(0.4);
    }

    getLevelDialogs() {
        return [
            { speaker: 'zanuff', text: "First day at BMW! Don't crash anything." },
            { speaker: 'marabeige', text: "My inbox has 347 unread emails..." },
            { speaker: 'zanuff', text: "Is that a Teams call? RUN!" },
            { speaker: 'marabeige', text: "At least we sit next to each other!" },
            { speaker: 'zanuff', text: "Friday already?? Let's go!" }
        ];
    }
}
