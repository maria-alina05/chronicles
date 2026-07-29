import { COLORS } from '../constants.js';

export class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CharacterSelectScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        this.cameras.main.fadeIn(400);

        // Background
        this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a1e);

        // Stars
        for (let i = 0; i < 60; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                Phaser.Math.Between(1, 2),
                0xffffff,
                Phaser.Math.FloatBetween(0.2, 0.8)
            );
            this.tweens.add({
                targets: star, alpha: 0.1, duration: Phaser.Math.Between(1000, 3000),
                yoyo: true, repeat: -1
            });
        }

        // Title
        this.add.text(width / 2, 30, 'Choose Your Hero', {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: '#ffd700'
        }).setOrigin(0.5);

        this.add.text(width / 2, 55, 'Tap or click to select', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#888899'
        }).setOrigin(0.5);

        // Layout: side-by-side in landscape, stacked in portrait
        const isLandscape = width > height;
        const cardW = isLandscape ? 360 : 400;
        const cardH = isLandscape ? height - 120 : 200;
        const zanuffX = isLandscape ? width * 0.27 : width / 2;
        const zanuffY = isLandscape ? height / 2 + 25 : 210;
        const marabeigeX = isLandscape ? width * 0.73 : width / 2;
        const marabeigeY = isLandscape ? height / 2 + 25 : 420;

        // --- ZANUFF CARD ---

        const zanuffCard = this.add.rectangle(zanuffX, zanuffY, cardW, cardH, 0x111133, 0.9)
            .setStrokeStyle(3, 0x6688ff)
            .setInteractive({ useHandCursor: true });

        const zImgOffset = isLandscape ? 0 : -130;
        const zImgY = isLandscape ? zanuffY - 80 : zanuffY;
        this.add.image(zanuffX + zImgOffset, zImgY, 'zanuff').setScale(2);

        const zTextX = isLandscape ? zanuffX : zanuffX + 40;
        const zTextBaseY = isLandscape ? zanuffY + 10 : zanuffY - 50;

        this.add.text(zTextX, zTextBaseY, 'ZANUFF', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#6688ff'
        }).setOrigin(0.5);

        this.add.text(zTextX, zTextBaseY + 22, 'The Gamer', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#aabbff'
        }).setOrigin(0.5);

        this.add.text(zTextX, zTextBaseY + 62, '+ High damage\n+ Tanky (7 HP)\n- Slower movement\n- HATES melons', {
            fontFamily: '"Press Start 2P"',
            fontSize: '7px',
            color: '#8899aa',
            align: 'center',
            lineSpacing: 6
        }).setOrigin(0.5);

        this.add.text(zTextX, zTextBaseY + 115, 'Weapon: Taric Dazzle', {
            fontFamily: '"Press Start 2P"',
            fontSize: '7px',
            color: '#ffaa44'
        }).setOrigin(0.5);

        // --- MARABEIGE CARD ---

        const marabeigeCard = this.add.rectangle(marabeigeX, marabeigeY, cardW, cardH, 0x331122, 0.9)
            .setStrokeStyle(3, 0xff6688)
            .setInteractive({ useHandCursor: true });

        const mImgOffset = isLandscape ? 0 : -130;
        const mImgY = isLandscape ? marabeigeY - 80 : marabeigeY;
        this.add.image(marabeigeX + mImgOffset, mImgY, 'marabeige').setScale(2);

        const mTextX = isLandscape ? marabeigeX : marabeigeX + 40;
        const mTextBaseY = isLandscape ? marabeigeY + 10 : marabeigeY - 50;

        this.add.text(mTextX, mTextBaseY, 'MARABEIGE', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#ff6688'
        }).setOrigin(0.5);

        this.add.text(mTextX, mTextBaseY + 22, 'The Home Cook', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#ffaacc'
        }).setOrigin(0.5);

        this.add.text(mTextX, mTextBaseY + 62, '+ Fast movement\n+ Rapid attacks\n- Less HP (5)\n- Allergic to flowers\n- Afraid of heights', {
            fontFamily: '"Press Start 2P"',
            fontSize: '7px',
            color: '#8899aa',
            align: 'center',
            lineSpacing: 6
        }).setOrigin(0.5);

        this.add.text(mTextX, mTextBaseY + 125, 'Weapon: Sweet Bolts', {
            fontFamily: '"Press Start 2P"',
            fontSize: '7px',
            color: '#ffaa44'
        }).setOrigin(0.5);

        // --- SELECTION LOGIC ---
        
        zanuffCard.on('pointerover', () => zanuffCard.setStrokeStyle(3, 0xaabbff));
        zanuffCard.on('pointerout', () => zanuffCard.setStrokeStyle(3, 0x6688ff));
        zanuffCard.on('pointerdown', () => this.selectCharacter('zanuff'));

        marabeigeCard.on('pointerover', () => marabeigeCard.setStrokeStyle(3, 0xffaacc));
        marabeigeCard.on('pointerout', () => marabeigeCard.setStrokeStyle(3, 0xff6688));
        marabeigeCard.on('pointerdown', () => this.selectCharacter('marabeige'));

        // Keyboard shortcuts
        if (this.input.keyboard) {
            this.input.keyboard.on('keydown-ONE', () => this.selectCharacter('zanuff'));
            this.input.keyboard.on('keydown-TWO', () => this.selectCharacter('marabeige'));
        }
        
        // Number hints
        this.add.text(zanuffX + cardW / 2 - 30, zanuffY - cardH / 2 + 10, '[1]', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#555577'
        }).setOrigin(0.5);
        
        this.add.text(marabeigeX + cardW / 2 - 30, marabeigeY - cardH / 2 + 10, '[2]', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#555577'
        }).setOrigin(0.5);
    }

    selectCharacter(character) {
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.time.delayedCall(400, () => {
            this.scene.start('StoryScene', { levelIndex: 0, isIntro: true, character });
        });
    }
}
