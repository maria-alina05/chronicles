import { BaseLevel } from './BaseLevel.js';
import { Enemy } from '../sprites/Enemy.js';

export class Level5Scene extends BaseLevel {
    constructor() {
        super('Level5Scene', 4);
    }

    createBackground() {
        const { height } = this.cameras.main;
        
        // City hall / bureaucratic building
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x87ceeb, 0x87ceeb, 0x4a90d9, 0x4a90d9);
        bg.fillRect(0, 0, this.levelWidth, height);
        bg.setScrollFactor(0.1);
        
        // City buildings in background
        for (let x = 0; x < 960; x += 100) {
            const bh = Phaser.Math.Between(100, 250);
            const bw = Phaser.Math.Between(50, 80);
            const building = this.add.rectangle(x, height - bh / 2 - 30, bw, bh, 
                Phaser.Math.Between(0, 1) ? 0x445566 : 0x556677, 0.5
            ).setScrollFactor(0.2);
            
            // Windows on buildings
            for (let wy = height - bh; wy < height - 40; wy += 25) {
                for (let wx = x - bw / 3; wx < x + bw / 3; wx += 18) {
                    this.add.rectangle(wx, wy, 8, 10, 0xffee88, 0.4).setScrollFactor(0.2);
                }
            }
        }
        
        // Decorative confetti / celebration particles
        for (let i = 0; i < 20; i++) {
            const conf = this.add.rectangle(
                Phaser.Math.Between(0, 960),
                Phaser.Math.Between(0, height),
                4, 8,
                Phaser.Math.Between(0, 0xffffff)
            ).setScrollFactor(0.3).setAlpha(0.4);
            this.tweens.add({
                targets: conf,
                y: conf.y + 200,
                angle: 360,
                alpha: 0,
                duration: Phaser.Math.Between(3000, 6000),
                repeat: -1
            });
        }
    }

    getTileTexture() {
        return 'tile-city';
    }

    createLevel() {
        const { height } = this.cameras.main;
        
        // Ground - city pavement
        for (let x = 0; x < this.levelWidth; x += 32) {
            this.platforms.create(x + 16, height - 16, 'tile-city');
        }
        
        // Steps, ledges, balconies (city hall architecture)
        const archSets = [
            { x: 200, y: height - 80, count: 4 },
            { x: 500, y: height - 140, count: 3 },
            { x: 750, y: height - 200, count: 2 },
            { x: 950, y: height - 100, count: 5 },
            { x: 1250, y: height - 160, count: 3 },
            { x: 1500, y: height - 240, count: 2 },
            { x: 1700, y: height - 120, count: 4 },
            { x: 2000, y: height - 180, count: 3 },
            { x: 2250, y: height - 100, count: 3 },
            { x: 2500, y: height - 220, count: 2 },
            { x: 2700, y: height - 140, count: 4 },
            { x: 2950, y: height - 80, count: 3 }
        ];
        
        archSets.forEach(set => {
            for (let i = 0; i < set.count; i++) {
                this.platforms.create(set.x + i * 32, set.y, 'tile-platform');
            }
        });

        // Decorative columns
        for (let x = 400; x < this.levelWidth; x += 500) {
            const col = this.add.graphics();
            col.fillStyle(0xcccccc);
            col.fillRect(x - 6, height - 160, 12, 130);
            col.fillRect(x - 10, height - 165, 20, 8);
            col.fillRect(x - 10, height - 35, 20, 8);
        }
    }

    createEnemies() {
        const { height } = this.cameras.main;
        
        // Paperwork golems
        const paperPositions = [
            { x: 350, y: height - 60 },
            { x: 700, y: height - 60 },
            { x: 1100, y: height - 60 },
            { x: 1500, y: height - 60 },
            { x: 1900, y: height - 60 },
            { x: 2300, y: height - 60 },
            { x: 2700, y: height - 60 }
        ];
        
        paperPositions.forEach(pos => {
            const enemy = new Enemy(this, pos.x, pos.y, 'paper', {
                health: 3,
                speed: 50,
                patrolRange: 100
            });
            this.enemies.add(enemy);
        });
        
        // Floating bureaucracy blobs
        const blobPositions = [
            { x: 500, y: height - 220 },
            { x: 900, y: height - 180 },
            { x: 1300, y: height - 250 },
            { x: 1700, y: height - 200 },
            { x: 2100, y: height - 240 },
            { x: 2600, y: height - 180 }
        ];
        
        blobPositions.forEach(pos => {
            const enemy = new Enemy(this, pos.x, pos.y, 'doubt', {
                health: 2,
                speed: 60,
                patrolRange: 70,
                floating: true
            });
            this.enemies.add(enemy);
        });
    }

    getFlowerPositions() {
        const { height } = this.cameras.main;
        const y = height - 32;
        // City flower planters
        return [
            { x: 300, y }, { x: 650, y }, { x: 1000, y },
            { x: 1400, y }, { x: 1800, y }, { x: 2200, y },
            { x: 2600, y }, { x: 2900, y }
        ];
    }

    createEasterEggs() {
        const { height } = this.cameras.main;
        
        // Palworld reference - a Pal sphere
        const sphere = this.add.graphics();
        sphere.fillStyle(0x4488ff);
        sphere.fillCircle(2000, height - 230, 8);
        sphere.fillStyle(0xffffff);
        sphere.fillCircle(2000, height - 230, 4);
        sphere.lineStyle(2, 0x222222);
        sphere.strokeCircle(2000, height - 230, 8);
        
        // "Catch rate: 100%" tooltip
        const palText = this.add.text(2000, height - 250, 'Catch rate: 100%', {
            fontFamily: '"Press Start 2P"',
            fontSize: '5px',
            color: '#88ccff'
        }).setOrigin(0.5).setAlpha(0.6);

        // Civil ceremony badge at the end
        const badge = this.add.text(this.levelWidth - 120, height - 100, 'MARRIED!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#ffd700'
        }).setOrigin(0.5);
        this.tweens.add({
            targets: badge,
            scale: 1.3,
            duration: 600,
            yoyo: true,
            repeat: -1
        });
    }
}
