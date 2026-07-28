import { BaseLevel } from './BaseLevel.js';
import { Enemy } from '../sprites/Enemy.js';

export class Level3Scene extends BaseLevel {
    constructor() {
        super('Level3Scene', 2);
    }

    createBackground() {
        const { height } = this.cameras.main;
        
        // Bright sunny vacation sky
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x4a90d9, 0x87ceeb, 0x87ceeb, 0xaee8f0);
        bg.fillRect(0, 0, this.levelWidth, height);
        bg.setScrollFactor(0.1);
        
        // Sun
        this.add.circle(150, 80, 40, 0xffdd00, 0.9).setScrollFactor(0.05);
        // Sun rays
        for (let i = 0; i < 8; i++) {
            const ray = this.add.rectangle(150, 80, 4, 60, 0xffdd00, 0.3).setScrollFactor(0.05);
            ray.setAngle(i * 45);
        }
        
        // Tourist landmarks in background
        // Church/cathedral
        const church = this.add.graphics();
        church.fillStyle(0xd4a574);
        church.fillRect(300, 100, 60, 120);
        church.fillStyle(0x8b6914);
        church.fillTriangle(300, 100, 330, 40, 360, 100);
        church.fillStyle(0xffd700);
        church.fillRect(327, 40, 6, 15); // cross
        church.fillRect(323, 48, 14, 4);
        church.setScrollFactor(0.15);
        
        // Castle tower
        const castle = this.add.graphics();
        castle.fillStyle(0x888888);
        castle.fillRect(700, 80, 50, 140);
        castle.fillStyle(0x666666);
        for (let cx = 700; cx < 750; cx += 10) {
            castle.fillRect(cx, 70, 8, 12);
        }
        castle.fillStyle(0x444444);
        castle.fillRect(715, 150, 20, 30);
        castle.setScrollFactor(0.15);
        
        // Museum columns
        const museum = this.add.graphics();
        museum.fillStyle(0xeeeeee);
        museum.fillRect(1100, 110, 80, 100);
        museum.fillStyle(0xcccccc);
        museum.fillTriangle(1090, 110, 1140, 80, 1190, 110);
        for (let col = 1105; col < 1180; col += 20) {
            museum.fillStyle(0xdddddd);
            museum.fillRect(col, 110, 6, 95);
        }
        museum.setScrollFactor(0.15);
        
        // Palm trees scattered
        for (let px = 200; px < this.levelWidth; px += 400) {
            const palm = this.add.graphics();
            palm.fillStyle(0x6b4226);
            palm.fillRect(px, height - 140, 8, 90);
            palm.fillStyle(0x228b22);
            palm.fillTriangle(px - 25, height - 140, px + 4, height - 160, px + 33, height - 140);
            palm.fillTriangle(px - 20, height - 150, px + 4, height - 170, px + 28, height - 150);
            palm.setScrollFactor(0.25);
        }
        
        // Clouds
        for (let i = 0; i < 8; i++) {
            const cx = Phaser.Math.Between(0, 960);
            const cy = Phaser.Math.Between(40, 150);
            this.add.circle(cx, cy, 20, 0xffffff, 0.7).setScrollFactor(0.1);
            this.add.circle(cx + 15, cy - 5, 15, 0xffffff, 0.7).setScrollFactor(0.1);
            this.add.circle(cx - 15, cy + 3, 17, 0xffffff, 0.7).setScrollFactor(0.1);
        }
        
