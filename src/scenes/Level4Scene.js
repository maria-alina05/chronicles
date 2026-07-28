import { BaseLevel } from './BaseLevel.js';
import { Enemy } from '../sprites/Enemy.js';

export class Level4Scene extends BaseLevel {
    constructor() {
        super('Level4Scene', 3);
    }

    createBackground() {
        const { height } = this.cameras.main;
        
        // Romantic evening - sunset/golden hour
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a0033, 0x330044, 0xff6644, 0xff8866);
        bg.fillRect(0, 0, this.levelWidth, height);
        bg.setScrollFactor(0.1);
        
        // Big moon/sun setting
        this.add.circle(750, 150, 50, 0xffd700, 0.8).setScrollFactor(0.15);
        
        // Floating pixel hearts in background (small drawn hearts, not the texture)
        for (let i = 0; i < 25; i++) {
            const hx = Phaser.Math.Between(0, 960);
            const hy = Phaser.Math.Between(50, height - 100);
            const heartGfx = this.add.graphics();
            const s = Phaser.Math.Between(3, 6);
            heartGfx.fillStyle(0xff4488, 0.25);
            heartGfx.fillCircle(hx - s, hy, s);
            heartGfx.fillCircle(hx + s, hy, s);
            heartGfx.fillTriangle(hx - s * 2, hy + 2, hx + s * 2, hy + 2, hx, hy + s * 3);
            heartGfx.setScrollFactor(0.2);
            this.tweens.add({
                targets: heartGfx,
                y: -30,
                alpha: 0,
                duration: Phaser.Math.Between(3000, 6000),
                yoyo: true,
                repeat: -1,
                delay: Phaser.Math.Between(0, 3000)
            });
        }
        
        // Romantic path with candles
        for (let x = 200; x < this.levelWidth; x += 150) {
            // Candle
            const candleGfx = this.add.graphics();
            candleGfx.fillStyle(0xffffff);
            candleGfx.fillRect(x - 2, height - 50, 4, 12);
            candleGfx.fillStyle(0xff8800);
            candleGfx.fillCircle(x, height - 54, 4);
            
            // Candle glow
            const glow = this.add.circle(x, height - 54, 15, 0xff8800, 0.15);
            this.tweens.add({
                targets: glow,
                scale: 1.3,
                alpha: 0.05,
                duration: 800,
                yoyo: true,
                repeat: -1
            });
        }
    }

    createLevel() {
        const { height } = this.cameras.main;
        
        // Ground - romantic stone path
        for (let x = 0; x < this.levelWidth; x += 32) {
            this.platforms.create(x + 16, height - 16, 'tile-ground');
        }
        
        // Cloud platforms (dreamy/romantic)
        const cloudSets = [
            { x: 180, y: height - 120, count: 3 },
            { x: 400, y: height - 200, count: 2 },
            { x: 600, y: height - 150, count: 3 },
            { x: 850, y: height - 250, count: 2 },
            { x: 1050, y: height - 130, count: 4 },
            { x: 1300, y: height - 200, count: 2 },
            { x: 1550, y: height - 280, count: 3 },
            { x: 1800, y: height - 150, count: 3 },
            { x: 2050, y: height - 200, count: 2 },
            { x: 2300, y: height - 130, count: 4 },
            { x: 2550, y: height - 250, count: 2 },
            { x: 2800, y: height - 160, count: 3 },
            { x: 3050, y: height - 100, count: 2 }
        ];
        
        cloudSets.forEach(set => {
            for (let i = 0; i < set.count; i++) {
                this.platforms.create(set.x + i * 32, set.y, 'tile-platform');
            }
        });
    }

    createEnemies() {
        const { height } = this.cameras.main;
        
        // Butterfly nerves (fast, erratic movement)
        const butterflyPositions = [
            { x: 300, y: height - 200 },
            { x: 550, y: height - 250 },
            { x: 800, y: height - 180 },
            { x: 1100, y: height - 220 },
            { x: 1400, y: height - 270 },
            { x: 1700, y: height - 200 },
            { x: 2000, y: height - 250 },
            { x: 2300, y: height - 180 },
            { x: 2600, y: height - 220 },
            { x: 2900, y: height - 200 }
        ];
        
        butterflyPositions.forEach(pos => {
            const enemy = new Enemy(this, pos.x, pos.y, 'butterfly', {
                health: 1,
                speed: 120,
                patrolRange: 50,
                floating: true
            });
            this.enemies.add(enemy);
        });
        
        // Ring Guardian - mini boss near the end
        const ringGuardian = new Enemy(this, 2700, height - 80, 'generic', {
            health: 6,
            speed: 30,
            patrolRange: 60,
            damage: 1
        });
        ringGuardian.setScale(2);
        this.enemies.add(ringGuardian);
    }

    getFlowerPositions() {
        const { height } = this.cameras.main;
        const y = height - 32;
        // Romantic setting = MORE flowers = more danger for Marabeige!
        return [
            { x: 250, y }, { x: 450, y }, { x: 650, y },
            { x: 900, y }, { x: 1100, y }, { x: 1350, y },
            { x: 1600, y }, { x: 1850, y }, { x: 2100, y },
            { x: 2400, y }, { x: 2650, y }
        ];
    }

    createEasterEggs() {
        const { height } = this.cameras.main;
        
        // Aeon's End reference - "The Breach is open!"
        this.add.text(1560, height - 300, 'The Breach is open!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '6px',
            color: '#aa44ff'
        }).setAlpha(0.6);
        
        // Ring at the end - collectible that shows proposal text
        const ringX = this.levelWidth - 150;
        const ringY = height - 80;
        const ring = this.add.graphics();
        ring.lineStyle(3, 0xffd700);
        ring.strokeCircle(0, 0, 12);
        ring.fillStyle(0xffffff);
        ring.fillCircle(0, -12, 5); // diamond
        ring.fillStyle(0xaaeeff);
        ring.fillCircle(0, -12, 3); // diamond shine
        ring.setPosition(ringX, ringY);
        
        // Ring glow
        const ringGlow = this.add.circle(ringX, ringY, 20, 0xffd700, 0.2);
        this.tweens.add({
            targets: [ringGlow],
            scale: 1.5,
            alpha: 0,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        this.tweens.add({
            targets: ring,
            scale: 1.2,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        
        // Ring pickup zone
        const ringZone = this.add.zone(ringX, ringY, 40, 40);
        this.physics.add.existing(ringZone, true);
        
        // When either player touches the ring
        this.physics.add.overlap([this.player1, this.player2], ringZone, () => {
            ringZone.destroy();
            ring.destroy();
            ringGlow.destroy();
            
            // Big proposal moment!
            this.cameras.main.flash(500, 255, 215, 0);
            
            const proposalText = this.add.text(ringX, ringY - 50, 'Will you marry me?', {
                fontFamily: '"Press Start 2P"',
                fontSize: '10px',
                color: '#ffd700'
            }).setOrigin(0.5).setDepth(100);
            
            this.tweens.add({
                targets: proposalText,
                y: ringY - 100,
                scale: 1.5,
                duration: 2000,
                onComplete: () => {
                    const yesText = this.add.text(ringX, ringY - 60, 'YES!', {
                        fontFamily: '"Press Start 2P"',
                        fontSize: '14px',
                        color: '#ff44aa'
                    }).setOrigin(0.5).setDepth(100);
                    this.tweens.add({
                        targets: yesText,
                        scale: 2,
                        alpha: 0,
                        duration: 3000
                    });
                }
            });
            
            // Bonus score
            this.addScore(500);
        });
    }
}
