import { BaseLevel } from './BaseLevel.js';
import { Enemy } from '../sprites/Enemy.js';

export class Level6Scene extends BaseLevel {
    constructor() {
        super('Level6Scene', 5);
    }

    createBackground() {
        const { height } = this.cameras.main;
        
        // House interior - warm colors
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x4a3828, 0x4a3828, 0x6b5040, 0x6b5040);
        bg.fillRect(0, 0, this.levelWidth, height);
        bg.setScrollFactor(0.1);
        
        // Wallpaper pattern
        for (let x = 0; x < 960; x += 60) {
            for (let y = 0; y < height - 50; y += 60) {
                this.add.rectangle(x + 30, y + 30, 4, 4, 0x8b7355, 0.3).setScrollFactor(0.15);
            }
        }
        
        // Windows with curtains
        for (let x = 200; x < 960; x += 400) {
            // Window
            this.add.rectangle(x, 120, 80, 100, 0x87ceeb, 0.5).setScrollFactor(0.2);
            // Curtains
            this.add.rectangle(x - 35, 120, 15, 110, 0x8b2252, 0.6).setScrollFactor(0.2);
            this.add.rectangle(x + 35, 120, 15, 110, 0x8b2252, 0.6).setScrollFactor(0.2);
            // Sunlight beam
            const sunbeam = this.add.rectangle(x, 200, 60, 200, 0xffff88, 0.05).setScrollFactor(0.2);
        }
        
        // Picture frames on wall
        for (let x = 100; x < this.levelWidth; x += 350) {
            const frame = this.add.rectangle(x, 100, 40, 30, 0x333333).setScrollFactor(0.3);
            this.add.rectangle(x, 100, 34, 24, 0x6699cc, 0.5).setScrollFactor(0.3); // photo
        }

