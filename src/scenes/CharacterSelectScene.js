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

        const isLandscape = width > height;

        // Title
        const titleY = isLandscape ? 30 : height * 0.045;
        const subtitleY = titleY + (isLandscape ? 28 : 32);

        this.add.text(width / 2, titleY, 'Choose Your Hero', {
            fontFamily: '"Press Start 2P"',
            fontSize: '26px',
            color: '#ffd700'
        }).setOrigin(0.5);

        this.add.text(width / 2, subtitleY, 'Tap or click to select', {
            fontFamily: '"Press Start 2P"',
            fontSize: '15px',
            color: '#888899'
        }).setOrigin(0.5);

        // Layout: side-by-side in landscape, stacked in portrait.
        // Card content itself always stacks vertically (image -> name -> stats -> weapon)
        // so it stays readable and non-overlapping regardless of card width.
        const contentTop = subtitleY + (isLandscape ? 30 : 34);
        const contentBottom = height - (isLandscape ? 20 : 24);

        let cardW, cardH, zanuffX, zanuffY, marabeigeX, marabeigeY;
        if (isLandscape) {
            cardW = 380;
            cardH = contentBottom - contentTop;
            zanuffX = width * 0.27;
            zanuffY = contentTop + cardH / 2;
            marabeigeX = width * 0.73;
            marabeigeY = zanuffY;
        } else {
            cardW = Math.min(width - 32, 520);
            const gap = 20;
            cardH = (contentBottom - contentTop - gap) / 2;
            zanuffX = width / 2;
            zanuffY = contentTop + cardH / 2;
            marabeigeX = width / 2;
            marabeigeY = contentTop + cardH + gap + cardH / 2;
        }

        const zanuffCard = this.createHeroCard({
            x: zanuffX, y: zanuffY, w: cardW, h: cardH,
            spriteKey: 'zanuff', fill: 0x111133, stroke: 0x6688ff, hoverStroke: 0xaabbff,
            name: 'THE CRAFTING BARD', nameColor: '#6688ff',
            stats: '+ High damage\n+ Tanky (7 HP)\n- Slower movement\n- HATES melons',
            weapon: 'Weapon: Taric Dazzle',
            hint: '[1]'
        });
        zanuffCard.on('pointerdown', () => this.selectCharacter('zanuff'));

        const marabeigeCard = this.createHeroCard({
            x: marabeigeX, y: marabeigeY, w: cardW, h: cardH,
            spriteKey: 'marabeige', fill: 0x331122, stroke: 0xff6688, hoverStroke: 0xffaacc,
            name: 'THE NONCHALANT DAMSEL', nameColor: '#ff6688',
            stats: '+ Fast movement\n+ Rapid attacks\n- Less HP (5)\n- Allergic to flowers\n- Afraid of heights',
            weapon: 'Weapon: Sweet Bolts',
            hint: '[2]'
        });
        marabeigeCard.on('pointerdown', () => this.selectCharacter('marabeige'));

        // Keyboard shortcuts
        if (this.input.keyboard) {
            this.input.keyboard.on('keydown-ONE', () => this.selectCharacter('zanuff'));
            this.input.keyboard.on('keydown-TWO', () => this.selectCharacter('marabeige'));
        }
    }

    // Builds a hero card with content stacked vertically (image, name, stats, weapon)
    // and vertically centered as a group, so it never overlaps regardless of card size.
    createHeroCard({ x, y, w, h, spriteKey, fill, stroke, hoverStroke, name, nameColor, stats, weapon, hint }) {
        const card = this.add.rectangle(x, y, w, h, fill, 0.9)
            .setStrokeStyle(3, stroke)
            .setInteractive({ useHandCursor: true });

        const sprite = this.add.image(x, 0, spriteKey).setOrigin(0.5, 0).setScale(2.2);

        const textWrapWidth = w - 32;

        const nameText = this.add.text(x, 0, name, {
            fontFamily: '"Press Start 2P"',
            fontSize: '19px',
            color: nameColor,
            align: 'center',
            wordWrap: { width: textWrapWidth, useAdvancedWrap: true }
        }).setOrigin(0.5, 0);

        const statsText = this.add.text(x, 0, stats, {
            fontFamily: '"Press Start 2P"',
            fontSize: '13px',
            color: '#8899aa',
            align: 'center',
            lineSpacing: 10,
            wordWrap: { width: textWrapWidth, useAdvancedWrap: true }
        }).setOrigin(0.5, 0);

        const weaponText = this.add.text(x, 0, weapon, {
            fontFamily: '"Press Start 2P"',
            fontSize: '13px',
            color: '#ffaa44',
            align: 'center',
            wordWrap: { width: textWrapWidth, useAdvancedWrap: true }
        }).setOrigin(0.5, 0);

        // Stack items with gaps, then shift the whole group to be vertically centered in the card.
        const gap = 16;
        const items = [
            { obj: sprite, height: sprite.displayHeight },
            { obj: nameText, height: nameText.height },
            { obj: statsText, height: statsText.height },
            { obj: weaponText, height: weaponText.height }
        ];
        const totalHeight = items.reduce((sum, item) => sum + item.height, 0) + gap * (items.length - 1);
        let cursorY = y - totalHeight / 2;
        items.forEach(({ obj, height }) => {
            obj.setY(cursorY);
            cursorY += height + gap;
        });

        // Number hint
        this.add.text(x + w / 2 - 28, y - h / 2 + 22, hint, {
            fontFamily: '"Press Start 2P"',
            fontSize: '13px',
            color: '#555577'
        }).setOrigin(0.5);

        card.on('pointerover', () => card.setStrokeStyle(3, hoverStroke));
        card.on('pointerout', () => card.setStrokeStyle(3, stroke));

        return card;
    }

    selectCharacter(character) {
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.time.delayedCall(400, () => {
            this.scene.start('LevelSelectScene', { character });
        });
    }
}
