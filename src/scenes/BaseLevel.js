import { Player } from '../sprites/Player.js';
import { Enemy } from '../sprites/Enemy.js';
import { GAME_DATA } from '../constants.js';

export class BaseLevel extends Phaser.Scene {
    constructor(key, levelIndex) {
        super({ key });
        this.levelIndex = levelIndex;
        this.levelData = GAME_DATA.levels[levelIndex];
    }

    init(data) {
        this.selectedCharacter = data.character || 'zanuff';
    }

    create() {
        const { width, height } = this.cameras.main;
        this.cameras.main.fadeIn(500);
        
        this.score = 0;
        this.isPaused = false;
        this.levelComplete_flag = false;
        
        // Arena bounds (full screen, no scrolling)
        this.physics.world.setBounds(0, 0, width, height);
        
        // Background
        this.createBackground();
        
        // Groups
        this.enemies = this.physics.add.group();
        this.projectiles = this.physics.add.group();
        this.xpGems = this.physics.add.group();
        this.sprays = this.physics.add.group();
        this.hazards = this.physics.add.group();
        
        // Player (single character selection)
        this.player = new Player(this, width / 2, height / 2, this.selectedCharacter);
        
        // Collisions: projectiles vs enemies
        this.physics.add.overlap(this.projectiles, this.enemies, this.projectileHitEnemy, null, this);
        
        // Player vs enemies
        this.physics.add.overlap(this.player, this.enemies, this.playerHitEnemy, null, this);
        
        // Player vs XP gems
        this.physics.add.overlap(this.player, this.xpGems, this.collectXP, null, this);
        
        // Character-specific hazards
        if (this.selectedCharacter === 'marabeige') {
            // Flowers hurt Marabeige
            this.physics.add.overlap(this.player, this.hazards, this.flowerAllergy, null, this);
            // Sprays destroy flowers
            this.physics.add.overlap(this.sprays, this.hazards, this.sprayHitsFlower, null, this);
        } else {
            // Zanuff: melons disgust him and slow him down
            this.physics.add.overlap(this.player, this.hazards, this.melonDisgust, null, this);
        }
        
        // Survival timer
        this.survivalTime = this.getSurvivalDuration(); // seconds
        this.elapsedTime = 0;
        
        // Wave spawning
        this.waveTimer = 0;
        this.waveInterval = 2500; // ms between spawn waves
        this.waveCount = 0;
        this.enemiesPerWave = 3;
        
        // Hazard spawning
        this.hazardTimer = 0;
        this.hazardInterval = 8000;
        
        // HUD
        this.createHUD();
        
        // Touch controls (virtual joystick)
        this.createTouchControls();
        
        // Dialog system
        this.dialogQueue = this.getLevelDialogs ? this.getLevelDialogs() : [];
        this.dialogCooldown = 0;
        this.nextDialogTime = 5000;
        
        // Easter eggs
        this.createEasterEggs();
        
        // Level-up UI state
        this.levelUpActive = false;
    }

    update(time, delta) {
        if (this.isPaused || this.levelUpActive || this.levelComplete_flag) return;
        
        this.player.update(time, delta);
        
        // Update enemies
        this.enemies.children.entries.forEach(enemy => {
            if (enemy.active && enemy.update) enemy.update(time, delta);
        });
        
        // Survival timer
        this.elapsedTime += delta;
        const remaining = Math.max(0, this.survivalTime - this.elapsedTime / 1000);
        
        if (remaining <= 0 && !this.levelComplete_flag) {
            this.levelComplete();
            return;
        }
        
        // Wave spawning (ramps up over time)
        this.waveTimer += delta;
        if (this.waveTimer >= this.waveInterval) {
            this.waveTimer = 0;
            this.spawnWave();
            this.waveCount++;
            
            // Increase difficulty over time
            if (this.waveCount % 5 === 0) {
                this.enemiesPerWave = Math.min(this.enemiesPerWave + 1, 12);
                this.waveInterval = Math.max(this.waveInterval - 100, 1200);
            }
        }
        
        // Hazard spawning
        this.hazardTimer += delta;
        if (this.hazardTimer >= this.hazardInterval) {
            this.hazardTimer = 0;
            this.spawnHazard();
        }
        
        // Dialog triggers (time-based)
        this.dialogCooldown -= delta;
        if (this.dialogQueue.length > 0 && this.dialogCooldown <= 0) {
            if (this.elapsedTime >= this.nextDialogTime) {
                const dialog = this.dialogQueue.shift();
                this.showDialogBubble(dialog);
                this.dialogCooldown = 5000;
                this.nextDialogTime += 12000;
            }
        }
        
        // HUD update
        this.updateHUD();
    }

