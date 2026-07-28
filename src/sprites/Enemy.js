export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type, config = {}) {
        const texture = `enemy-${type}` || 'enemy-generic';
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.enemyType = type;
        this.health = config.health || 2;
        this.damage = config.damage || 1;
        this.speed = config.speed || 80;
        this.patrolRange = config.patrolRange || 100;
        this.startX = x;
        this.direction = 1;
        this.floating = config.floating || false;
        
        this.setScale(1.2);
        this.setBounce(0.1);
        
        if (this.floating) {
            this.body.setAllowGravity(false);
            this.floatTween = scene.tweens.add({
                targets: this,
                y: y - 20,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    update(time, delta) {
        if (this.floating) return;
        
        // Patrol behavior
        if (this.x > this.startX + this.patrolRange) {
            this.direction = -1;
            this.setFlipX(true);
        } else if (this.x < this.startX - this.patrolRange) {
            this.direction = 1;
            this.setFlipX(false);
        }
        
        this.setVelocityX(this.speed * this.direction);
    }

    takeDamage(amount) {
        this.health -= amount;
        
        // Flash white
        this.setTint(0xffffff);
        this.scene.time.delayedCall(100, () => {
            this.clearTint();
        });
        
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        // Death particles
        const particles = this.scene.add.particles(this.x, this.y, null, {
            speed: { min: 50, max: 150 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            lifespan: 500,
            quantity: 8,
            emitting: false
        });
        
        // Create small colored squares as particles
        for (let i = 0; i < 6; i++) {
            const px = this.x + Phaser.Math.Between(-10, 10);
            const py = this.y + Phaser.Math.Between(-10, 10);
            const particle = this.scene.add.rectangle(px, py, 4, 4, 0xffaa00);
            this.scene.tweens.add({
                targets: particle,
                x: px + Phaser.Math.Between(-40, 40),
                y: py + Phaser.Math.Between(-60, -20),
                alpha: 0,
                scale: 0,
                duration: 400,
                onComplete: () => particle.destroy()
            });
        }
        
        // Score
        if (this.scene.addScore) {
            this.scene.addScore(10);
        }
        
        this.destroy();
    }
}
