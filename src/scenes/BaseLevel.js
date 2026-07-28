import { Player } from '../sprites/Player.js';
import { Enemy } from '../sprites/Enemy.js';
import { GAME_DATA } from '../constants.js';

export class BaseLevel extends Phaser.Scene {
    constructor(key, levelIndex) {
        super({ key });
        this.levelIndex = levelIndex;
        this.levelData = GAME_DATA.levels[levelIndex];
    }

    create() {
        const { width, height } = this.cameras.main;
        this.cameras.main.fadeIn(500);
        
        this.score = 0;
        this.levelWidth = 3200; // Scrollable level width
        
        // Set world bounds
        this.physics.world.setBounds(0, 0, this.levelWidth, height);
        
        // Background
        this.createBackground();
        
        // Ground and platforms
        this.platforms = this.physics.add.staticGroup();
        this.createLevel();
        
        // Flowers (hazards for Marabeige)
        this.flowers = this.physics.add.staticGroup();
        this.createFlowers();
        
        // Enemies
        this.enemies = this.physics.add.group();
        this.createEnemies();
        
        // Collectibles
        this.collectibles = this.physics.add.group();
        this.createCollectibles();
        
        // Players
        this.player1 = new Player(this, 80, height - 120, 1); // Zanuff
        this.player2 = new Player(this, 130, height - 120, 2); // Marabeige
        
        // Spray projectiles group (Zanuff's anti-flower ability)
        this.sprays = this.physics.add.group();
        
        // Dog companions (appear from level 3 onward)
        this.dogs = [];
        if (this.levelIndex >= 2) {
            this.createDogCompanions();
        }
        
        // Collisions
        this.physics.add.collider(this.player1, this.platforms);
        this.physics.add.collider(this.player2, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);
        
        // Player vs enemies
        this.physics.add.overlap(this.player1, this.enemies, this.playerHitEnemy, null, this);
        this.physics.add.overlap(this.player2, this.enemies, this.playerHitEnemy, null, this);
        
        // Marabeige vs flowers (she takes damage)
        this.physics.add.overlap(this.player2, this.flowers, this.flowerAllergy, null, this);
        
        // Zanuff spray vs flowers (destroys them)
        this.physics.add.overlap(this.sprays, this.flowers, this.sprayHitsFlower, null, this);
        
        // Collectibles
        this.physics.add.overlap(this.player1, this.collectibles, this.collectItem, null, this);
        this.physics.add.overlap(this.player2, this.collectibles, this.collectItem, null, this);
        
        // Camera follows midpoint of both players
        this.cameras.main.setBounds(0, 0, this.levelWidth, height);
        
        // Level end zone
        this.endZone = this.add.rectangle(this.levelWidth - 60, height - 100, 40, 80, 0xffd700, 0.5);
        this.physics.add.existing(this.endZone, true);
        this.physics.add.overlap(this.player1, this.endZone, this.checkLevelEnd, null, this);
        this.physics.add.overlap(this.player2, this.endZone, this.checkLevelEnd, null, this);
        this.player1AtEnd = false;
        this.player2AtEnd = false;
        
        // End zone visual - flag/portal
        this.add.text(this.levelWidth - 60, height - 160, '!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '20px',
            color: '#ffd700'
        }).setOrigin(0.5);
        
        // HUD
        this.createHUD();
        
        // Zanuff's spray ability (enhanced E key - hold to aim)
        this.sprayKey = this.input.keyboard.addKey('E');
        this.sprayCooldown = 0;
        
