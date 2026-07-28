import { BaseLevel } from './BaseLevel.js';
import { Enemy } from '../sprites/Enemy.js';

export class Level2Scene extends BaseLevel {
    constructor() {
        super('Level2Scene', 1);
    }

    createBackground() {
        const { height } = this.cameras.main;
        
        // Office/corporate building interior
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x2a2a3e, 0x2a2a3e, 0x1a1a2e, 0x1a1a2e);
        bg.fillRect(0, 0, this.levelWidth, height);
        bg.setScrollFactor(0.1);
        
        // Office windows in background
        for (let x = 0; x < 960; x += 120) {
            for (let y = 50; y < height - 100; y += 80) {
                const windowGfx = this.add.rectangle(x + 50, y, 60, 40, 0x334455, 0.4).setScrollFactor(0.2);
                // Blinds
                for (let b = 0; b < 4; b++) {
                    this.add.rectangle(x + 50, y - 15 + b * 10, 55, 2, 0x556677, 0.3).setScrollFactor(0.2);
                }
            }
        }
        
        // Fluorescent lights
        for (let x = 100; x < this.levelWidth; x += 300) {
            const light = this.add.rectangle(x, 45, 80, 6, 0xccffcc, 0.5);
            this.tweens.add({
                targets: light,
                alpha: 0.3,
                duration: Phaser.Math.Between(2000, 4000),
                yoyo: true,
                repeat: -1
            });
        }

        // Cubicle walls in background
        for (let x = 0; x < this.levelWidth; x += 250) {
            const cubicle = this.add.graphics();
            cubicle.fillStyle(0x666688, 0.3);
            cubicle.fillRect(x, height - 150, 8, 110);
            cubicle.fillRect(x, height - 150, 100, 8);
            cubicle.setScrollFactor(0.4);
        }
    }

    getTileTexture() {
        return 'tile-city'; // Grey office floor
    }

    createLevel() {
        const { height } = this.cameras.main;
        
        // Ground (office floor)
        for (let x = 0; x < this.levelWidth; x += 32) {
            this.platforms.create(x + 16, height - 16, 'tile-city');
        }
        
        // Desks as platforms
        const deskSets = [
            { x: 200, y: height - 80, count: 3 },
            { x: 450, y: height - 140, count: 2 },
            { x: 650, y: height - 80, count: 4 },
            { x: 900, y: height - 200, count: 2 },
            { x: 1100, y: height - 120, count: 3 },
            { x: 1350, y: height - 180, count: 3 },
            { x: 1600, y: height - 100, count: 2 },
            { x: 1850, y: height - 160, count: 4 },
            { x: 2100, y: height - 220, count: 2 },
            { x: 2350, y: height - 100, count: 3 },
            { x: 2600, y: height - 180, count: 3 },
            { x: 2850, y: height - 140, count: 2 },
            { x: 3050, y: height - 80, count: 3 }
        ];
        
        deskSets.forEach(set => {
            for (let i = 0; i < set.count; i++) {
                this.platforms.create(set.x + i * 32, set.y, 'tile-platform');
            }
            // Monitor on desk (decoration)
            const monitor = this.add.rectangle(set.x + 16, set.y - 20, 20, 16, 0x222244);
            this.add.rectangle(set.x + 16, set.y - 20, 16, 12, 0x3366ff, 0.5); // screen
        });
    }

    createEnemies() {
        const { height } = this.cameras.main;
        
        // Email swarms (floating, fast)
        const emailPositions = [
            { x: 300, y: height - 180 },
            { x: 700, y: height - 220 },
            { x: 1050, y: height - 160 },
            { x: 1400, y: height - 240 },
            { x: 1750, y: height - 180 },
            { x: 2200, y: height - 200 },
            { x: 2600, y: height - 220 },
            { x: 2900, y: height - 160 }
        ];
        
        emailPositions.forEach(pos => {
            const enemy = new Enemy(this, pos.x, pos.y, 'email', {
                health: 1,
                speed: 100,
                patrolRange: 60,
                floating: true
            });
            this.enemies.add(enemy);
        });
        
        // Teams notification enemies (ground patrol)
        const teamsPositions = [
            { x: 500, y: height - 60 },
            { x: 1000, y: height - 60 },
            { x: 1500, y: height - 60 },
            { x: 2000, y: height - 60 },
            { x: 2500, y: height - 60 },
            { x: 2800, y: height - 60 }
        ];
        
        teamsPositions.forEach(pos => {
            const enemy = new Enemy(this, pos.x, pos.y, 'teams', {
                health: 2,
                speed: 55,
                patrolRange: 80,
                damage: 1
            });
            this.enemies.add(enemy);
        });
    }

    getFlowerPositions() {
        const { height } = this.cameras.main;
        const y = height - 32;
        // Office plants! Still flowers, still dangerous for Marabeige
        return [
            { x: 350, y }, { x: 750, y }, { x: 1150, y },
            { x: 1550, y }, { x: 1950, y }, { x: 2450, y },
            { x: 2850, y }
        ];
    }

    createEasterEggs() {
        const { height } = this.cameras.main;
        
        // Civ 6 reference - "One more turn..." sign
        this.add.text(1850, height - 200, '"One more turn..."', {
            fontFamily: '"Press Start 2P"',
            fontSize: '6px',
            color: '#88aaff'
        }).setAlpha(0.7);
        
        // Genshin Impact reference - Primogem
        const primoGfx = this.add.graphics();
        primoGfx.fillStyle(0x66bbff);
        primoGfx.fillTriangle(2400, height - 270, 2410, height - 280, 2420, height - 270);
        primoGfx.fillTriangle(2400, height - 260, 2410, height - 250, 2420, height - 260);
        primoGfx.fillStyle(0xffffff);
        primoGfx.fillRect(2408, height - 273, 4, 4);
        this.add.text(2410, height - 290, 'Primogem!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '5px',
            color: '#66bbff'
        }).setOrigin(0.5).setAlpha(0.7);
        
        // Genshin "Paimon is NOT emergency food" reference
        this.add.text(850, height - 250, 'Paimon is NOT\nemergency food!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '5px',
            color: '#ffcc44',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0.5);
        
        // Teams notification joke
        this.add.text(1300, height - 260, '"You could have\nsent an email..."', {
            fontFamily: '"Press Start 2P"',
            fontSize: '5px',
            color: '#7b83eb',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0.6);
    }
}
