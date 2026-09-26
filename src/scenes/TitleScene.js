import { GAME_DATA, COLORS } from '../constants.js';

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        const isLandscape = width > height;
        
        // Starry background
        for (let i = 0; i < 100; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                Phaser.Math.Between(1, 2),
                0xffffff,
                Phaser.Math.FloatBetween(0.3, 1)
            );
            this.tweens.add({
                targets: star,
                alpha: 0.2,
                duration: Phaser.Math.Between(1000, 3000),
                yoyo: true,
                repeat: -1
            });
        }

        // Title block - wordWrap keeps long lines ("Zanuff & Marabeige") from running off
        // narrow screens. All sections are created first (at temp y) to measure their real
        // height, then the leftover vertical space is split evenly between them as gaps -
        // so the screen fills top-to-bottom instead of everything huddling at the top.
        const maxTextWidth = width - 40;
        const contentTop = isLandscape ? 16 : height * 0.03;
        const contentBottom = height - (isLandscape ? 16 : height * 0.035);
        const availableHeight = contentBottom - contentTop;

        const title1 = this.add.text(width / 2, 0, 'The Chronicles of', {
            fontFamily: '"Press Start 2P"',
            fontSize: '17px',
            color: '#aaaacc',
            align: 'center',
            wordWrap: { width: maxTextWidth, useAdvancedWrap: true }
        }).setOrigin(0.5, 0);

        const titleGap = 8;
        const title2 = this.add.text(width / 2, 0, 'Zanuff & Marabeige', {
            fontFamily: '"Press Start 2P"',
            fontSize: '32px',
            color: '#e94560',
            align: 'center',
            wordWrap: { width: maxTextWidth, useAdvancedWrap: true }
        }).setOrigin(0.5, 0);
        const titleBlockHeight = title1.height + titleGap + title2.height;

        // Glow effect on names
        this.tweens.add({
            targets: title2,
            alpha: 0.7,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Song quote
        const quote = this.add.text(width / 2, 0, '"Mad About You" - Hooverphonic', {
            fontFamily: '"Press Start 2P"',
            fontSize: '13px',
            color: '#ffd700',
            align: 'center',
            wordWrap: { width: maxTextWidth, useAdvancedWrap: true }
        }).setOrigin(0.5, 0);

        // Characters standing together, built around a local baseline of y=0 so the
        // group's real bounds can be measured, then shifted into place as a whole.
        const zanuff = this.add.image(width / 2 - 40, 0, 'zanuff').setScale(2.5);
        const marabeige = this.add.image(width / 2 + 40, 5, 'marabeige').setScale(2.5);
        const heart = this.add.image(width / 2, -30, 'heart').setScale(1);
        const frenchie = this.add.image(width / 2 - 80, 70, 'dog-frenchie').setScale(1.8);
        const pug = this.add.image(width / 2 + 80, 70, 'dog-pug').setScale(1.8);
        const rowObjects = [zanuff, marabeige, heart, frenchie, pug];
        const rowTop = Math.min(...rowObjects.map(o => o.getBounds().top));
        const rowBottom = Math.max(...rowObjects.map(o => o.getBounds().bottom));
        const rowHeight = rowBottom - rowTop;

        this.tweens.add({
            targets: heart,
            scale: 1.3,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        this.tweens.add({
            targets: [zanuff, marabeige],
            y: '-=5',
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Start prompt
        const startText = this.add.text(width / 2, 0, 'Tap to start', {
            fontFamily: '"Press Start 2P"',
            fontSize: '15px',
            color: '#ffffff'
        }).setOrigin(0.5, 0);

        this.tweens.add({
            targets: startText,
            alpha: 0,
            duration: 600,
            yoyo: true,
            repeat: -1
        });

        // Controls info
        const controlsGap = 6;
        const controls1 = this.add.text(width / 2, 0, 'WASD / Arrows / Touch to move', {
            fontFamily: '"Press Start 2P"',
            fontSize: '11px',
            color: '#666688',
            align: 'center',
            wordWrap: { width: maxTextWidth, useAdvancedWrap: true }
        }).setOrigin(0.5, 0);
        const controls2 = this.add.text(width / 2, 0, 'A love story survival game', {
            fontFamily: '"Press Start 2P"',
            fontSize: '11px',
            color: '#666688',
            align: 'center',
            wordWrap: { width: maxTextWidth, useAdvancedWrap: true }
        }).setOrigin(0.5, 0);
        const controlsBlockHeight = controls1.height + controlsGap + controls2.height;

        // Distribute leftover vertical space evenly between the 5 sections as gaps
        const sectionHeights = [titleBlockHeight, quote.height, rowHeight, startText.height, controlsBlockHeight];
        const totalContent = sectionHeights.reduce((a, b) => a + b, 0);
        const minGap = 24;
        const numGaps = sectionHeights.length - 1;
        const extra = Math.max(0, availableHeight - totalContent - minGap * numGaps);
        const gap = minGap + extra / numGaps;

        let cursorY = contentTop;

        title1.setY(cursorY);
        title2.setY(cursorY + title1.height + titleGap);
        cursorY += titleBlockHeight + gap;

        quote.setY(cursorY);
        cursorY += quote.height + gap;

        const rowShift = cursorY - rowTop;
        rowObjects.forEach((o) => o.setY(o.y + rowShift));
        cursorY += rowHeight + gap;

        startText.setY(cursorY);
        cursorY += startText.height + gap;

        controls1.setY(cursorY);
        controls2.setY(cursorY + controls1.height + controlsGap);

        // Input
        const startGame = () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('CharacterSelectScene');
            });
        };
        if (this.input.keyboard) this.input.keyboard.on('keydown-ENTER', startGame);
        this.input.on('pointerdown', startGame);
    }
}
