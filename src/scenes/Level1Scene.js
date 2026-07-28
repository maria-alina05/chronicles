import { BaseLevel } from './BaseLevel.js';
import { Enemy } from '../sprites/Enemy.js';

export class Level1Scene extends BaseLevel {
    constructor() {
        super('Level1Scene', 0);
    }

    createBackground() {
        const { height } = this.cameras.main;
        
        // Evening park / twilight sky
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a0533, 0x1a0533, 0x2d1b69, 0x2d1b69);
        bg.fillRect(0, 0, this.levelWidth, height);
        bg.setScrollFactor(0.1);
        
        // Stars
        for (let i = 0; i < 80; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, 960),
                Phaser.Math.Between(0, height * 0.6),
                Phaser.Math.Between(1, 2),
                0xffffff,
                Phaser.Math.FloatBetween(0.3, 0.8)
            ).setScrollFactor(0.1);
        }
        
        // Moon
        this.add.circle(800, 80, 30, 0xfffde8, 0.9).setScrollFactor(0.15);
        
        // Background trees (parallax layer)
        for (let x = 0; x < this.levelWidth; x += 200) {
            this.drawTree(x + Phaser.Math.Between(-30, 30), height - 60, 0.3);
        }
        
        // Park benches (decorative)
        for (let x = 300; x < this.levelWidth; x += 600) {
            this.drawBench(x, height - 45);
        }
    }

    drawTree(x, y, scrollFactor) {
        const tree = this.add.graphics();
        // Trunk
        tree.fillStyle(0x4a3218);
        tree.fillRect(x - 6, y - 60, 12, 60);
        // Foliage
        tree.fillStyle(0x1a4d1a);
        tree.fillCircle(x, y - 70, 30);
        tree.fillCircle(x - 15, y - 55, 20);
        tree.fillCircle(x + 15, y - 55, 20);
        tree.setScrollFactor(scrollFactor);
    }

    drawBench(x, y) {
        const bench = this.add.graphics();
        bench.fillStyle(0x8b6914);
        bench.fillRect(x - 20, y, 40, 6);
        bench.fillRect(x - 20, y - 15, 40, 6);
        bench.fillStyle(0x555555);
        bench.fillRect(x - 18, y - 15, 3, 20);
        bench.fillRect(x + 15, y - 15, 3, 20);
    }

    createLevel() {
        const { height } = this.cameras.main;
        
        // Ground
        for (let x = 0; x < this.levelWidth; x += 32) {
            this.platforms.create(x + 16, height - 16, 'tile-ground');
        }
        
        // Floating platforms (park paths and bridges)
        const platformSets = [
            { x: 250, y: height - 100, count: 3 },
            { x: 500, y: height - 160, count: 2 },
            { x: 700, y: height - 120, count: 4 },
            { x: 1000, y: height - 180, count: 3 },
            { x: 1300, y: height - 100, count: 2 },
            { x: 1500, y: height - 200, count: 3 },
            { x: 1800, y: height - 140, count: 4 },
            { x: 2100, y: height - 180, count: 2 },
            { x: 2400, y: height - 120, count: 3 },
            { x: 2700, y: height - 160, count: 4 },
            { x: 3000, y: height - 100, count: 2 }
        ];
        
        platformSets.forEach(set => {
            for (let i = 0; i < set.count; i++) {
                this.platforms.create(set.x + i * 32, set.y, 'tile-platform');
            }
        });
    }

    createEnemies() {
        const { height } = this.cameras.main;
        
        // Doubt Clouds (floating enemies)
        const doubtPositions = [
            { x: 350, y: height - 200 },
            { x: 750, y: height - 250 },
            { x: 1100, y: height - 180 },
            { x: 1550, y: height - 220 },
            { x: 2000, y: height - 200 },
            { x: 2500, y: height - 180 },
            { x: 2900, y: height - 240 }
        ];
        
        doubtPositions.forEach(pos => {
            const enemy = new Enemy(this, pos.x, pos.y, 'doubt', {
                health: 2,
                speed: 50,
                patrolRange: 80,
                floating: true
            });
            this.enemies.add(enemy);
        });
        
        // Ground enemies (distance ghosts)
        const ghostPositions = [
            { x: 600, y: height - 60 },
            { x: 1200, y: height - 60 },
            { x: 1800, y: height - 60 },
            { x: 2300, y: height - 60 },
            { x: 2700, y: height - 60 }
        ];
        
        ghostPositions.forEach(pos => {
            const enemy = new Enemy(this, pos.x, pos.y, 'generic', {
                health: 2,
                speed: 70,
                patrolRange: 120
            });
            this.enemies.add(enemy);
        });
    }

    getFlowerPositions() {
        const { height } = this.cameras.main;
        const y = height - 32;
        return [
            { x: 450, y }, { x: 850, y }, { x: 1150, y },
            { x: 1650, y }, { x: 2050, y }, { x: 2350, y },
            { x: 2750, y }
        ];
    }

    createEasterEggs() {
        // Baldur's Gate reference - D20 dice hidden on a platform
        const { height } = this.cameras.main;
        const d20 = this.add.text(1510, height - 220, 'D20', {
            fontFamily: '"Press Start 2P"',
            fontSize: '6px',
            color: '#ff4444'
        });
        
        // "Natural 20" if player touches it
        const d20zone = this.add.zone(1510, height - 220, 20, 20);
        this.physics.add.existing(d20zone, true);
        this.physics.add.overlap(this.player1, d20zone, () => {
            if (d20.alpha > 0) {
                const crit = this.add.text(1510, height - 250, 'NAT 20!', {
                    fontFamily: '"Press Start 2P"',
                    fontSize: '8px',
                    color: '#ffd700'
                }).setOrigin(0.5);
                this.tweens.add({
                    targets: crit,
                    y: crit.y - 30,
                    alpha: 0,
                    duration: 1500,
                    onComplete: () => crit.destroy()
                });
                d20.setAlpha(0);
                this.addScore(50);
            }
        });
    }
}
