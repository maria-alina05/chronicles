import { GAME_DATA, COLORS } from '../constants.js';

export class StoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StoryScene' });
    }

    init(data) {
        this.levelIndex = data.levelIndex !== undefined ? data.levelIndex : 0;
        this.isIntro = data.isIntro || false;
        this.isAfter = data.isAfter || false;
        this.selectedCharacter = data.character || 'zanuff';
    }

    create() {
        const { width, height } = this.cameras.main;
        this.cameras.main.fadeIn(500);

        // Dark background with subtle gradient
        this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a1e);

        if (this.isIntro) {
            this.showIntro(width, height);
        } else if (this.isAfter) {
            this.showLevelComplete(width, height);
        } else {
            this.showLevelIntro(width, height);
        }
    }

    showIntro(width, height) {
        const lines = GAME_DATA.intro.description;
        
        // Scene: couch with TV/monitor showing Twitch
        this.drawTwitchScene(width, height);

        // Show text lines one by one
        this.showTextSequence(lines, width, height, () => {
            // After intro text, transition to Level 1
            this.cameras.main.fadeOut(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
                this.scene.start('StoryScene', { levelIndex: 0, isIntro: false, character: this.selectedCharacter });
            });
        });
    }

    drawTwitchScene(width, height) {
        // Living room setup
        // Couch
        this.add.rectangle(width / 2, 330, 240, 60, 0xd4a017).setAlpha(0.9);
        this.add.rectangle(width / 2, 305, 220, 20, 0xe6b422).setAlpha(0.9);
        // Couch cushions
        this.add.rectangle(width / 2 - 50, 330, 80, 40, 0xe6b422, 0.8);
        this.add.rectangle(width / 2 + 50, 330, 80, 40, 0xe6b422, 0.8);

        // TV/Monitor with Twitch
        const tv = this.add.rectangle(width / 2, 180, 200, 130, 0x222222);
        const screen = this.add.rectangle(width / 2, 180, 185, 115, 0x18181b); // dark Twitch bg
        
        // Twitch logo on screen (using generated texture)
        this.add.image(width / 2, 165, 'twitch-logo').setScale(1.5);
        
        // Stream info text
        this.add.text(width / 2, 210, 'Doctorul_', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // LIVE badge
        this.add.rectangle(width / 2 - 60, 140, 36, 14, 0xff0000);
        this.add.text(width / 2 - 60, 140, 'LIVE', {
            fontFamily: '"Press Start 2P"',
            fontSize: '7px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Viewer count
        this.add.text(width / 2 + 50, 140, '2.4K', {
            fontFamily: '"Press Start 2P"',
            fontSize: '6px',
            color: '#ff4444'
        }).setOrigin(0.5);

        // Characters on couch
        this.add.image(width / 2 - 35, 295, 'zanuff').setScale(1.2);
        this.add.image(width / 2 + 35, 298, 'marabeige').setScale(1.2);

        // McDonald's food between them
        const mcGfx = this.add.graphics();
        // Fries box (red with yellow M)
        mcGfx.fillStyle(0xcc0000);
        mcGfx.fillRect(width / 2 - 8, 308, 16, 20);
        mcGfx.fillStyle(0xffcc00);
        // Golden arches M
        mcGfx.fillRect(width / 2 - 5, 312, 3, 8);
        mcGfx.fillRect(width / 2 + 2, 312, 3, 8);
        mcGfx.fillRect(width / 2 - 3, 310, 2, 4);
        mcGfx.fillRect(width / 2 + 1, 310, 2, 4);
        // Fries sticking out
        mcGfx.fillStyle(0xffdd44);
        mcGfx.fillRect(width / 2 - 6, 302, 3, 10);
        mcGfx.fillRect(width / 2 - 2, 300, 3, 12);
        mcGfx.fillRect(width / 2 + 2, 301, 3, 11);
        mcGfx.fillRect(width / 2 + 5, 303, 3, 9);
        // Burger on the other side
        mcGfx.fillStyle(0xd4a043); // bun top
        mcGfx.fillRoundedRect(width / 2 + 15, 315, 20, 8, 4);
        mcGfx.fillStyle(0x228b22); // lettuce
        mcGfx.fillRect(width / 2 + 14, 322, 22, 3);
        mcGfx.fillStyle(0x8b4513); // patty
        mcGfx.fillRect(width / 2 + 15, 325, 20, 5);
        mcGfx.fillStyle(0xffcc00); // cheese
        mcGfx.fillRect(width / 2 + 14, 324, 22, 2);
        mcGfx.fillStyle(0xd4a043); // bun bottom
        mcGfx.fillRect(width / 2 + 15, 330, 20, 6);

        // Controllers in hands
        this.add.image(width / 2 - 55, 320, 'powerup-controller').setScale(0.7);
        this.add.image(width / 2 + 55, 320, 'powerup-controller').setScale(0.7).setFlipX(true);

        // Glitch effect after a moment
        this.time.delayedCall(3000, () => {
            this.tweens.add({
                targets: screen,
                scaleX: 1.5,
                scaleY: 0.1,
                duration: 200,
                yoyo: true,
                repeat: 3,
                onComplete: () => {
                    // White flash - sucked into the game!
                    const flash = this.add.rectangle(width / 2, height / 2, width, height, 0xffffff);
                    this.tweens.add({
                        targets: flash,
                        alpha: 0,
                        duration: 1000
                    });
                }
            });
        });
    }

    showLevelIntro(width, height) {
        const level = GAME_DATA.levels[this.levelIndex];
        
        // Level title card
        const dateText = this.add.text(width / 2, 100, level.date, {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#ffd700'
        }).setOrigin(0.5).setAlpha(0);

        const titleText = this.add.text(width / 2, 140, `Level ${level.id}: ${level.title}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: '#e94560'
        }).setOrigin(0.5).setAlpha(0);

        const descText = this.add.text(width / 2, 200, level.description, {
            fontFamily: '"Press Start 2P"',
            fontSize: '9px',
            color: '#ccccee',
            wordWrap: { width: 700 },
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5).setAlpha(0);

        // Story dialogue
        const storyLines = level.storyBefore || [];
        
        // Animate in
        this.tweens.add({
            targets: dateText,
            alpha: 1,
            y: 110,
            duration: 800,
            delay: 300
        });
        this.tweens.add({
            targets: titleText,
            alpha: 1,
            y: 150,
            duration: 800,
            delay: 600
        });
        this.tweens.add({
            targets: descText,
            alpha: 1,
            duration: 800,
            delay: 1000
        });

        // Show story dialogue below
        if (storyLines.length > 0) {
            storyLines.forEach((line, i) => {
                const speaker = i % 2 === 0 ? 'Zanuff' : 'Marabeige';
                const color = i % 2 === 0 ? '#6688ff' : '#ff6688';
                const dialogText = this.add.text(width / 2, 280 + i * 50, `${speaker}: "${line}"`, {
                    fontFamily: '"Press Start 2P"',
                    fontSize: '9px',
                    color: color,
                    wordWrap: { width: 700 },
                    align: 'center'
                }).setOrigin(0.5).setAlpha(0);

                this.tweens.add({
                    targets: dialogText,
                    alpha: 1,
                    duration: 600,
                    delay: 1500 + i * 800
                });
            });
        }

        // Flower warning
        if (level.flowers) {
            const warningText = this.add.text(width / 2, 420, '! Flowers ahead - Zanuff, protect Marabeige!', {
                fontFamily: '"Press Start 2P"',
                fontSize: '8px',
                color: '#ff8844',
                wordWrap: { width: 600 },
                align: 'center'
            }).setOrigin(0.5).setAlpha(0);

            this.tweens.add({
                targets: warningText,
                alpha: 1,
                duration: 600,
                delay: 3000
            });
        }

        // Continue prompt
        const continueText = this.add.text(width / 2, 490, 'Tap to start', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#ffffff'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: continueText,
            alpha: 1,
            duration: 400,
            delay: 3500,
            onComplete: () => {
                this.tweens.add({
                    targets: continueText,
                    alpha: 0.3,
                    duration: 500,
                    yoyo: true,
                    repeat: -1
                });
            }
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                const sceneKey = `Level${this.levelIndex + 1}Scene`;
                this.scene.start(sceneKey, { character: this.selectedCharacter });
            });
        });
        this.input.on('pointerdown', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                const sceneKey = `Level${this.levelIndex + 1}Scene`;
                this.scene.start(sceneKey, { character: this.selectedCharacter });
            });
        });
    }

    showLevelComplete(width, height) {
        const level = GAME_DATA.levels[this.levelIndex];
        const storyLines = level.storyAfter || [];

        // Victory banner
        this.add.text(width / 2, 80, 'LEVEL COMPLETE!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '20px',
            color: '#ffd700'
        }).setOrigin(0.5);

        this.add.text(width / 2, 120, level.title, {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#e94560'
        }).setOrigin(0.5);

        // Characters celebrating
        const zanuff = this.add.image(width / 2 - 40, 220, 'zanuff-jump').setScale(2.5);
        const marabeige = this.add.image(width / 2 + 40, 225, 'marabeige-jump').setScale(2.5);
        
        this.tweens.add({
            targets: [zanuff, marabeige],
            y: '-=10',
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // Hearts floating up
        for (let i = 0; i < 5; i++) {
            const hx = Phaser.Math.Between(width / 2 - 80, width / 2 + 80);
            const heart = this.add.image(hx, 300, 'heart').setScale(0.5).setAlpha(0);
            this.tweens.add({
                targets: heart,
                y: 100,
                alpha: { from: 1, to: 0 },
                duration: 2000,
                delay: i * 400,
                repeat: -1
            });
        }

        // Story after lines
        storyLines.forEach((line, i) => {
            const color = i % 2 === 0 ? '#aaddff' : '#ffaadd';
            this.add.text(width / 2, 330 + i * 40, `"${line}"`, {
                fontFamily: '"Press Start 2P"',
                fontSize: '9px',
                color: color,
                wordWrap: { width: 700 },
                align: 'center'
            }).setOrigin(0.5);
        });

        // Continue
        const nextLevelIndex = this.levelIndex + 1;
        const isLastLevel = nextLevelIndex >= GAME_DATA.levels.length;
        const promptText = isLastLevel ? 'Tap for the finale' : 'Tap for next chapter';
        
        const continueText = this.add.text(width / 2, 480, promptText, {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: continueText,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                if (isLastLevel) {
                    this.scene.start('EndingScene');
                } else {
                    this.scene.start('StoryScene', { levelIndex: nextLevelIndex, character: this.selectedCharacter });
                }
            });
        });
        this.input.on('pointerdown', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                if (isLastLevel) {
                    this.scene.start('EndingScene');
                } else {
                    this.scene.start('StoryScene', { levelIndex: nextLevelIndex, character: this.selectedCharacter });
                }
            });
        });
    }

    showTextSequence(lines, width, height, onComplete) {
        let currentLine = 0;
        const textObjects = [];

        const showNext = () => {
            if (currentLine >= lines.length) {
                // Show continue prompt
                const cont = this.add.text(width / 2, 510, 'Tap to continue', {
                    fontFamily: '"Press Start 2P"',
                    fontSize: '10px',
                    color: '#ffffff'
                }).setOrigin(0.5);
                this.tweens.add({
                    targets: cont,
                    alpha: 0.3,
                    duration: 500,
                    yoyo: true,
                    repeat: -1
                });
                this.input.keyboard.once('keydown-ENTER', onComplete);
                this.input.once('pointerdown', onComplete);
                return;
            }

            const yPos = 380 + currentLine * 25;
            const text = this.add.text(width / 2, yPos, lines[currentLine], {
                fontFamily: '"Press Start 2P"',
                fontSize: '10px',
                color: '#ccccee',
                wordWrap: { width: 700 },
                align: 'center'
            }).setOrigin(0.5).setAlpha(0);

            this.tweens.add({
                targets: text,
                alpha: 1,
                duration: 600,
                onComplete: () => {
                    currentLine++;
                    this.time.delayedCall(800, showNext);
                }
            });
        };

        this.time.delayedCall(4000, showNext);
    }
}
