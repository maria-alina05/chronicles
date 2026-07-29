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
            this.attackDamage = 3;
            this.attackSpeed = 750;
            this.attackRange = 140;
        } else {
            // Marabeige: faster, nimble, rapid attacks
            this.health = 5;
            this.maxHealth = 5;
            this.moveSpeed = 200;
            this.attackDamage = 2;
            this.attackSpeed = 450;
            this.attackRange = 170;
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
        // Taric's gem stun - radial gem projectiles (AOE burst)
        const numGems = 5 + level * 2;
        const range = this.attackRange + level * 15;
        const baseAngle = this.scene.time.now / 500;
        
        for (let i = 0; i < numGems; i++) {
            const angle = baseAngle + (i / numGems) * Math.PI * 2;
            const px = this.x + Math.cos(angle) * range * 0.3;
            const py = this.y + Math.sin(angle) * range * 0.3;
            
            // Diamond/gem shaped projectile
            const gem = this.scene.add.polygon(px, py, [0, -10, 7, 0, 0, 10, -7, 0], 0x44ddff, 0.9);
            gem.setAngle(Phaser.Math.RadToDeg(angle));
            this.scene.physics.add.existing(gem);
            gem.body.setAllowGravity(false);
            gem.body.setVelocity(Math.cos(angle) * 250, Math.sin(angle) * 250);
            
            this.scene.projectiles.add(gem);
            gem.damage = this.attackDamage + level;
            gem.isPiercing = true;
            
            this.scene.tweens.add({
                targets: gem,
                alpha: 0,
                scale: 0.3,
                duration: 550,
                onComplete: () => gem.destroy()
            });
        }
        
        // Gem shimmer on player
        this.setTint(0x44ddff);
        this.scene.time.delayedCall(120, () => { if (this.active) this.clearTint(); });
    }

    fireSweetBolts(target, level) {
        // Homing candy/sweet projectiles - rapid burst
        const bolts = Math.min(level + 2, 6);
        const colors = [0xff66aa, 0xff88cc, 0xffaadd, 0xffccee];
        
        for (let i = 0; i < bolts; i++) {
            this.scene.time.delayedCall(i * 50, () => {
                if (!this.active || !target || !target.active) return;
                
                const bolt = this.scene.add.circle(this.x, this.y, 5 + level, colors[i % colors.length], 0.9);
                this.scene.physics.add.existing(bolt);
                bolt.body.setAllowGravity(false);
                bolt.body.setCircle(5 + level);
                
                const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
                const spread = (i - Math.floor(bolts / 2)) * 0.15;
                const speed = 380 + level * 25;
                bolt.body.setVelocity(
                    Math.cos(angle + spread) * speed,
                    Math.sin(angle + spread) * speed
                );
                
                this.scene.projectiles.add(bolt);
                bolt.damage = this.attackDamage + Math.floor(level / 2);
                bolt.isPiercing = level >= 3;
                
                this.scene.tweens.add({
                    targets: bolt,
                    alpha: 0,
                    duration: 800,
                    onComplete: () => bolt.destroy()
                });
            });
        }
    }

    fireStarlight(level) {
        // Taric's Starlight - large radiance aura burst
        const range = 75 + level * 25;
        const aura = this.scene.add.circle(this.x, this.y, range, 0x88ccff, 0.3);
        this.scene.physics.add.existing(aura);
        aura.body.setAllowGravity(false);
        aura.body.setCircle(range);
        
        this.scene.projectiles.add(aura);
        aura.damage = level + 2;
        aura.isPiercing = true;
        
        // Healing effect
        if (level >= 2 && this.health < this.maxHealth) {
            this.health = Math.min(this.maxHealth, this.health + 1);
        }
        
        this.scene.tweens.add({
            targets: aura,
            alpha: 0,
            scale: 1.8,
            duration: 450,
            onComplete: () => aura.destroy()
        });
    }

    fireLidlBags(level) {
        // Lidl shopping bag burst around player - wide AOE
        const count = 5 + level * 2;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
            const dist = 30 + Math.random() * 60;
            const tx = this.x + Math.cos(angle) * dist;
            const ty = this.y + Math.sin(angle) * dist;
            
            const color = i % 2 === 0 ? 0x0050aa : 0xffdd00;
            const bag = this.scene.add.rectangle(tx, ty, 14, 17, color, 0.85);
            this.scene.physics.add.existing(bag);
            bag.body.setAllowGravity(false);
            bag.body.setVelocity(Math.cos(angle) * 160, Math.sin(angle) * 160);
            
            this.scene.projectiles.add(bag);
            bag.damage = this.attackDamage + Math.floor(level / 2);
            bag.isPiercing = true;
            
            this.scene.tweens.add({
                targets: bag,
                alpha: 0,
                scale: 1.6,
                rotation: Math.PI,
                duration: 600,
                onComplete: () => bag.destroy()
            });
        }
    }

    fireBastionShield(level) {
        // Taric's Bastion - large protective shield + damage
        const shieldRange = 60 + level * 18;
        const shield = this.scene.add.circle(this.x, this.y, shieldRange, 0xffd700, 0.2);
        shield.setStrokeStyle(3, 0xffd700, 0.6);
        this.scene.physics.add.existing(shield);
        shield.body.setAllowGravity(false);
        shield.body.setCircle(shieldRange);
        
        this.scene.projectiles.add(shield);
        shield.damage = level + 1;
        shield.isPiercing = true;
        
        // Brief invincibility at level 2+
        if (level >= 2) {
            this.invincible = true;
            this.scene.time.delayedCall(400 + level * 100, () => { this.invincible = false; });
        }
        
        this.scene.tweens.add({
            targets: shield,
            alpha: 0,
            scale: 1.5,
            duration: 500,
            onComplete: () => shield.destroy()
        });
    }

    fireCookingFire(level) {
        // Cooking flame ring around Marabeige - big AOE
        const numFlames = 8 + level * 3;
        for (let i = 0; i < numFlames; i++) {
            const angle = (i / numFlames) * Math.PI * 2;
            const dist = 45 + level * 12;
            const fx = this.x + Math.cos(angle) * dist;
            const fy = this.y + Math.sin(angle) * dist;
            
            const flame = this.scene.add.circle(fx, fy, 7 + level, 0xff6600, 0.8);
            this.scene.physics.add.existing(flame);
            flame.body.setAllowGravity(false);
            flame.body.setVelocity(Math.cos(angle) * 110, Math.sin(angle) * 110);
            
            this.scene.projectiles.add(flame);
            flame.damage = this.attackDamage + Math.floor(level / 2);
            flame.isPiercing = true;
            
            this.scene.tweens.add({
                targets: flame,
                alpha: 0,
                scale: 0.3,
                y: fy - 20,
                duration: 650,
                onComplete: () => flame.destroy()
            });
        }
    }

    fireCheeseWheel(target, level) {
        // Zanuff's cheese wheel - bouncing piercing projectile
        if (!target || !target.active) return;
        const cheese = this.scene.add.circle(this.x, this.y, 9 + level * 2, 0xffd700, 0.9);
        this.scene.physics.add.existing(cheese);
        cheese.body.setAllowGravity(false);
        cheese.body.setBounce(1, 1);
        cheese.body.setCollideWorldBounds(true);
        
        const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
        cheese.body.setVelocity(Math.cos(angle) * 400, Math.sin(angle) * 400);
        
        this.scene.projectiles.add(cheese);
        cheese.damage = this.attackDamage + level + 1;
        cheese.isPiercing = true;
        
        // Longer bouncing time
        this.scene.time.delayedCall(1800 + level * 300, () => {
            if (cheese.active) {
                this.scene.tweens.add({
                    targets: cheese, alpha: 0, duration: 200,
                    onComplete: () => cheese.destroy()
                });
            }
        });
    }

    fireIceCreamCone(level) {
        // Ice cream cone burst - slows and pierces
        const count = 4 + level * 2;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + this.scene.time.now / 800;
            const cone = this.scene.add.triangle(
                this.x, this.y,
                0, -10, 6, 7, -6, 7,
                0xffaacc, 0.9
            );
            cone.setAngle(Phaser.Math.RadToDeg(angle));
            this.scene.physics.add.existing(cone);
            cone.body.setAllowGravity(false);
            cone.body.setVelocity(Math.cos(angle) * 220, Math.sin(angle) * 220);
            
            this.scene.projectiles.add(cone);
            cone.damage = this.attackDamage + Math.floor(level / 2);
            cone.isSlowing = true;
            cone.isPiercing = level >= 2;
            
            this.scene.tweens.add({
                targets: cone,
                alpha: 0,
                duration: 750,
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
