export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type, config = {}) {
        const texture = `enemy-${type}` || 'enemy-generic';
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.enemyType = type;
        this.health = config.health || 2;
        this.maxHealth = this.health;
        this.damage = config.damage || 1;
        this.speed = config.speed || 60;
        this.xpValue = config.xpValue || 1;
        
        this.setScale(config.scale || 1);
        this.setBounce(0);
        this.body.setAllowGravity(false);
        this.setDepth(5);
        
        // Chase behavior
        this.chaseTarget = null;
    }

    update(time, delta) {
        if (!this.active || !this.scene) return;
        
        // Find nearest player to chase
        const player = this.scene.player;
        if (!player || !player.active) return;
        
        // Move toward player
        const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        this.setVelocity(
            Math.cos(angle) * this.speed,
            Math.sin(angle) * this.speed
        );
        
        // Flip sprite based on direction
        this.setFlipX(player.x < this.x);
    }

    takeDamage(amount) {
        this.health -= amount;
        
        this.setTint(0xffffff);
        this.scene.time.delayedCall(60, () => {
            if (this.active) this.clearTint();
        });
        
        // Knockback
        if (this.scene.player) {
            const angle = Phaser.Math.Angle.Between(
                this.scene.player.x, this.scene.player.y, this.x, this.y
            );
            this.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 200);
        }
        
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        // Death particles
        for (let i = 0; i < 5; i++) {
            const px = this.x + Phaser.Math.Between(-8, 8);
            const py = this.y + Phaser.Math.Between(-8, 8);
            const particle = this.scene.add.rectangle(px, py, 4, 4, 0xffaa00);
            this.scene.tweens.add({
                targets: particle,
                x: px + Phaser.Math.Between(-30, 30),
                y: py + Phaser.Math.Between(-30, 30),
                alpha: 0,
                scale: 0,
                duration: 350,
                onComplete: () => particle.destroy()
            });
        }
        
        // Drop XP gem
        if (this.scene.spawnXPGem) {
            this.scene.spawnXPGem(this.x, this.y, this.xpValue);
        }
        
        // Track kill
        if (this.scene.player) {
            this.scene.player.killCount++;
        }
        if (this.scene.addScore) {
            this.scene.addScore(5);
        }
        
        this.destroy();
    }
}
