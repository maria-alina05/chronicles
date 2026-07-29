import { BaseLevel } from './BaseLevel.js';

export class Level6Scene extends BaseLevel {
    constructor() {
        super('Level6Scene', 5);
    }

    getEnemyTypes() {
        return ['keys', 'keys', 'box', 'generic'];
    }

    createBackground() {
        const { width, height } = this.cameras.main;
        
        // House interior - warm colors
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x4a3828, 0x4a3828, 0x6b5040, 0x6b5040);
        bg.fillRect(0, 0, width, height);
        
        // Wallpaper pattern
        for (let x = 0; x < width; x += 50) {
            for (let y = 0; y < height; y += 50) {
                this.add.rectangle(x + 25, y + 25, 3, 3, 0x8b7355, 0.15);
            }
        }
        
        // Windows with curtains
        for (let x = 200; x < width; x += 350) {
            this.add.rectangle(x, 100, 60, 80, 0x87ceeb, 0.3);
            this.add.rectangle(x - 28, 100, 10, 85, 0x8b2252, 0.3);
            this.add.rectangle(x + 28, 100, 10, 85, 0x8b2252, 0.3);
        }
        
        // Picture frames
        for (let x = 80; x < width; x += 250) {
            this.add.rectangle(x, 80, 30, 22, 0x333333, 0.3);
            this.add.rectangle(x, 80, 24, 16, 0x6699cc, 0.2);
        }
        
        // Dogs in background
        const frenchie = this.add.image(200, height - 50, 'dog-frenchie').setScale(0.6).setAlpha(0.3);
        const pug = this.add.image(250, height - 50, 'dog-pug').setScale(0.6).setAlpha(0.3);
        this.tweens.add({ targets: frenchie, x: 400, duration: 4000, yoyo: true, repeat: -1 });
        this.tweens.add({ targets: pug, x: 380, duration: 4500, yoyo: true, repeat: -1, delay: 500 });
    }

    createEasterEggs() {
        const { width, height } = this.cameras.main;
        
        // Twitch screen
        this.add.rectangle(80, 80, 35, 25, 0x9146ff, 0.5);
        this.add.text(80, 80, 'TWITCH', {
            fontFamily: '"Press Start 2P"', fontSize: '5px', color: '#ffffff'
        }).setOrigin(0.5).setAlpha(0.6);
        this.add.text(80, 100, 'Where it started!', {
            fontFamily: '"Press Start 2P"', fontSize: '5px', color: '#bb88ff'
        }).setOrigin(0.5).setAlpha(0.4);
        
        // Home Sweet Home sign
        const homeSign = this.add.text(width / 2, 40, 'Home Sweet Home', {
            fontFamily: '"Press Start 2P"', fontSize: '9px', color: '#ffddaa'
        }).setOrigin(0.5).setAlpha(0.5);
        this.tweens.add({ targets: homeSign, scale: 1.1, duration: 1200, yoyo: true, repeat: -1 });
        
        // Pug zone
        this.add.text(width - 100, height - 30, 'Future pug zone!', {
            fontFamily: '"Press Start 2P"', fontSize: '6px', color: '#ffcc88'
        }).setOrigin(0.5).setAlpha(0.4);
        
        // CIV VI on shelf
        this.add.text(width - 60, 80, 'CIV VI', {
            fontFamily: '"Press Start 2P"', fontSize: '7px', color: '#ffcc44'
        }).setOrigin(0.5).setAlpha(0.4);
        
        // Faiar stream reference
        this.add.text(width - 100, 130, 'Faiar is live!', {
            fontFamily: '"Press Start 2P"', fontSize: '6px', color: '#ff4444'
        }).setOrigin(0.5).setAlpha(0.3);
    }

    getLevelDialogs() {
        return [
            { speaker: 'marabeige', text: "Our first home! I love it!" },
            { speaker: 'zanuff', text: "Where do we put the gaming setup?" },
            { speaker: 'marabeige', text: "Kitchen first! I need to cook!" },
            { speaker: 'zanuff', text: "Look at that yard! Perfect for a pug!" },
            { speaker: 'marabeige', text: "Lidl run tomorrow? We need everything." },
            { speaker: 'zanuff', text: "Home is wherever you are." }
        ];
    }
}
