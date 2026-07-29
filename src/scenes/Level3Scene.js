import { BaseLevel } from './BaseLevel.js';

export class Level3Scene extends BaseLevel {
    constructor() {
        super('Level3Scene', 2);
    }

    getEnemyTypes() {
        return ['tourist', 'tourist', 'generic', 'butterfly'];
    }

    createBackground() {
        const { width, height } = this.cameras.main;
        
        // Bright vacation sky
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x4a90d9, 0x87ceeb, 0x87ceeb, 0xaee8f0);
        bg.fillRect(0, 0, width, height);
        
        // Sun
        this.add.circle(120, 70, 30, 0xffdd00, 0.6);
        for (let i = 0; i < 8; i++) {
            const ray = this.add.rectangle(120, 70, 3, 45, 0xffdd00, 0.15);
            ray.setAngle(i * 45);
        }
        
        // Landmarks in background
        // Church
        const church = this.add.graphics();
        church.fillStyle(0xd4a574, 0.25);
        church.fillRect(width - 140, 60, 40, 80);
        church.fillStyle(0x8b6914, 0.25);
        church.fillTriangle(width - 140, 60, width - 120, 20, width - 100, 60);
        
        // Palm trees
        for (let px = 150; px < width; px += 280) {
            const palm = this.add.graphics();
            palm.fillStyle(0x6b4226, 0.2);
            palm.fillRect(px, height - 100, 6, 60);
            palm.fillStyle(0x228b22, 0.2);
            palm.fillTriangle(px - 18, height - 100, px + 3, height - 120, px + 24, height - 100);
        }
        
        // Clouds
        for (let i = 0; i < 5; i++) {
            const cx = Phaser.Math.Between(0, width);
            const cy = Phaser.Math.Between(30, 120);
            this.add.circle(cx, cy, 15, 0xffffff, 0.4);
            this.add.circle(cx + 12, cy - 4, 10, 0xffffff, 0.4);
            this.add.circle(cx - 10, cy + 2, 12, 0xffffff, 0.4);
        }
    }

    createEasterEggs() {
        const { width, height } = this.cameras.main;
        
        // Genshin waypoint
        const wpGlow = this.add.circle(width / 2, height - 40, 20, 0x44ccff, 0.15);
        this.tweens.add({ targets: wpGlow, scale: 1.4, alpha: 0.05, duration: 1000, yoyo: true, repeat: -1 });
        this.add.text(width / 2, height - 60, 'Waypoint!', {
            fontFamily: '"Press Start 2P"', fontSize: '6px', color: '#66eeff'
        }).setOrigin(0.5).setAlpha(0.5);
        
        // "5 more minutes" bench
        this.add.text(100, height - 30, '"Just 5 more minutes..."', {
            fontFamily: '"Press Start 2P"', fontSize: '6px', color: '#cc8855'
        }).setOrigin(0.5).setAlpha(0.4);
    }

    getLevelDialogs() {
        return [
            { speaker: 'marabeige', text: "Naples first! I want pizza!" },
            { speaker: 'zanuff', text: "My feet hurt already..." },
            { speaker: 'marabeige', text: "Istanbul next! The bazaar!" },
            { speaker: 'zanuff', text: "Can we find a cafe in Lisbon?" },
            { speaker: 'marabeige', text: "Rome! One more church! Just one!" },
            { speaker: 'zanuff', text: "You said that 5 churches ago..." }
        ];
    }
}
