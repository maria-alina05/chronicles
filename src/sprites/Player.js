export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, playerNum) {
        const texture = playerNum === 1 ? 'zanuff' : 'marabeige';
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.playerNum = playerNum;
        this.playerName = playerNum === 1 ? 'Zanuff' : 'Marabeige';
        this.health = 5;
        this.maxHealth = 5;
        this.lives = 5;
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.invincible = false;
        this.facing = 1; // 1 = right, -1 = left
        this.jumpTexture = playerNum === 1 ? 'zanuff-jump' : 'marabeige-jump';
        this.normalTexture = texture;
        
        this.setCollideWorldBounds(true);
        this.setBounce(0.1);
        this.setScale(1);
        this.body.setSize(30, 66);
        this.body.setOffset(9, 6);
        
        // Setup controls
        if (playerNum === 1) {
            this.keys = {
                left: scene.input.keyboard.addKey('A'),
                right: scene.input.keyboard.addKey('D'),
                jump: scene.input.keyboard.addKey('W'),
                attack: scene.input.keyboard.addKey('E')
            };
        } else {
            this.keys = {
                left: scene.input.keyboard.addKey('LEFT'),
                right: scene.input.keyboard.addKey('RIGHT'),
                jump: scene.input.keyboard.addKey('UP'),
                attack: scene.input.keyboard.addKey('SPACE')
            };
        }
    }

    update(time, delta) {
        if (this.attackCooldown > 0) {
            this.attackCooldown -= delta;
        }

        // Movement
        if (this.keys.left.isDown) {
            this.setVelocityX(-200);
            this.setFlipX(true);
            this.facing = -1;
        } else if (this.keys.right.isDown) {
            this.setVelocityX(200);
            this.setFlipX(false);
            this.facing = 1;
        } else {
            this.setVelocityX(0);
        }

        // Jump
        if (Phaser.Input.Keyboard.JustDown(this.keys.jump) && this.body.blocked.down) {
            this.setVelocityY(-450);
        }

        // Texture swap for jumping
        if (!this.body.blocked.down) {
            this.setTexture(this.jumpTexture);
        } else {
            this.setTexture(this.normalTexture);
        }

        // Attack
        if (Phaser.Input.Keyboard.JustDown(this.keys.attack) && this.attackCooldown <= 0) {
            this.attack();
        }
    }

    attack() {
        this.isAttacking = true;
        this.attackCooldown = 400;
        
        // Create attack hitbox - wide range
        const attackX = this.x + (this.facing * 40);
        const attackZone = this.scene.add.rectangle(attackX, this.y, 60, 50, 0xffff00, 0.5);
        this.scene.physics.add.existing(attackZone, true);
        
        // Persistent overlap that lasts for the attack duration
        const hitEnemies = new Set();
        let overlapCollider = null;
        if (this.scene.enemies) {
            overlapCollider = this.scene.physics.add.overlap(attackZone, this.scene.enemies, (zone, enemy) => {
                if (!hitEnemies.has(enemy)) {
                    hitEnemies.add(enemy);
                    enemy.takeDamage(2);
                }
            });
        }
        
        // Flash effect
        this.setTint(0xffffaa);
        this.scene.time.delayedCall(200, () => {
            this.clearTint();
            if (overlapCollider) {
                this.scene.physics.world.removeCollider(overlapCollider);
            }
            attackZone.destroy();
            this.isAttacking = false;
        });
    }

    takeDamage(amount) {
        if (this.invincible) return;
        
        this.health -= amount;
        this.invincible = true;
        
        // Flash red
        this.scene.tweens.add({
            targets: this,
            alpha: 0.3,
            duration: 100,
            yoyo: true,
            repeat: 5,
            onComplete: () => {
                this.alpha = 1;
                this.invincible = false;
            }
        });
        
        if (this.health <= 0) {
            this.lives--;
            this.scene.playerDied(this);
        }
    }

    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
}