    getSurvivalDuration() {
        // Each level gets slightly longer
        return 60 + this.levelIndex * 15;
    }

    // --- SPAWNING ---
    
    spawnWave() {
        const { width, height } = this.cameras.main;
        const enemyTypes = this.getEnemyTypes();
        
        for (let i = 0; i < this.enemiesPerWave; i++) {
            // Spawn from random edge
            let x, y;
            const edge = Phaser.Math.Between(0, 3);
            switch (edge) {
                case 0: x = Phaser.Math.Between(0, width); y = -30; break;
                case 1: x = Phaser.Math.Between(0, width); y = height + 30; break;
                case 2: x = -30; y = Phaser.Math.Between(0, height); break;
                case 3: x = width + 30; y = Phaser.Math.Between(0, height); break;
            }
            
            const type = Phaser.Utils.Array.GetRandom(enemyTypes);
            const config = this.getEnemyConfig(type);
            
            // Scale difficulty with time
            const timeMult = 1 + (this.elapsedTime / 1000 / this.survivalTime) * 0.8;
            config.health = Math.ceil(config.health * timeMult);
            config.speed = Math.min(config.speed * (1 + timeMult * 0.2), 160);
            
            const enemy = new Enemy(this, x, y, type, config);
            this.enemies.add(enemy);
        }
    }

    getEnemyTypes() {
        // Character-specific enemy pools
        if (this.player && this.player.characterId === 'zanuff') {
            return ['melon', 'melon', 'melon', 'doubt', 'generic'];
        } else if (this.player && this.player.characterId === 'marabeige') {
            return ['flower', 'flower', 'flower', 'butterfly', 'generic'];
        }
        return ['generic'];
    }

    getEnemyConfig(type) {
        const configs = {
            'generic': { health: 2, speed: 55, damage: 1, xpValue: 1 },
            'melon': { health: 2, speed: 60, damage: 1, xpValue: 1 },
            'flower': { health: 2, speed: 60, damage: 1, xpValue: 1 },
            'doubt': { health: 3, speed: 45, damage: 1, xpValue: 2, scale: 1.2 },
            'email': { health: 1, speed: 80, damage: 1, xpValue: 1 },
            'teams': { health: 2, speed: 50, damage: 1, xpValue: 2 },
            'paper': { health: 4, speed: 35, damage: 1, xpValue: 3, scale: 1.3 },
            'box': { health: 3, speed: 65, damage: 1, xpValue: 2 },
            'butterfly': { health: 1, speed: 90, damage: 1, xpValue: 1 },
            'tourist': { health: 2, speed: 55, damage: 1, xpValue: 1 }
        };
        return { ...(configs[type] || configs['generic']) };
    }

    spawnHazard() {
        const { width, height } = this.cameras.main;
        const x = Phaser.Math.Between(60, width - 60);
        const y = Phaser.Math.Between(60, height - 60);
        
        // Don't spawn too close to player
        const dist = Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y);
        if (dist < 80) return;
        
