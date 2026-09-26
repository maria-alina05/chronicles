import { GAME_DATA } from '../constants.js';

export class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelectScene' });
    }

    init(data) {
        this.selectedCharacter = data.character || 'zanuff';
    }

    create() {
        const { width, height } = this.cameras.main;
        this.cameras.main.fadeIn(400);
        const isLandscape = width > height;

        // Background
        this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a1e);

        // Stars
        for (let i = 0; i < 40; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                Phaser.Math.Between(1, 2),
                0xffffff,
                Phaser.Math.FloatBetween(0.2, 0.7)
            );
            this.tweens.add({
                targets: star, alpha: 0.1, duration: Phaser.Math.Between(1000, 3000),
                yoyo: true, repeat: -1
            });
        }

        // Title
        this.add.text(width / 2, height * 0.06, 'Select Chapter', {
            fontFamily: '"Press Start 2P"',
            fontSize: isLandscape ? '17px' : '19px',
            color: '#ffd700'
        }).setOrigin(0.5);

        // Layout: 3x2 grid in landscape, 2x3 or stacked in portrait
        const levels = GAME_DATA.levels;
        const cols = isLandscape ? 3 : 2;
        const rows = Math.ceil(levels.length / cols);
        
        const cardW = isLandscape ? Math.min(280, (width - 80) / cols) : Math.min(260, (width - 48) / cols);
        const cardH = isLandscape ? Math.min(130, (height - 100) / rows) : Math.min(140, (height - 100) / rows);
        const gapX = (width - cols * cardW) / (cols + 1);
        const gapY = (height - 60 - rows * cardH) / (rows + 1);
        const startY = 60 + gapY;

        levels.forEach((level, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const cx = gapX + cardW / 2 + col * (cardW + gapX);
            const cy = startY + cardH / 2 + row * (cardH + gapY);

            const colors = [0x223355, 0x332244, 0x224433, 0x442233, 0x334422, 0x332255];
            const borderColors = [0x4488ff, 0xaa44ff, 0x44ff88, 0xff4488, 0x88ff44, 0x8844ff];

            const card = this.add.rectangle(cx, cy, cardW - 8, cardH - 8, colors[i], 0.9)
                .setStrokeStyle(2, borderColors[i])
                .setInteractive({ useHandCursor: true });

            // Level number
            this.add.text(cx, cy - cardH * 0.25, `${level.id}`, {
                fontFamily: '"Press Start 2P"',
                fontSize: '20px',
                color: '#ffd700'
            }).setOrigin(0.5);

            // Title
            this.add.text(cx, cy + 4, level.title, {
                fontFamily: '"Press Start 2P"',
                fontSize: '10px',
                color: '#ffffff',
                align: 'center',
                wordWrap: { width: cardW - 24 }
            }).setOrigin(0.5);

            // Date
            this.add.text(cx, cy + cardH * 0.30, level.date, {
                fontFamily: '"Press Start 2P"',
                fontSize: '9px',
                color: '#888899'
            }).setOrigin(0.5);

            card.on('pointerover', () => card.setStrokeStyle(3, 0xffd700));
            card.on('pointerout', () => card.setStrokeStyle(2, borderColors[i]));
            card.on('pointerdown', () => this.selectLevel(i));
        });

        // Keyboard shortcuts
        if (this.input.keyboard) {
            for (let i = 0; i < levels.length; i++) {
                this.input.keyboard.on(`keydown-${i + 1}`, () => this.selectLevel(i));
            }
        }

        // Back button
        const backBtnBg = this.add.rectangle(70, height - 30, 120, 48, 0x222244, 0.85)
            .setStrokeStyle(2, 0x666699)
            .setInteractive({ useHandCursor: true });
        const backBtn = this.add.text(70, height - 30, '< Back', {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#cccccc'
        }).setOrigin(0.5);
        backBtnBg.on('pointerover', () => backBtn.setColor('#ffffff'));
        backBtnBg.on('pointerout', () => backBtn.setColor('#cccccc'));
        backBtnBg.on('pointerdown', () => {
            this.cameras.main.fadeOut(300);
            this.time.delayedCall(300, () => {
                this.scene.start('CharacterSelectScene');
            });
        });
    }

    selectLevel(levelIndex) {
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.time.delayedCall(400, () => {
            if (levelIndex === 0) {
                // Level 1 gets the intro story
                this.scene.start('StoryScene', { levelIndex: 0, isIntro: true, character: this.selectedCharacter });
            } else {
                // Other levels go straight to their story intro
                this.scene.start('StoryScene', { levelIndex, isIntro: false, character: this.selectedCharacter });
            }
        });
    }
}
