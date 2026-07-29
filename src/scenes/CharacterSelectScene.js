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
        this.add.text(width / 2, 50, 'Choose Your Hero', {
            fontFamily: '"Press Start 2P"',
            fontSize: '20px',
            color: '#ffd700'
        }).setOrigin(0.5);

        this.add.text(width / 2, 80, 'Tap or click to select', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#888899'
        }).setOrigin(0.5);

        // --- ZANUFF CARD ---
        const zanuffX = width / 2 - 160;
        const cardY = 280;

        const zanuffCard = this.add.rectangle(zanuffX, cardY, 250, 340, 0x111133, 0.9)
            .setStrokeStyle(3, 0x6688ff)
            .setInteractive({ useHandCursor: true });

        this.add.image(zanuffX, cardY - 80, 'zanuff').setScale(2.5);

        this.add.text(zanuffX, cardY + 20, 'ZANUFF', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#6688ff'
        }).setOrigin(0.5);

        this.add.text(zanuffX, cardY + 42, 'The Gamer', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#aabbff'
        }).setOrigin(0.5);

        this.add.text(zanuffX, cardY + 80, '+ High damage\n+ Tanky (7 HP)\n- Slower movement\n- HATES melons', {
            fontFamily: '"Press Start 2P"',
            fontSize: '7px',
            color: '#8899aa',
            align: 'center',
            lineSpacing: 6
        }).setOrigin(0.5);

        this.add.text(zanuffX, cardY + 140, 'Weapon: Taric Dazzle', {
            fontFamily: '"Press Start 2P"',
            fontSize: '7px',
            color: '#ffaa44'
        }).setOrigin(0.5);

        // --- MARABEIGE CARD ---
        const marabeigeX = width / 2 + 160;

        const marabeigeCard = this.add.rectangle(marabeigeX, cardY, 250, 340, 0x331122, 0.9)
            .setStrokeStyle(3, 0xff6688)
            .setInteractive({ useHandCursor: true });

        this.add.image(marabeigeX, cardY - 80, 'marabeige').setScale(2.5);

        this.add.text(marabeigeX, cardY + 20, 'MARABEIGE', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#ff6688'
        }).setOrigin(0.5);

        this.add.text(marabeigeX, cardY + 42, 'The Home Cook', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#ffaacc'
        }).setOrigin(0.5);

        this.add.text(marabeigeX, cardY + 80, '+ Fast movement\n+ Rapid attacks\n- Less HP (5)\n- Allergic to flowers\n- Afraid of heights', {
            fontFamily: '"Press Start 2P"',
            fontSize: '7px',
            color: '#8899aa',
            align: 'center',
            lineSpacing: 6
        }).setOrigin(0.5);

        this.add.text(marabeigeX, cardY + 145, 'Weapon: Sweet Bolts', {
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
        this.input.keyboard.on('keydown-ONE', () => this.selectCharacter('zanuff'));
        this.input.keyboard.on('keydown-TWO', () => this.selectCharacter('marabeige'));
        
        // Number hints
        this.add.text(zanuffX, cardY - 175, '[1]', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#555577'
        }).setOrigin(0.5);
        
        this.add.text(marabeigeX, cardY - 175, '[2]', {
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