        if (this.selectedCharacter === 'marabeige') {
            // Alternate between flowers and height zones
            if (Math.random() < 0.5) {
                this.spawnFlower(x, y);
            } else {
                this.spawnHeightZone(x, y);
            }
        } else {
            this.spawnMelonZone(x, y);
        }
    }

    spawnHeightZone(x, y) {
        // Vertigo zone - Marabeige is afraid of heights!
        const gfx = this.add.graphics();
        
        // Dark pit/cliff edge visual
        gfx.fillStyle(0x111111, 0.7);
        gfx.fillCircle(x, y, 28);
        // Depth rings (darker center = deeper)
        gfx.fillStyle(0x000000, 0.5);
        gfx.fillCircle(x, y, 18);
        gfx.fillStyle(0x000000, 0.7);
        gfx.fillCircle(x, y, 10);
        // Cracked edges
        gfx.lineStyle(1, 0x444444, 0.6);
        gfx.strokeCircle(x, y, 28);
        gfx.strokeCircle(x, y, 32);
        // Warning stripes around edge
        gfx.lineStyle(2, 0xffaa00, 0.4);
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            gfx.beginPath();
            gfx.moveTo(x + Math.cos(a) * 30, y + Math.sin(a) * 30);
            gfx.lineTo(x + Math.cos(a) * 36, y + Math.sin(a) * 36);
            gfx.strokePath();
        }
        
        // "Don't look down" wind particles rising from pit
        const windEvent = this.time.addEvent({
            delay: 800,
            loop: true,
            callback: () => {
                if (!zone.active) { windEvent.remove(); return; }
                const p = this.add.text(
                    x + Phaser.Math.Between(-12, 12), y + 5, '\u2191',
                    { fontSize: '8px', color: '#666688' }
                ).setAlpha(0.5);
                this.tweens.add({
                    targets: p, y: p.y - 25, alpha: 0, duration: 700,
                    onComplete: () => p.destroy()
                });
            }
        });
        
        const zone = this.add.zone(x, y, 56, 56);
        this.physics.add.existing(zone, true);
        this.hazards.add(zone);
        zone.gfx = gfx;
        zone.isHeight = true;
        
        // Auto-destroy
        this.time.delayedCall(14000, () => {
            if (zone.active) { gfx.destroy(); zone.destroy(); }
        });
    }

    spawnFlower(x, y) {
        // Dangerous flower for Marabeige
        const gfx = this.add.graphics();
        gfx.fillStyle(0x228b22);
        gfx.fillRect(x - 2, y, 4, 12);
        gfx.fillStyle(0xff69b4);
        gfx.fillCircle(x, y - 4, 7);
        gfx.fillStyle(0xffff00);
        gfx.fillCircle(x, y - 4, 3);
        gfx.fillStyle(0xff69b4, 0.2);
        gfx.fillCircle(x, y, 16);
        
        const zone = this.add.zone(x, y, 32, 32);
        this.physics.add.existing(zone, true);
        this.hazards.add(zone);
        zone.gfx = gfx;
        
        // Pollen particles
        const pollenEvent = this.time.addEvent({
            delay: 1200,
            loop: true,
            callback: () => {
                if (!zone.active) { pollenEvent.remove(); return; }
                const p = this.add.circle(
                    x + Phaser.Math.Between(-8, 8), y - 6, 2, 0xffff88, 0.6
                );
                this.tweens.add({
                    targets: p, y: p.y - 20, alpha: 0, duration: 800,
                    onComplete: () => p.destroy()
                });
            }
        });
        
        // Auto-destroy after some time
        this.time.delayedCall(12000, () => {
            if (zone.active) { gfx.destroy(); zone.destroy(); }
        });
    }

    spawnMelonZone(x, y) {
        // Melon hazard that slows/disgusts Zanuff (he HATES melons!)
        const gfx = this.add.graphics();
        // Melon body (green outside)
        gfx.fillStyle(0x228b22, 0.6);
        gfx.fillCircle(x, y, 14);
        // Melon stripes
        gfx.lineStyle(1, 0x1a6b1a, 0.5);
        gfx.strokeCircle(x, y, 14);
        gfx.beginPath();
        gfx.moveTo(x - 2, y - 14);
        gfx.lineTo(x - 4, y + 14);
        gfx.strokePath();
        gfx.beginPath();
        gfx.moveTo(x + 4, y - 14);
        gfx.lineTo(x + 2, y + 14);
        gfx.strokePath();
        // Inside (pink/red - it's cut open)
        gfx.fillStyle(0xff6b6b, 0.5);
        gfx.fillCircle(x, y, 8);
        // Seeds
        gfx.fillStyle(0x333333, 0.6);
        gfx.fillCircle(x - 3, y - 2, 1.5);
        gfx.fillCircle(x + 2, y + 2, 1.5);
        gfx.fillCircle(x + 1, y - 3, 1.5);
        
        // Stink waves
        gfx.fillStyle(0x88ff88, 0.2);
        gfx.fillCircle(x, y, 22);
        
        const zone = this.add.zone(x, y, 44, 44);
        this.physics.add.existing(zone, true);
        this.hazards.add(zone);
        zone.gfx = gfx;
        
        // Smell particles
        const smellEvent = this.time.addEvent({
            delay: 1500,
            loop: true,
            callback: () => {
                if (!zone.active) { smellEvent.remove(); return; }
                const p = this.add.text(
                    x + Phaser.Math.Between(-10, 10), y - 10, '~',
                    { fontSize: '10px', color: '#88ff88' }
                ).setAlpha(0.5);
                this.tweens.add({
                    targets: p, y: p.y - 20, alpha: 0, duration: 900,
                    onComplete: () => p.destroy()
                });
            }
        });
        
        // Auto-destroy
        this.time.delayedCall(10000, () => {
            if (zone.active) { gfx.destroy(); zone.destroy(); }
        });
    }

    // --- COLLISIONS ---
    
    projectileHitEnemy(projectile, enemy) {
        if (!projectile.active || !enemy.active) return;
        
        const dmg = projectile.damage || 1;
        enemy.takeDamage(dmg);
        
        if (!projectile.isPiercing) {
            projectile.destroy();
        }
    }

    playerHitEnemy(player, enemy) {
        if (player.invincible || !enemy.active) return;
        player.takeDamage(enemy.damage || 1);
    }

    collectXP(player, gem) {
        player.addXP(gem.getData('value') || 1);
        
        // Pickup effect
        const text = this.add.text(gem.x, gem.y - 10, `+${gem.getData('value')} XP`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '7px',
            color: '#44ff88'
        }).setOrigin(0.5).setDepth(50);
        this.tweens.add({
            targets: text, y: text.y - 20, alpha: 0, duration: 500,
            onComplete: () => text.destroy()
        });
        
        gem.destroy();
    }

    flowerAllergy(player, flower) {
        if (player.invincible) return;
        
        // Height zone triggers vertigo instead
        if (flower.isHeight) {
            this.heightVertigo(player, flower);
            return;
        }
        
        player.takeDamage(1);
        player.applyDebuff(1500, 0xffff00);
        
        // Sneeze!
        const sneeze = this.add.text(player.x, player.y - 30, 'ACHOO!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#ffff00'
        }).setOrigin(0.5).setDepth(50);
        this.tweens.add({
            targets: sneeze, y: sneeze.y - 30, alpha: 0, duration: 700,
            onComplete: () => sneeze.destroy()
        });
        
        // Destroy the flower after hit
        if (flower.gfx) flower.gfx.destroy();
        flower.destroy();
    }

    heightVertigo(player, zone) {
        if (player.isDebuffed) return;
        
        player.takeDamage(1);
        player.applyDebuff(2000, 0x6666aa);
        
        // Vertigo effect - screen wobble + scared text
        this.cameras.main.shake(400, 0.015);
        
        const msgs = [
            "DON'T LOOK DOWN!",
            "TOO HIGH!!",
            "I'm scared!!",
            "VERTIGO!"
        ];
        const msg = Phaser.Utils.Array.GetRandom(msgs);
        
        const text = this.add.text(player.x, player.y - 30, msg, {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#aaaaff'
        }).setOrigin(0.5).setDepth(50);
        this.tweens.add({
            targets: text, y: text.y - 30, alpha: 0, duration: 900,
            onComplete: () => text.destroy()
        });
        
        // Push player away from the edge
        const angle = Phaser.Math.Angle.Between(zone.x, zone.y, player.x, player.y);
        player.setVelocity(Math.cos(angle) * 250, Math.sin(angle) * 250);
    }

    melonDisgust(player, zone) {
        if (player.isDebuffed) return;
        
        player.takeDamage(1);
        player.applyDebuff(1500, 0x88ff88);
        
        const text = this.add.text(player.x, player.y - 30, 'DISGUSTING! Melon!!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '7px',
            color: '#88ff88'
        }).setOrigin(0.5).setDepth(50);
        this.tweens.add({
            targets: text, y: text.y - 25, alpha: 0, duration: 1000,
            onComplete: () => text.destroy()
        });
        
        // Destroy the melon after hit
        if (zone.gfx) zone.gfx.destroy();
        zone.destroy();
    }

    sprayHitsFlower(spray, flower) {
        // Zanuff's spray ring destroys flowers
        for (let i = 0; i < 4; i++) {
            const p = this.add.circle(
                flower.x + Phaser.Math.Between(-6, 6),
                flower.y + Phaser.Math.Between(-6, 6),
                3, 0x44ff44
            );
            this.tweens.add({
                targets: p, y: p.y - 20, alpha: 0, duration: 400,
                onComplete: () => p.destroy()
            });
        }
        if (flower.gfx) flower.gfx.destroy();
        flower.destroy();
        spray.destroy();
        this.addScore(10);
    }

    spawnXPGem(x, y, value) {
        const colors = [0x44ff88, 0x88ffaa, 0x00ff66];
        const size = 3 + value;
        const gem = this.add.circle(x, y, size, Phaser.Utils.Array.GetRandom(colors), 0.9);
        this.physics.add.existing(gem);
        gem.body.setAllowGravity(false);
        gem.body.setCircle(size);
        gem.setData('value', value);
        gem.setDepth(4);
        this.xpGems.add(gem);
        
        // Magnet effect: move toward player if close
        this.tweens.add({
            targets: gem,
            scale: 1.2,
            duration: 300,
            yoyo: true,
            repeat: -1
        });
    }

    // --- LEVEL UP ---
    
    showLevelUpChoice(player) {
        this.levelUpActive = true;
        this.physics.pause();
        
        const { width, height } = this.cameras.main;
        
        // Darken screen
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)
            .setDepth(100).setScrollFactor(0);
        
        const titleText = this.add.text(width / 2, 80, `LEVEL ${player.level}!`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '18px',
            color: '#ffd700'
        }).setOrigin(0.5).setDepth(101);
        
        // Generate 3 random upgrades
        const allUpgrades = this.getAvailableUpgrades(player);
        const choices = Phaser.Utils.Array.Shuffle(allUpgrades).slice(0, 3);
        
        const buttons = [];
        choices.forEach((choice, i) => {
            const bx = width / 2;
            const by = 140 + i * 120;
            
            const btn = this.add.rectangle(bx, by, 380, 90, 0x222244, 0.95)
                .setStrokeStyle(2, 0xffd700)
                .setDepth(101)
                .setInteractive({ useHandCursor: true });
            
            const nameText = this.add.text(bx, by - 18, choice.name, {
                fontFamily: '"Press Start 2P"',
                fontSize: '10px',
                color: choice.color || '#ffffff'
            }).setOrigin(0.5).setDepth(102);
            
            const descText = this.add.text(bx, by + 10, choice.desc, {
                fontFamily: '"Press Start 2P"',
                fontSize: '7px',
                color: '#aaaacc',
                align: 'center',
                wordWrap: { width: 300 }
            }).setOrigin(0.5).setDepth(102);
            
            btn.on('pointerover', () => btn.setFillStyle(0x333366));
            btn.on('pointerout', () => btn.setFillStyle(0x222244));
            btn.on('pointerdown', () => {
                choice.apply(player);
                // Cleanup
                overlay.destroy();
                titleText.destroy();
                buttons.forEach(b => { b.btn.destroy(); b.name.destroy(); b.desc.destroy(); });
                this.levelUpActive = false;
                this.physics.resume();
                this.input.keyboard.off('keydown', keyHandler);
            });
            
            buttons.push({ btn, name: nameText, desc: descText });
        });
        
        // Also allow keyboard selection (1, 2, 3)
        const keyHandler = (event) => {
            const idx = parseInt(event.key) - 1;
            if (idx >= 0 && idx < choices.length) {
                choices[idx].apply(player);
                overlay.destroy();
                titleText.destroy();
                buttons.forEach(b => { b.btn.destroy(); b.name.destroy(); b.desc.destroy(); });
                this.levelUpActive = false;
                this.physics.resume();
                this.input.keyboard.off('keydown', keyHandler);
            }
        };
        this.input.keyboard.on('keydown', keyHandler);
    }

    getAvailableUpgrades(player) {
        const upgrades = [
            {
                name: '+1 Max HP',
                desc: 'Increase maximum health by 1',
                color: '#ff4444',
                apply: (p) => { p.maxHealth++; p.health = p.maxHealth; }
            },
            {
                name: 'Speed Boost',
                desc: 'Move 15% faster',
                color: '#44ff44',
                apply: (p) => { p.moveSpeed *= 1.15; }
            },
            {
                name: 'Attack Power',
                desc: '+1 damage to all weapons',
                color: '#ff8844',
                apply: (p) => { p.attackDamage++; }
            },
            {
                name: 'Attack Speed',
                desc: 'Attack 20% faster',
                color: '#ffff44',
                apply: (p) => { p.attackSpeed = Math.max(200, p.attackSpeed * 0.8); }
            },
            {
                name: 'Longer Reach',
                desc: 'Increase attack range',
                color: '#44ffff',
                apply: (p) => { p.attackRange += 30; }
            },
            {
                name: 'Heal',
                desc: 'Restore all HP',
                color: '#ff66aa',
                apply: (p) => { p.health = p.maxHealth; }
            }
        ];
        
        // Character-specific weapon upgrades
        if (player.characterId === 'zanuff') {
            upgrades.push({
                name: 'Taric Dazzle+',
                desc: 'More gems, more stun!',
                color: '#44ddff',
                apply: (p) => {
                    const w = p.weapons.find(w => w.type === 'taric-dazzle');
                    if (w) w.level++;
                    else p.weapons.push({ type: 'taric-dazzle', level: 1 });
                }
            });
            upgrades.push({
                name: 'Starlight',
                desc: 'Taric radiance - heals at Lv3',
                color: '#88ccff',
                apply: (p) => {
                    const w = p.weapons.find(w => w.type === 'starlight');
                    if (w) w.level++;
                    else p.weapons.push({ type: 'starlight', level: 1 });
                }
            });
            upgrades.push({
                name: 'Bastion Shield',
                desc: 'Protective burst + brief invincibility',
                color: '#ffd700',
                apply: (p) => {
                    const w = p.weapons.find(w => w.type === 'bastion-shield');
                    if (w) w.level++;
                    else p.weapons.push({ type: 'bastion-shield', level: 1 });
                }
            });
            upgrades.push({
                name: 'Cheese Wheel',
                desc: 'Bouncing cheese! Pierces enemies',
                color: '#ffdd44',
                apply: (p) => {
                    const w = p.weapons.find(w => w.type === 'cheese-wheel');
                    if (w) w.level++;
                    else p.weapons.push({ type: 'cheese-wheel', level: 1 });
                }
            });
            upgrades.push({
                name: 'Ice Cream Cone',
                desc: 'Frozen projectiles - slows enemies',
                color: '#ffaacc',
                apply: (p) => {
                    const w = p.weapons.find(w => w.type === 'ice-cream-cone');
                    if (w) w.level++;
                    else p.weapons.push({ type: 'ice-cream-cone', level: 1 });
                }
            });
        } else {
            upgrades.push({
                name: 'Sweet Bolts+',
                desc: 'More homing candy projectiles',
                color: '#ff6688',
                apply: (p) => {
                    const w = p.weapons.find(w => w.type === 'sweet-bolts');
                    if (w) w.level++;
                    else p.weapons.push({ type: 'sweet-bolts', level: 1 });
                }
            });
            upgrades.push({
                name: 'Lidl Bags',
                desc: 'Burst of discount shopping damage',
                color: '#0050aa',
                apply: (p) => {
                    const w = p.weapons.find(w => w.type === 'lidl-bags');
                    if (w) w.level++;
                    else p.weapons.push({ type: 'lidl-bags', level: 1 });
                }
            });
            upgrades.push({
                name: 'Cooking Fire',
                desc: 'Flame ring around you',
                color: '#ff6600',
                apply: (p) => {
                    const w = p.weapons.find(w => w.type === 'cooking-fire');
                    if (w) w.level++;
                    else p.weapons.push({ type: 'cooking-fire', level: 1 });
                }
            });
        }
        
        return upgrades;
    }

    // --- PLAYER DEATH ---
    
    playerDied(player) {
        if (player.lives <= 0) {
            this.gameOver();
            return;
        }
        
        // Respawn with brief invincibility
        player.health = player.maxHealth;
        player.setVelocity(0, 0);
        
        const { width, height } = this.cameras.main;
        player.setPosition(width / 2, height / 2);
        player.invincible = true;
        player.setAlpha(0.4);
        
        this.cameras.main.flash(300, 255, 0, 0);
        
        const livesText = this.add.text(width / 2, 100,
            `${player.playerName}: ${player.lives} lives left`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#ffffff'
        }).setOrigin(0.5).setDepth(80);
        this.tweens.add({
            targets: livesText, alpha: 0, y: 70, duration: 1500,
            onComplete: () => livesText.destroy()
        });
        
        this.time.delayedCall(2000, () => {
            if (player.active) {
                player.setAlpha(1);
                player.invincible = false;
            }
        });
    }

    gameOver() {
        this.isPaused = true;
        this.physics.pause();
        
        const { width, height } = this.cameras.main;
        
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8).setDepth(100);
        
        // Character-specific death message
        const deathMsg = this.selectedCharacter === 'zanuff'
            ? 'Cel mai Z\u0103vlog'
            : 'Cea mai Z\u0103vloaga';
        
        this.add.text(width / 2, height / 2 - 40, deathMsg, {
            fontFamily: '"Press Start 2P"',
            fontSize: '22px',
            color: '#ff4444'
        }).setOrigin(0.5).setDepth(101);
        
        this.add.text(width / 2, height / 2 + 20, `Score: ${this.score}  |  Kills: ${this.player.killCount}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '9px',
            color: '#cccccc'
        }).setOrigin(0.5).setDepth(101);
        
        const retryText = this.add.text(width / 2, height / 2 + 70, 'Tap or press ENTER to retry', {
            fontFamily: '"Press Start 2P"',
            fontSize: '9px',
            color: '#aaaaaa'
        }).setOrigin(0.5).setDepth(101);
        this.tweens.add({ targets: retryText, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });
        
        const restart = () => {
            this.scene.start(this.scene.key, { character: this.selectedCharacter });
        };
        this.input.keyboard.once('keydown-ENTER', restart);
        this.input.once('pointerdown', restart);
    }

    levelComplete() {
        if (this.levelComplete_flag) return;
        this.levelComplete_flag = true;
        this.physics.pause();
        
        const { width, height } = this.cameras.main;
        
        const victoryText = this.add.text(width / 2, height / 2 - 20, 'SURVIVED!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            color: '#ffd700'
        }).setOrigin(0.5).setDepth(100);
        
        this.add.text(width / 2, height / 2 + 20, `Score: ${this.score}  |  Kills: ${this.player.killCount}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '9px',
            color: '#cccccc'
        }).setOrigin(0.5).setDepth(100);
        
        this.tweens.add({
            targets: victoryText,
            scale: 1.2,
            duration: 300,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                this.cameras.main.fadeOut(1000, 0, 0, 0);
                this.time.delayedCall(1000, () => {
                    this.scene.start('StoryScene', {
                        levelIndex: this.levelIndex,
                        isAfter: true,
                        character: this.selectedCharacter
                    });
                });
            }
        });
    }

    addScore(points) {
        this.score += points;
    }

    // --- TOUCH CONTROLS ---
    
    createTouchControls() {
        // Only show on touch devices or always show for mobile-friendly
        const { width, height } = this.cameras.main;
        
        this.joystickBase = this.add.circle(120, height - 100, 55, 0xffffff, 0.2)
            .setDepth(200).setScrollFactor(0);
        this.joystickThumb = this.add.circle(120, height - 100, 26, 0xffffff, 0.5)
            .setDepth(201).setScrollFactor(0);
        
        this.joystickActive = false;
        this.joystickPointer = null;
        
        this.input.on('pointerdown', (pointer) => {
            // Don't activate joystick during overlays
            if (this.isPaused || this.levelUpActive || this.levelComplete_flag) return;
            // Left half of screen = joystick
            if (pointer.x < width / 2) {
                this.joystickActive = true;
                this.joystickPointer = pointer;
                this.joystickBase.setPosition(pointer.x, pointer.y);
                this.joystickThumb.setPosition(pointer.x, pointer.y);
            }
        });
        
        this.input.on('pointermove', (pointer) => {
            if (this.joystickActive && pointer === this.joystickPointer) {
                const dx = pointer.x - this.joystickBase.x;
                const dy = pointer.y - this.joystickBase.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 45;
                
                if (dist > maxDist) {
                    this.joystickThumb.setPosition(
                        this.joystickBase.x + (dx / dist) * maxDist,
                        this.joystickBase.y + (dy / dist) * maxDist
                    );
                } else {
                    this.joystickThumb.setPosition(pointer.x, pointer.y);
                }
                
                // Normalize to -1..1
                const nx = Math.max(-1, Math.min(1, dx / maxDist));
                const ny = Math.max(-1, Math.min(1, dy / maxDist));
                this.player.touchVelocity = { x: nx, y: ny };
            }
        });
        
        this.input.on('pointerup', (pointer) => {
            if (pointer === this.joystickPointer) {
                this.joystickActive = false;
                this.joystickPointer = null;
                this.joystickThumb.setPosition(this.joystickBase.x, this.joystickBase.y);
                this.player.touchVelocity = { x: 0, y: 0 };
            }
        });
    }

    // --- HUD ---
    
    createHUD() {
        const { width } = this.cameras.main;
        
        // Health bar
        this.healthBarBg = this.add.rectangle(width / 2, 18, 200, 14, 0x333333, 0.8)
            .setDepth(150).setScrollFactor(0);
        this.healthBarFill = this.add.rectangle(width / 2, 18, 200, 14, 0xff4444, 0.9)
            .setDepth(151).setScrollFactor(0);
        
        // XP bar
        this.xpBarBg = this.add.rectangle(width / 2, 34, 160, 8, 0x222222, 0.8)
            .setDepth(150).setScrollFactor(0);
        this.xpBarFill = this.add.rectangle(width / 2, 34, 0, 8, 0x44ff88, 0.9)
            .setDepth(151).setScrollFactor(0);
        
        // Level text
        this.levelText = this.add.text(width / 2 - 105, 12, 'Lv1', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#ffd700'
        }).setDepth(152).setScrollFactor(0);
        
        // Timer
        this.timerText = this.add.text(width - 80, 12, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '10px',
            color: '#ffffff'
        }).setDepth(152).setScrollFactor(0);
        
        // Score
        this.scoreText = this.add.text(16, 12, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            color: '#ffd700'
        }).setDepth(152).setScrollFactor(0);
        
        // Lives
        this.livesText = this.add.text(16, 28, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '7px',
            color: '#ff6688'
        }).setDepth(152).setScrollFactor(0);
        
        // Kill count
        this.killText = this.add.text(width - 80, 28, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '7px',
            color: '#aaaacc'
        }).setDepth(152).setScrollFactor(0);
    }

    updateHUD() {
        const player = this.player;
        const { width } = this.cameras.main;
        
        // Health bar
        const hpRatio = Math.max(0, player.health / player.maxHealth);
        this.healthBarFill.setSize(200 * hpRatio, 14);
        this.healthBarFill.setPosition(width / 2 - 100 + (200 * hpRatio) / 2, 18);
        
        // XP bar
        const xpRatio = player.xp / player.xpToNext;
        this.xpBarFill.setSize(160 * xpRatio, 8);
        this.xpBarFill.setPosition(width / 2 - 80 + (160 * xpRatio) / 2, 34);
        
        // Level
        this.levelText.setText(`Lv${player.level}`);
        
        // Timer
        const remaining = Math.max(0, this.survivalTime - this.elapsedTime / 1000);
        const mins = Math.floor(remaining / 60);
        const secs = Math.floor(remaining % 60);
        this.timerText.setText(`${mins}:${secs.toString().padStart(2, '0')}`);
        
        // Score
        this.scoreText.setText(`${this.score}`);
        
        // Lives
        this.livesText.setText('\u2665'.repeat(player.lives));
        
        // Kills
        this.killText.setText(`K:${player.killCount}`);
    }

    // --- DIALOG ---
    
    showDialogBubble(dialog) {
        const { width } = this.cameras.main;
        const name = dialog.speaker === 'zanuff' ? 'Zanuff' : 'Marabeige';
        const color = dialog.speaker === 'zanuff' ? '#6688ff' : '#ff6688';
        
        const bubble = this.add.rectangle(width / 2, 70, 10, 10, 0x111122, 0.9)
            .setStrokeStyle(1, dialog.speaker === 'zanuff' ? 0x6688ff : 0xff6688)
            .setDepth(90);
        
        const nameText = this.add.text(width / 2, 60, name, {
            fontFamily: '"Press Start 2P"', fontSize: '7px', color
        }).setOrigin(0.5).setDepth(91);
        
        const lineText = this.add.text(width / 2, 76, dialog.text, {
            fontFamily: '"Press Start 2P"', fontSize: '7px', color: '#ffffff',
            align: 'center', wordWrap: { width: 350 }
        }).setOrigin(0.5).setDepth(91);
        
        const padding = 14;
        const w = Math.max(lineText.width, nameText.width) + padding * 2;
        const h = lineText.height + nameText.height + padding + 6;
        bubble.setSize(w, h);
        bubble.setPosition(width / 2, 68);
        
        // Fade out
        this.time.delayedCall(3500, () => {
            this.tweens.add({
                targets: [bubble, nameText, lineText],
                alpha: 0, duration: 500,
                onComplete: () => { bubble.destroy(); nameText.destroy(); lineText.destroy(); }
            });
        });
    }

    // --- OVERRIDEABLE ---
    
    createBackground() {
        const { width, height } = this.cameras.main;
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x2a2a4e, 0x2a2a4e);
        bg.fillRect(0, 0, width, height);
    }

    createEasterEggs() {
        // Override in subclasses
    }

    getLevelDialogs() {
        return [];
    }
}
