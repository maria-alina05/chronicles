export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, characterId) {
        const texture = characterId === 'zanuff' ? 'zanuff' : 'marabeige';
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.characterId = characterId;
        this.playerName = characterId === 'zanuff' ? 'Zanuff' : 'Marabeige';
        this.normalTexture = texture;
        this.facing = 1;
        
        // Base stats (differ by character)
        if (characterId === 'zanuff') {
            // Zanuff: tankier, hits harder, slower
            this.health = 7;
            this.maxHealth = 7;
            this.moveSpeed = 150;
            this.attackDamage = 2;
            this.attackSpeed = 900;
            this.attackRange = 100;
        } else {
            // Marabeige: faster, nimble, lighter damage
            this.health = 5;
            this.maxHealth = 5;
            this.moveSpeed = 200;
            this.attackDamage = 1;
            this.attackSpeed = 600;
            this.attackRange = 140;
        }
        
        this.lives = 3;
        this.invincible = false;
        this.attackTimer = 0;
        this.xp = 0;
        this.level = 1;
        this.xpToNext = 8;
        this.killCount = 0;
        
        // Character-specific debuff tracking
        this.debuffTimer = 0;
        this.isDebuffed = false;
        
        // Weapons list (auto-firing)
        if (characterId === 'zanuff') {
            this.weapons = [
                { type: 'taric-dazzle', level: 1 } // Taric's gem stun
            ];
        } else {
            this.weapons = [
                { type: 'sweet-bolts', level: 1 } // Homing sweets
            ];
        }
        
        this.setCollideWorldBounds(true);
        this.setBounce(0);
        this.setScale(1);
        this.body.setSize(28, 50);
        this.body.setOffset(10, 11);
        this.setDepth(10);
        
        // Keyboard controls
        if (scene.input.keyboard) {
            this.keys = {
                left: scene.input.keyboard.addKey('A'),
                right: scene.input.keyboard.addKey('D'),
                up: scene.input.keyboard.addKey('W'),
                down: scene.input.keyboard.addKey('S'),
                altLeft: scene.input.keyboard.addKey('LEFT'),
                altRight: scene.input.keyboard.addKey('RIGHT'),
                altUp: scene.input.keyboard.addKey('UP'),
                altDown: scene.input.keyboard.addKey('DOWN')
            };
        } else {
            this.keys = {
                left: { isDown: false }, right: { isDown: false },
                up: { isDown: false }, down: { isDown: false },
                altLeft: { isDown: false }, altRight: { isDown: false },
                altUp: { isDown: false }, altDown: { isDown: false }
            };
        }
        
        // Touch/joystick input (set by scene)
        this.touchVelocity = { x: 0, y: 0 };
    }

    update(time, delta) {
        // 8-directional movement (keyboard + touch)
        let vx = 0;
        let vy = 0;

        if (this.keys.left.isDown || this.keys.altLeft.isDown) vx = -1;
        else if (this.keys.right.isDown || this.keys.altRight.isDown) vx = 1;

        if (this.keys.up.isDown || this.keys.altUp.isDown) vy = -1;
        else if (this.keys.down.isDown || this.keys.altDown.isDown) vy = 1;

        // Touch joystick override
        if (this.touchVelocity.x !== 0 || this.touchVelocity.y !== 0) {
            vx = this.touchVelocity.x;
            vy = this.touchVelocity.y;
        }

        // Normalize diagonal
        const mag = Math.sqrt(vx * vx + vy * vy);
        if (mag > 1) {
            vx /= mag;
            vy /= mag;
        }

        // Apply debuff (Zanuff: melons slow him; Marabeige: pollen/cold slows)
        let speedMult = 1;
        if (this.isDebuffed) speedMult = 0.5;

        this.setVelocity(vx * this.moveSpeed * speedMult, vy * this.moveSpeed * speedMult);

        // Flip sprite based on movement
        if (vx < -0.1) { this.setFlipX(true); this.facing = -1; }
        else if (vx > 0.1) { this.setFlipX(false); this.facing = 1; }

        // Auto-attack
        this.attackTimer += delta;
        if (this.attackTimer >= this.attackSpeed) {
            this.attackTimer = 0;
            this.autoAttack();
        }
        
        // Debuff timer
        if (this.isDebuffed) {
            this.debuffTimer -= delta;
            if (this.debuffTimer <= 0) {
                this.isDebuffed = false;
                this.clearTint();
            }
        }
    }

    autoAttack() {
        if (!this.scene || !this.scene.enemies) return;
        
        const enemies = this.scene.enemies.children.entries.filter(e => e.active);
        if (enemies.length === 0) return;

        // Find nearest enemy
        let nearest = null;
        let nearestDist = Infinity;
        enemies.forEach(enemy => {
            const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = enemy;
            }
        });

        if (!nearest || nearestDist > this.attackRange * 3) return;

        this.weapons.forEach(weapon => {
            switch (weapon.type) {
                case 'taric-dazzle': this.fireTaricDazzle(weapon.level); break;
                case 'sweet-bolts': this.fireSweetBolts(nearest, weapon.level); break;
                case 'starlight': this.fireStarlight(weapon.level); break;
                case 'lidl-bags': this.fireLidlBags(weapon.level); break;
                case 'bastion-shield': this.fireBastionShield(weapon.level); break;
                case 'cooking-fire': this.fireCookingFire(weapon.level); break;
                case 'cheese-wheel': this.fireCheeseWheel(nearest, weapon.level); break;
                case 'ice-cream-cone': this.fireIceCreamCone(weapon.level); break;
            }
        });
    }

    fireTaricDazzle(level) {
        // Taric's gem stun - radial gem projectiles
        const numGems = 3 + level;
        const range = this.attackRange * 0.7 + level * 10;
        const baseAngle = this.scene.time.now / 500;
        
        for (let i = 0; i < numGems; i++) {
            const angle = baseAngle + (i / numGems) * Math.PI * 2;
            const px = this.x + Math.cos(angle) * range * 0.4;
            const py = this.y + Math.sin(angle) * range * 0.4;
            
            // Diamond/gem shaped projectile
            const gem = this.scene.add.polygon(px, py, [0, -8, 6, 0, 0, 8, -6, 0], 0x44ddff, 0.9);
            gem.setAngle(Phaser.Math.RadToDeg(angle));
            this.scene.physics.add.existing(gem);
            gem.body.setAllowGravity(false);
            gem.body.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 200);
            
            this.scene.projectiles.add(gem);
            gem.damage = this.attackDamage + Math.floor(level / 2);
            
            this.scene.tweens.add({
                targets: gem,
                alpha: 0,
                scale: 0.3,
                duration: 380,
                onComplete: () => gem.destroy()
            });
        }
        
        // Gem shimmer on player
        this.setTint(0x44ddff);
        this.scene.time.delayedCall(120, () => { if (this.active) this.clearTint(); });
    }

    fireSweetBolts(target, level) {
        // Homing candy/sweet projectiles
        const bolts = Math.min(level + 1, 4);
        const colors = [0xff66aa, 0xff88cc, 0xffaadd, 0xffccee];
        
        for (let i = 0; i < bolts; i++) {
            this.scene.time.delayedCall(i * 70, () => {
                if (!this.active || !target || !target.active) return;
                
                const bolt = this.scene.add.circle(this.x, this.y, 4 + level, colors[i % colors.length], 0.9);
                this.scene.physics.add.existing(bolt);
                bolt.body.setAllowGravity(false);
                bolt.body.setCircle(4 + level);
                
                const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
                const spread = (i - Math.floor(bolts / 2)) * 0.12;
                const speed = 330 + level * 20;
                bolt.body.setVelocity(
                    Math.cos(angle + spread) * speed,
                    Math.sin(angle + spread) * speed
                );
                
                this.scene.projectiles.add(bolt);
                bolt.damage = this.attackDamage + Math.floor(level / 3);
                
                this.scene.tweens.add({
                    targets: bolt,
                    alpha: 0,
                    duration: 650,
                    onComplete: () => bolt.destroy()
                });
            });
        }
    }

    fireStarlight(level) {
        // Taric's Starlight - radiance aura burst
        const range = 55 + level * 20;
        const aura = this.scene.add.circle(this.x, this.y, range, 0x88ccff, 0.2);
        this.scene.physics.add.existing(aura);
        aura.body.setAllowGravity(false);
        aura.body.setCircle(range);
        
        this.scene.projectiles.add(aura);
        aura.damage = level + 1;
        
        // Healing effect (small self-heal at high level)
        if (level >= 3 && this.health < this.maxHealth) {
            this.health = Math.min(this.maxHealth, this.health + 1);
        }
        
        this.scene.tweens.add({
            targets: aura,
            alpha: 0,
            scale: 1.5,
            duration: 350,
            onComplete: () => aura.destroy()
        });
    }

    fireLidlBags(level) {
        // Lidl shopping bag burst around player
        const count = 3 + level;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
            const dist = 35 + Math.random() * 50;
            const tx = this.x + Math.cos(angle) * dist;
            const ty = this.y + Math.sin(angle) * dist;
            
            // Blue/yellow Lidl colored bags
            const color = i % 2 === 0 ? 0x0050aa : 0xffdd00;
            const bag = this.scene.add.rectangle(tx, ty, 12, 15, color, 0.85);
            this.scene.physics.add.existing(bag);
            bag.body.setAllowGravity(false);
            bag.body.setVelocity(Math.cos(angle) * 120, Math.sin(angle) * 120);
            
            this.scene.projectiles.add(bag);
            bag.damage = this.attackDamage;
            
            this.scene.tweens.add({
                targets: bag,
                alpha: 0,
                scale: 1.4,
                rotation: Math.PI,
                duration: 450,
                onComplete: () => bag.destroy()
            });
        }
    }

    fireBastionShield(level) {
        // Taric's Bastion - protective shield that also damages nearby enemies
        const shieldRange = 45 + level * 12;
        const shield = this.scene.add.circle(this.x, this.y, shieldRange, 0xffd700, 0.15);
        shield.setStrokeStyle(2, 0xffd700, 0.5);
        this.scene.physics.add.existing(shield);
        shield.body.setAllowGravity(false);
        shield.body.setCircle(shieldRange);
        
        this.scene.projectiles.add(shield);
        shield.damage = level;
        
        // Brief invincibility at high levels
        if (level >= 3) {
            this.invincible = true;
            this.scene.time.delayedCall(300, () => { this.invincible = false; });
        }
        
        this.scene.tweens.add({
            targets: shield,
            alpha: 0,
            scale: 1.3,
            duration: 400,
            onComplete: () => shield.destroy()
        });
    }

    fireCookingFire(level) {
        // Cooking flame ring around Marabeige
        const numFlames = 5 + level * 2;
        for (let i = 0; i < numFlames; i++) {
            const angle = (i / numFlames) * Math.PI * 2;
            const dist = 40 + level * 8;
            const fx = this.x + Math.cos(angle) * dist;
            const fy = this.y + Math.sin(angle) * dist;
            
            const flame = this.scene.add.circle(fx, fy, 5 + level, 0xff6600, 0.7);
            this.scene.physics.add.existing(flame);
            flame.body.setAllowGravity(false);
            flame.body.setVelocity(Math.cos(angle) * 80, Math.sin(angle) * 80);
            
            this.scene.projectiles.add(flame);
            flame.damage = this.attackDamage;
            
            this.scene.tweens.add({
                targets: flame,
                alpha: 0,
                scale: 0.3,
                y: fy - 15,
                duration: 500,
                onComplete: () => flame.destroy()
            });
        }
    }

    fireCheeseWheel(target, level) {
        // Zanuff's cheese wheel - bouncing projectile
        if (!target || !target.active) return;
        const cheese = this.scene.add.circle(this.x, this.y, 7 + level, 0xffd700, 0.9);
        this.scene.physics.add.existing(cheese);
        cheese.body.setAllowGravity(false);
        cheese.body.setBounce(1, 1);
        cheese.body.setCollideWorldBounds(true);
        
        const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
        cheese.body.setVelocity(Math.cos(angle) * 350, Math.sin(angle) * 350);
        
        this.scene.projectiles.add(cheese);
        cheese.damage = this.attackDamage + level;
        cheese.isPiercing = true;
        
        // Destroy after time
        this.scene.time.delayedCall(1200 + level * 200, () => {
            if (cheese.active) {
                this.scene.tweens.add({
                    targets: cheese, alpha: 0, duration: 200,
                    onComplete: () => cheese.destroy()
                });
            }
        });
    }

    fireIceCreamCone(level) {
        // Ice cream cone burst - slows enemies on hit
        const count = 2 + level;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + this.scene.time.now / 800;
            const cone = this.scene.add.triangle(
                this.x, this.y,
                0, -8, 5, 6, -5, 6,
                0xffaacc, 0.9
            );
            cone.setAngle(Phaser.Math.RadToDeg(angle));
            this.scene.physics.add.existing(cone);
            cone.body.setAllowGravity(false);
            cone.body.setVelocity(Math.cos(angle) * 180, Math.sin(angle) * 180);
            
            this.scene.projectiles.add(cone);
            cone.damage = this.attackDamage;
            cone.isSlowing = true;
            
            this.scene.tweens.add({
                targets: cone,
                alpha: 0,
                duration: 600,
                onComplete: () => cone.destroy()
            });
        }
    }

    applyDebuff(duration, color) {
        this.isDebuffed = true;
        this.debuffTimer = duration;
        this.setTint(color);
    }

    addXP(amount) {
        this.xp += amount;
        while (this.xp >= this.xpToNext) {
            this.xp -= this.xpToNext;
            this.level++;
            this.xpToNext = Math.floor(this.xpToNext * 1.4);
            this.scene.showLevelUpChoice(this);
        }
    }

    takeDamage(amount) {
        if (this.invincible) return;
        
        this.health -= amount;
        this.invincible = true;
        
        this.scene.cameras.main.shake(100, 0.01);
        
        this.scene.tweens.add({
            targets: this,
            alpha: 0.3,
            duration: 80,
            yoyo: true,
            repeat: 6,
            onComplete: () => {
                if (this.active) {
                    this.alpha = 1;
                    this.invincible = false;
                }
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