        // Dogs running around in background
        const bgFrenchie = this.add.image(300, height - 60, 'dog-frenchie').setScale(0.8).setAlpha(0.4).setScrollFactor(0.3);
        const bgPug = this.add.image(350, height - 60, 'dog-pug').setScale(0.8).setAlpha(0.4).setScrollFactor(0.3);
        this.tweens.add({
            targets: bgFrenchie,
            x: 600,
            duration: 4000,
            yoyo: true,
            repeat: -1
        });
        this.tweens.add({
            targets: bgPug,
            x: 550,
            duration: 4500,
            yoyo: true,
            repeat: -1,
            delay: 500
        });
    }

    getTileTexture() {
        return 'tile-house';
    }

    createLevel() {
        const { height } = this.cameras.main;
        
        // Ground - wooden floor
        for (let x = 0; x < this.levelWidth; x += 32) {
            this.platforms.create(x + 16, height - 16, 'tile-house');
        }
        
        // House layout as distinct rooms with walls/dividers
        // LIVING ROOM (0-600)
        // Sofa
        for (let i = 0; i < 4; i++) {
            this.platforms.create(150 + i * 32, height - 70, 'tile-platform');
        }
        // TV shelf
        for (let i = 0; i < 2; i++) {
            this.platforms.create(450 + i * 32, height - 120, 'tile-platform');
        }
        
        // Room divider wall 1
        for (let y = 0; y < 3; y++) {
            this.platforms.create(620, height - 48 - y * 32, 'tile-house');
        }
        
        // KITCHEN (620-1200)
        // Counter
        for (let i = 0; i < 5; i++) {
            this.platforms.create(700 + i * 32, height - 80, 'tile-platform');
        }
        // Upper cabinets
        for (let i = 0; i < 4; i++) {
            this.platforms.create(750 + i * 32, height - 200, 'tile-platform');
        }
        // Fridge platform
        for (let i = 0; i < 2; i++) {
            this.platforms.create(1050 + i * 32, height - 140, 'tile-platform');
        }
        
        // Room divider wall 2
        for (let y = 0; y < 3; y++) {
            this.platforms.create(1220, height - 48 - y * 32, 'tile-house');
        }
        
        // HALLWAY + STAIRS (1220-1700)
        // Staircase going up
        for (let step = 0; step < 6; step++) {
            this.platforms.create(1300 + step * 50, height - 70 - step * 40, 'tile-platform');
            this.platforms.create(1332 + step * 50, height - 70 - step * 40, 'tile-platform');
        }
        // Upper floor
        for (let i = 0; i < 8; i++) {
            this.platforms.create(1550 + i * 32, height - 300, 'tile-house');
        }
        
        // BEDROOM (1700-2300)
        // Bed platform (wide)
        for (let i = 0; i < 5; i++) {
            this.platforms.create(1800 + i * 32, height - 90, 'tile-platform');
        }
        // Nightstands
        this.platforms.create(1780, height - 130, 'tile-platform');
        this.platforms.create(1980, height - 130, 'tile-platform');
        // Closet/wardrobe up high
        for (let i = 0; i < 3; i++) {
            this.platforms.create(2100 + i * 32, height - 200, 'tile-platform');
        }
        
        // Room divider wall 3
        for (let y = 0; y < 3; y++) {
            this.platforms.create(2320, height - 48 - y * 32, 'tile-house');
        }
        
        // GAMING ROOM (2320-2800)
        // Desk
        for (let i = 0; i < 3; i++) {
            this.platforms.create(2400 + i * 32, height - 100, 'tile-platform');
        }
        // Shelf with games
        for (let i = 0; i < 4; i++) {
            this.platforms.create(2450 + i * 32, height - 220, 'tile-platform');
        }
        // Bean bag area
        for (let i = 0; i < 2; i++) {
            this.platforms.create(2700 + i * 32, height - 60, 'tile-platform');
        }
        
        // GARDEN/BALCONY (2800-end)
        // Outdoor platforms
        for (let i = 0; i < 3; i++) {
            this.platforms.create(2900 + i * 32, height - 90, 'tile-ground');
        }
        for (let i = 0; i < 2; i++) {
            this.platforms.create(3050 + i * 32, height - 150, 'tile-ground');
        }
    }

    createEnemies() {
        const { height } = this.cameras.main;
        
        // Moving boxes (rolling toward players)
        const boxPositions = [
            { x: 300, y: height - 60 },
            { x: 650, y: height - 60 },
            { x: 1050, y: height - 60 },
            { x: 1500, y: height - 60 },
            { x: 1850, y: height - 60 },
            { x: 2200, y: height - 60 },
            { x: 2600, y: height - 60 },
            { x: 2900, y: height - 60 }
        ];
        
        boxPositions.forEach(pos => {
            const enemy = new Enemy(this, pos.x, pos.y, 'box', {
                health: 2,
                speed: 90,
                patrolRange: 100
            });
            this.enemies.add(enemy);
        });
        
        // Floating IKEA instruction manuals (confusing enemies!)
        const manualPositions = [
            { x: 450, y: height - 200 },
            { x: 850, y: height - 220 },
            { x: 1250, y: height - 180 },
            { x: 1650, y: height - 240 },
            { x: 2050, y: height - 200 },
            { x: 2450, y: height - 220 },
            { x: 2800, y: height - 180 }
        ];
        
        manualPositions.forEach(pos => {
            const enemy = new Enemy(this, pos.x, pos.y, 'paper', {
                health: 1,
                speed: 70,
                patrolRange: 50,
                floating: true
            });
            this.enemies.add(enemy);
        });
    }

    getFlowerPositions() {
        const { height } = this.cameras.main;
        const y = height - 32;
        // Housewarming flower bouquets! 
        return [
            { x: 250, y }, { x: 600, y }, { x: 950, y },
            { x: 1300, y }, { x: 1700, y }, { x: 2100, y },
            { x: 2500, y }, { x: 2800, y }
        ];
    }

    createEasterEggs() {
        const { height } = this.cameras.main;
        
        // Gaming setup in one room - monitors, controllers, board games
        // Aeon's End box on shelf
        this.add.text(1220, height - 220, 'AEON\'S END', {
            fontFamily: '"Press Start 2P"',
            fontSize: '5px',
            color: '#9944cc'
        });
        
        // CIV 6 on the monitor
        this.add.text(2570, height - 115, 'CIV VI', {
            fontFamily: '"Press Start 2P"',
            fontSize: '5px',
            color: '#ffaa44'
        });
        
        // Twitch on another screen (where it all started!)
        const twitchScreen = this.add.rectangle(560, height - 115, 30, 20, 0x9146ff, 0.6);
        this.add.text(560, height - 115, 'TV', {
            fontFamily: '"Press Start 2P"',
            fontSize: '4px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // "Home Sweet Home" sign
        this.add.text(this.levelWidth - 200, height - 260, 'Home Sweet Home', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#ffccaa'
        }).setOrigin(0.5);
    }
}