        // Easter egg references
        this.createEasterEggs();
    }

    update(time, delta) {
        this.player1.update(time, delta);
        this.player2.update(time, delta);
        
        // Update enemies
        this.enemies.children.entries.forEach(enemy => {
            if (enemy.update) enemy.update(time, delta);
        });
        
        // Update dog companions
        this.dogs.forEach(dog => {
            if (dog.update) dog.update(time, delta);
        });
        
        // Camera follows midpoint between players
        const midX = (this.player1.x + this.player2.x) / 2;
        const midY = (this.player1.y + this.player2.y) / 2;
        this.cameras.main.scrollX = midX - 480;
        this.cameras.main.scrollY = Math.min(0, midY - 270);
        
        // Zanuff's spray mechanic (separate from regular attack)
        if (this.sprayCooldown > 0) {
            this.sprayCooldown -= delta;
        }
        if (Phaser.Input.Keyboard.JustDown(this.sprayKey) && this.sprayCooldown <= 0) {
            this.fireSpray();
        }
        
        // Update HUD
        this.updateHUD();
        
        // Keep players in bounds
        if (this.player1.x < 16) this.player1.x = 16;
        if (this.player2.x < 16) this.player2.x = 16;
    }

    fireSpray() {
        this.sprayCooldown = 600;
        
        const spray = this.add.rectangle(
            this.player1.x + (this.player1.facing * 20),
            this.player1.y - 5,
            16, 8,
            0x44ffaa, 0.8
        );
        this.physics.add.existing(spray);
        spray.body.setAllowGravity(false);
        spray.body.setVelocityX(this.player1.facing * 400);
        
        this.sprays.add(spray);
        
        // Trail effect
        this.tweens.add({
            targets: spray,
            alpha: 0,
            scaleX: 2,
            duration: 800,
            onComplete: () => spray.destroy()
        });
        
        // Visual feedback on Zanuff
        this.player1.setTint(0x44ffaa);
        this.time.delayedCall(150, () => this.player1.clearTint());
    }

    sprayHitsFlower(spray, flower) {
        // Destroy flower with particle effect
        for (let i = 0; i < 4; i++) {
            const petal = this.add.circle(
                flower.x + Phaser.Math.Between(-8, 8),
                flower.y + Phaser.Math.Between(-8, 8),
                3, 0x44ff44
            );
            this.tweens.add({
                targets: petal,
                y: petal.y - 30,
                alpha: 0,
                duration: 500,
                onComplete: () => petal.destroy()
            });
        }
        
        // Score bonus for protecting Marabeige
        this.addScore(15);
        
        // Show "Protected!" text
        const protectText = this.add.text(flower.x, flower.y - 20, '+15 Protected!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '7px',
            color: '#44ffaa'
        }).setOrigin(0.5);
        this.tweens.add({
            targets: protectText,
            y: protectText.y - 30,
            alpha: 0,
            duration: 800,
            onComplete: () => protectText.destroy()
        });
        
        flower.destroy();
        spray.destroy();
    }

    flowerAllergy(player, flower) {
        if (player.invincible) return;
        
        // Marabeige sneezes! Knockback + damage
        player.takeDamage(1);
        player.setVelocityX(-player.facing * 200);
        player.setVelocityY(-150);
        
        // Sneeze effect
        const sneeze = this.add.text(player.x, player.y - 30, 'ACHOO!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#ffff00'
        }).setOrigin(0.5);
        this.tweens.add({
            targets: sneeze,
            y: sneeze.y - 40,
            alpha: 0,
            duration: 800,
            onComplete: () => sneeze.destroy()
        });
    }

    playerHitEnemy(player, enemy) {
        if (player.invincible) return;
        
        // Check if player is jumping on enemy (stomp)
        if (player.body.velocity.y > 0 && player.y < enemy.y - 10) {
            enemy.takeDamage(1);
            player.setVelocityY(-250); // Bounce
        } else {
            player.takeDamage(enemy.damage || 1);
        }
    }

    collectItem(player, item) {
        const type = item.getData('type');
        
        if (type === 'controller') {
            this.addScore(25);
            // Temporary speed boost for both players
            this.player1.setVelocityX(this.player1.body.velocity.x * 1.5);
            this.player2.setVelocityX(this.player2.body.velocity.x * 1.5);
        } else if (type === 'heart') {
            player.heal(1);
        }
        
        // Pickup effect
        const text = this.add.text(item.x, item.y - 10, type === 'controller' ? '+25' : '+HP', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#ffd700'
        }).setOrigin(0.5);
        this.tweens.add({
            targets: text,
            y: text.y - 30,
            alpha: 0,
            duration: 600,
            onComplete: () => text.destroy()
        });
        
        item.destroy();
    }

    checkLevelEnd(player, zone) {
        if (player === this.player1) this.player1AtEnd = true;
        if (player === this.player2) this.player2AtEnd = true;
        
        // Both players must reach the end together
        if (this.player1AtEnd && this.player2AtEnd) {
            this.levelComplete();
        }
    }

    levelComplete() {
        // Prevent double-trigger
        if (this.completing) return;
        this.completing = true;
        
        this.physics.pause();
        
        // Victory fanfare
        const { width, height } = this.cameras.main;
        const cx = this.cameras.main.scrollX + width / 2;
        const cy = this.cameras.main.scrollY + height / 2;
        
        const victoryText = this.add.text(cx, cy, 'LEVEL CLEAR!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            color: '#ffd700'
        }).setOrigin(0.5).setScrollFactor(0);
        
        this.tweens.add({
            targets: victoryText,
            scale: 1.2,
            duration: 300,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                this.cameras.main.fadeOut(1000, 0, 0, 0);
                this.time.delayedCall(1000, () => {
                    this.scene.start('StoryScene', { levelIndex: this.levelIndex, isAfter: true });
                });
            }
        });
    }

    playerDied(player) {
        if (player.lives <= 0) {
            // Game over for this player - disable them
            player.setActive(false).setVisible(false);
            player.body.enable = false;
            this.cameras.main.shake(300, 0.02);
            
            // Show death text
            const deathText = this.add.text(player.x, player.y - 40, `${player.playerName} is down!`, {
                fontFamily: '"Press Start 2P"',
                fontSize: '8px',
                color: '#ff4444'
            }).setOrigin(0.5).setScrollFactor(0);
            this.tweens.add({ targets: deathText, alpha: 0, duration: 2000, onComplete: () => deathText.destroy() });
            return;
        }
        
        // Auto-respawn with brief invincibility
        player.health = player.maxHealth;
        player.setVelocity(0, 0);
        player.setPosition(80, this.cameras.main.height - 120);
        player.invincible = true;
        player.setAlpha(0.4);
        
        // Flash screen red
        this.cameras.main.flash(300, 255, 0, 0);
        
        // Show lives remaining
        const livesText = this.add.text(this.cameras.main.worldView.centerX, 100, 
            `${player.playerName}: ${player.lives} lives left`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
        this.tweens.add({ targets: livesText, alpha: 0, y: 70, duration: 1500, onComplete: () => livesText.destroy() });
        
        // End invincibility after 2 seconds
        this.time.delayedCall(2000, () => {
            player.setAlpha(1);
            player.invincible = false;
        });
    }

    addScore(points) {
        this.score += points;
    }

    createBackground() {
        // Override in subclasses for themed backgrounds
        const { width, height } = this.cameras.main;
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a3e, 0x1a1a3e, 0x2a2a4e, 0x2a2a4e);
        bg.fillRect(0, 0, this.levelWidth, height);
        bg.setScrollFactor(0.2);
    }

    createLevel() {
        // Base ground - override in subclasses
        const { height } = this.cameras.main;
        const tileTexture = this.getTileTexture();
        
        for (let x = 0; x < this.levelWidth; x += 32) {
            this.platforms.create(x + 16, height - 16, tileTexture);
        }
    }

    createFlowers() {
        // Override in subclasses to place level-specific flowers
        const { height } = this.cameras.main;
        const flowerPositions = this.getFlowerPositions();
        
        flowerPositions.forEach(pos => {
            const flower = this.createFlowerSprite(pos.x, pos.y);
            this.flowers.add(flower);
        });
    }

    createFlowerSprite(x, y) {
        const gfx = this.add.graphics();
        // Stem
        gfx.fillStyle(0x228b22);
        gfx.fillRect(x - 2, y - 16, 4, 16);
        // Petals (dangerous!)
        gfx.fillStyle(0xff69b4);
        gfx.fillCircle(x, y - 20, 6);
        gfx.fillCircle(x - 5, y - 16, 4);
        gfx.fillCircle(x + 5, y - 16, 4);
        gfx.fillCircle(x, y - 12, 4);
        // Center
        gfx.fillStyle(0xffff00);
        gfx.fillCircle(x, y - 17, 3);
        // Warning glow
        gfx.fillStyle(0xff69b4, 0.2);
        gfx.fillCircle(x, y - 16, 14);
        
        // Create physics body
        const zone = this.add.zone(x, y - 16, 28, 28);
        this.physics.add.existing(zone, true);
        
        // Pollen particle effect
        this.time.addEvent({
            delay: 1500,
            loop: true,
            callback: () => {
                if (!zone.active) return;
                const pollen = this.add.circle(
                    x + Phaser.Math.Between(-10, 10),
                    y - 20,
                    2, 0xffff88, 0.6
                );
                this.tweens.add({
                    targets: pollen,
                    y: pollen.y - Phaser.Math.Between(10, 30),
                    x: pollen.x + Phaser.Math.Between(-15, 15),
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => pollen.destroy()
                });
            }
        });
        
        return zone;
    }

    getFlowerPositions() {
        // Default positions - override in subclasses
        const { height } = this.cameras.main;
        const y = height - 32;
        return [
            { x: 400, y }, { x: 800, y }, { x: 1200, y },
            { x: 1600, y }, { x: 2000, y }, { x: 2500, y }
        ];
    }

    getTileTexture() {
        return 'tile-ground';
    }

    createEnemies() {
        // Override in subclasses
    }

    createCollectibles() {
        // Scatter controllers and hearts throughout the level
        const { height } = this.cameras.main;
        
        const positions = [
            { x: 300, y: height - 100, type: 'controller' },
            { x: 600, y: height - 150, type: 'heart' },
            { x: 1000, y: height - 100, type: 'controller' },
            { x: 1400, y: height - 80, type: 'heart' },
            { x: 1900, y: height - 120, type: 'controller' },
            { x: 2400, y: height - 100, type: 'heart' },
            { x: 2800, y: height - 150, type: 'controller' }
        ];
        
        positions.forEach(pos => {
            const texture = pos.type === 'controller' ? 'powerup-controller' : 'heart';
            const item = this.collectibles.create(pos.x, pos.y, texture);
            item.setData('type', pos.type);
            item.body.setAllowGravity(false);
            item.setScale(0.8);
            
            // Float animation
            this.tweens.add({
                targets: item,
                y: pos.y - 10,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }

    createDogCompanions() {
        // French Bulldog follows Zanuff
        const frenchie = this.add.image(60, this.cameras.main.height - 60, 'dog-frenchie').setScale(1);
        frenchie.followTarget = this.player1;
        frenchie.update = () => {
            const target = frenchie.followTarget;
            const dx = target.x - 40 - frenchie.x;
            frenchie.x += dx * 0.05;
            frenchie.y = target.y + 20;
            frenchie.setFlipX(dx < 0);
        };
        this.dogs.push(frenchie);
        
        // Pug follows Marabeige
        const pug = this.add.image(110, this.cameras.main.height - 60, 'dog-pug').setScale(1);
        pug.followTarget = this.player2;
        pug.update = () => {
            const target = pug.followTarget;
            const dx = target.x + 40 - pug.x;
            pug.x += dx * 0.05;
            pug.y = target.y + 20;
            pug.setFlipX(dx < 0);
        };
        this.dogs.push(pug);
    }

    createEasterEggs() {
        // Override in subclasses for level-specific references
    }

    createHUD() {
        // Fixed HUD elements
        const hudBg = this.add.rectangle(480, 20, 960, 40, 0x000000, 0.6).setScrollFactor(0);
        
        // P1 health
        this.p1HealthText = this.add.text(20, 10, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '9px',
            color: '#6688ff'
        }).setScrollFactor(0);
        
        // P2 health
        this.p2HealthText = this.add.text(700, 10, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '9px',
            color: '#ff6688'
        }).setScrollFactor(0);
        
        // Score
        this.scoreText = this.add.text(400, 10, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '9px',
            color: '#ffd700'
        }).setScrollFactor(0);
        
        // Spray cooldown indicator
        this.sprayIndicator = this.add.text(20, 25, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '7px',
            color: '#44ffaa'
        }).setScrollFactor(0);
    }

    updateHUD() {
        const p1Hearts = '♥'.repeat(Math.max(0, this.player1.health)) + '♡'.repeat(Math.max(0, this.player1.maxHealth - this.player1.health));
        const p2Hearts = '♥'.repeat(Math.max(0, this.player2.health)) + '♡'.repeat(Math.max(0, this.player2.maxHealth - this.player2.health));
        
        this.p1HealthText.setText(`Zanuff ${p1Hearts} x${this.player1.lives}`);
        this.p2HealthText.setText(`Marabeige ${p2Hearts} x${this.player2.lives}`);
        this.scoreText.setText(`Score: ${this.score}`);
        
        if (this.sprayCooldown > 0) {
            this.sprayIndicator.setText('Spray: reloading...');
        } else {
            this.sprayIndicator.setText('Spray: READY [E]');
        }
    }
}