        // Arrow signs pointing forward
        for (let sx = 500; sx < this.levelWidth; sx += 800) {
            const sign = this.add.graphics();
            sign.fillStyle(0x8b4513);
            sign.fillRect(sx, height - 80, 4, 40);
            sign.fillStyle(0xfff8dc);
            sign.fillRect(sx - 20, height - 90, 44, 16);
            
            this.add.text(sx + 2, height - 84, '>>>', {
                fontFamily: '"Press Start 2P"',
                fontSize: '6px',
                color: '#cc2222'
            }).setOrigin(0.5);
        }
    }

    getTileTexture() {
        return 'tile-sand';
    }

    createLevel() {
        const { height } = this.cameras.main;
        
        // Sandy ground
        for (let x = 0; x < this.levelWidth; x += 32) {
            this.platforms.create(x + 16, height - 16, 'tile-sand');
        }
        
        // Varied terrain - cobblestone paths, steps, bridges, viewing platforms
        const terrainSets = [
            { x: 180, y: height - 90, count: 3 },
            { x: 400, y: height - 140, count: 2 },
            { x: 600, y: height - 200, count: 3 },
            { x: 850, y: height - 100, count: 4 },
            { x: 1100, y: height - 160, count: 2 },
            { x: 1350, y: height - 230, count: 3 },
            { x: 1600, y: height - 110, count: 3 },
            { x: 1850, y: height - 180, count: 2 },
            { x: 2100, y: height - 140, count: 4 },
            { x: 2350, y: height - 260, count: 2 },
            { x: 2600, y: height - 100, count: 3 },
            { x: 2850, y: height - 170, count: 3 },
            { x: 3100, y: height - 120, count: 4 }
        ];
        
        terrainSets.forEach(set => {
            for (let i = 0; i < set.count; i++) {
                this.platforms.create(set.x + i * 32, set.y, 'tile-platform');
            }
        });
    }

    createEnemies() {
        const { height } = this.cameras.main;
        
        // Camera flash tourists
        const touristPositions = [
            { x: 300, y: height - 60 },
            { x: 650, y: height - 60 },
            { x: 1000, y: height - 60 },
            { x: 1400, y: height - 60 },
            { x: 1750, y: height - 60 },
            { x: 2150, y: height - 60 },
            { x: 2500, y: height - 60 },
            { x: 2850, y: height - 60 }
        ];
        
        touristPositions.forEach(pos => {
            const enemy = new Enemy(this, pos.x, pos.y, 'tourist', {
                health: 2,
                speed: 60,
                patrolRange: 80
            });
            this.enemies.add(enemy);
        });
        
        // Selfie sticks (swinging hazards)
        const selfiePositions = [
            { x: 500, y: height - 200 },
            { x: 900, y: height - 180 },
            { x: 1300, y: height - 220 },
            { x: 1700, y: height - 200 },
            { x: 2100, y: height - 240 },
            { x: 2500, y: height - 190 },
            { x: 2900, y: height - 210 }
        ];
        
        selfiePositions.forEach(pos => {
            const enemy = new Enemy(this, pos.x, pos.y, 'generic', {
                health: 1,
                speed: 90,
                patrolRange: 40,
                floating: true
            });
            this.enemies.add(enemy);
        });
        
        // Tour guide boss near end
        const tourGuide = new Enemy(this, 2700, height - 80, 'paper', {
            health: 5,
            speed: 30,
            patrolRange: 100,
            damage: 1
        });
        tourGuide.setScale(1.5);
        this.enemies.add(tourGuide);
    }

    getFlowerPositions() {
        const { height } = this.cameras.main;
        const y = height - 32;
        return [
            { x: 250, y }, { x: 550, y }, { x: 850, y },
            { x: 1150, y }, { x: 1500, y }, { x: 1900, y },
            { x: 2300, y }, { x: 2700, y }
        ];
    }

    createEasterEggs() {
        const { height } = this.cameras.main;
        
        // "5 more minutes" bench
        this.add.text(850, height - 120, '"Just 5 more\nminutes..."', {
            fontFamily: '"Press Start 2P"',
            fontSize: '5px',
            color: '#885533',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0.7);
        
        // Cafe with coffee cup
        const cup = this.add.graphics();
        cup.fillStyle(0xffffff);
        cup.fillRect(1610, height - 132, 12, 10);
        cup.fillStyle(0x4a2c0a);
        cup.fillRect(1612, height - 130, 8, 6);
        this.add.text(1616, height - 142, '~', {
            fontSize: '8px',
            color: '#cccccc'
        }).setOrigin(0.5).setAlpha(0.5);
        
        // Genshin Impact - Teleport Waypoint reference
        const waypoint = this.add.graphics();
        waypoint.fillStyle(0x44ccff);
        waypoint.fillTriangle(1200, height - 200, 1210, height - 220, 1220, height - 200);
        waypoint.fillStyle(0x88eeff);
        waypoint.fillCircle(1210, height - 195, 5);
        this.add.text(1210, height - 230, 'Waypoint unlocked!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '5px',
            color: '#44ccff'
        }).setOrigin(0.5).setAlpha(0.6);
        
        // Genshin "Exploring with Resin" joke
        this.add.text(2100, height - 170, 'Out of Resin...\ntime to touch grass', {
            fontFamily: '"Press Start 2P"',
            fontSize: '5px',
            color: '#aa88ff',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0.5);
        
        // Tourist map with X marks
        this.add.text(200, height - 110, 'MAP: [X][X][X][ ][ ]', {
            fontFamily: '"Press Start 2P"',
            fontSize: '5px',
            color: '#cc4444'
        }).setAlpha(0.6);
        
        // "Worth it" at the sunset viewpoint near end
        this.add.text(this.levelWidth - 180, height - 150, '"OK... worth it."', {
            fontFamily: '"Press Start 2P"',
            fontSize: '7px',
            color: '#ff8844'
        }).setOrigin(0.5);
        
        // Postcard
        const postcard = this.add.graphics();
        postcard.fillStyle(0xffffff);
        postcard.fillRect(2360, height - 285, 30, 20);
        postcard.lineStyle(1, 0xcc0000);
        postcard.strokeRect(2360, height - 285, 30, 20);
        this.add.text(2375, height - 277, 'WISH\nYOU\nWERE\nHERE', {
            fontFamily: '"Press Start 2P"',
            fontSize: '3px',
            color: '#333333',
            align: 'center'
        }).setOrigin(0.5);
    }
}
