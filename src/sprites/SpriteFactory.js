import { COLORS } from '../constants.js';

export function createPlayerSprites(scene) {
    // Create Zanuff (Andrei) sprite texture - 48x72 for more detail
    const zanuffGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    drawZanuff(zanuffGfx);
    zanuffGfx.generateTexture('zanuff', 48, 72);
    zanuffGfx.destroy();

    // Create Zanuff jump frame
    const zanuffJumpGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    drawZanuffJump(zanuffJumpGfx);
    zanuffJumpGfx.generateTexture('zanuff-jump', 48, 72);
    zanuffJumpGfx.destroy();

    // Create Marabeige (Maria) sprite texture
    const mariaGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    drawMarabeige(mariaGfx);
    mariaGfx.generateTexture('marabeige', 48, 72);
    mariaGfx.destroy();

    // Create Marabeige jump frame
    const mariaJumpGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    drawMarabeigeJump(mariaJumpGfx);
    mariaJumpGfx.generateTexture('marabeige-jump', 48, 72);
    mariaJumpGfx.destroy();

    // Create Twitch logo texture
    const twitchGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    drawTwitchLogo(twitchGfx);
    twitchGfx.generateTexture('twitch-logo', 48, 48);
    twitchGfx.destroy();
}

function drawZanuff(gfx) {
    // === ANDREI / ZANUFF ===
    // Broader build, red Bazinga t-shirt, rectangular glasses, full trimmed beard, dark hair

    // Body - Red Bazinga T-shirt
    gfx.fillStyle(0xcc2222); // red shirt
    gfx.fillRect(11, 30, 26, 24);
    // Shirt sleeves
    gfx.fillRect(5, 32, 8, 12);
    gfx.fillRect(35, 32, 8, 12);
    // "BAZINGA" text on shirt (pixel text - yellow)
    gfx.fillStyle(0xffff00);
    // B
    gfx.fillRect(14, 38, 2, 6);
    gfx.fillRect(16, 38, 1, 1);
    gfx.fillRect(16, 41, 1, 1);
    gfx.fillRect(16, 43, 1, 1);
    // A
    gfx.fillRect(18, 39, 1, 5);
    gfx.fillRect(20, 39, 1, 5);
    gfx.fillRect(18, 38, 3, 1);
    gfx.fillRect(18, 41, 3, 1);
    // Z
    gfx.fillRect(22, 38, 3, 1);
    gfx.fillRect(22, 43, 3, 1);
    gfx.fillRect(24, 39, 1, 1);
    gfx.fillRect(23, 40, 1, 1);
    gfx.fillRect(22, 41, 1, 2);
    // I
    gfx.fillRect(26, 38, 1, 6);
    // N
    gfx.fillRect(28, 38, 1, 6);
    gfx.fillRect(30, 38, 1, 6);
    gfx.fillRect(29, 39, 1, 2);
    // G
    gfx.fillRect(32, 38, 3, 1);
    gfx.fillRect(32, 43, 3, 1);
    gfx.fillRect(32, 38, 1, 6);
    gfx.fillRect(34, 41, 1, 3);
    // A
    gfx.fillRect(36, 39, 1, 5);
    gfx.fillRect(38, 39, 1, 5);
    gfx.fillRect(36, 38, 3, 1);
    gfx.fillRect(36, 41, 3, 1);
    // Exclamation !
    gfx.fillRect(40, 38, 1, 4);
    gfx.fillRect(40, 43, 1, 1);

    // Legs (dark jeans)
    gfx.fillStyle(0x2a2a3a);
    gfx.fillRect(14, 54, 8, 14);
    gfx.fillRect(26, 54, 8, 14);
    // Shoes
    gfx.fillStyle(0x333333);
    gfx.fillRect(13, 68, 10, 4);
    gfx.fillRect(25, 68, 10, 4);

    // Head (broader face)
    gfx.fillStyle(COLORS.andrei.skin);
    gfx.fillRect(12, 4, 24, 26);

    // Hair (dark brown, short fade on sides, less volume on top)
    gfx.fillStyle(COLORS.andrei.hair);
    // Top (shorter, not too tall)
    gfx.fillRect(15, 1, 18, 2);  // upper
    gfx.fillRect(13, 3, 22, 5);  // main body
    // Short fade on sides (still hair, just shorter/lighter)
    gfx.fillStyle(0x3a2515); // medium fade
    gfx.fillRect(11, 4, 2, 5);
    gfx.fillRect(35, 4, 2, 5);
    gfx.fillStyle(0x4a3525); // lighter at bottom
    gfx.fillRect(11, 8, 2, 4);
    gfx.fillRect(35, 8, 2, 4);

    // Rectangular prescription glasses - thin dark frames
    gfx.fillStyle(COLORS.andrei.glasses);
    // Left lens frame
    gfx.fillRect(13, 13, 9, 1);  // top
    gfx.fillRect(13, 19, 9, 1);  // bottom
    gfx.fillRect(13, 13, 1, 7);  // left
    gfx.fillRect(21, 13, 1, 7);  // right
    // Right lens frame
    gfx.fillRect(24, 13, 9, 1);  // top
    gfx.fillRect(24, 19, 9, 1);  // bottom
    gfx.fillRect(24, 13, 1, 7);  // left
    gfx.fillRect(32, 13, 1, 7);  // right
    // Bridge
    gfx.fillRect(21, 15, 3, 1);
    // Temples going to ears
    gfx.fillRect(11, 14, 2, 1);
    gfx.fillRect(33, 14, 4, 1);

    // Lens fill (light blue-grey - transparent look)
    gfx.fillStyle(COLORS.andrei.lenses);
    gfx.fillRect(14, 14, 7, 5);
    gfx.fillRect(25, 14, 7, 5);

    // Eyes visible through lenses (dark brown pupils)
    gfx.fillStyle(COLORS.andrei.eyes);
    gfx.fillRect(16, 15, 3, 3);
    gfx.fillRect(28, 15, 3, 3);
    // Eye whites
    gfx.fillStyle(0xffffff);
    gfx.fillRect(15, 15, 1, 3);
    gfx.fillRect(19, 15, 1, 3);
    gfx.fillRect(27, 15, 1, 3);
    gfx.fillRect(31, 15, 1, 3);

    // Full trimmed beard (covers jaw, chin, connects to mustache)
    gfx.fillStyle(COLORS.andrei.beard);
    // Mustache
    gfx.fillRect(16, 22, 14, 2);
    // Jaw sides
    gfx.fillRect(12, 20, 3, 8);
    gfx.fillRect(33, 20, 3, 8);
    // Chin and lower jaw
    gfx.fillRect(14, 25, 20, 4);
    gfx.fillRect(15, 29, 18, 1);
    // Under lip area
    gfx.fillRect(18, 24, 10, 1);

    // Mouth/smile visible through beard (big grin with teeth)
    gfx.fillStyle(0xeebb99);
    gfx.fillRect(18, 23, 10, 1);
    gfx.fillStyle(0xffffff); // teeth
    gfx.fillRect(19, 23, 8, 1);
    // Smile corners
    gfx.fillStyle(0xeebb99);
    gfx.fillRect(17, 22, 1, 1);
    gfx.fillRect(28, 22, 1, 1);

    // Hands
    gfx.fillStyle(COLORS.andrei.skin);
    gfx.fillRect(5, 44, 7, 5);
    gfx.fillRect(36, 44, 7, 5);
}

function drawZanuffJump(gfx) {
    // Body - Red Bazinga T-shirt
    gfx.fillStyle(0xcc2222);
    gfx.fillRect(11, 28, 26, 24);
    gfx.fillRect(3, 28, 10, 12);
    gfx.fillRect(35, 28, 10, 12);
    // BAZINGA text
    gfx.fillStyle(0xffff00);
    gfx.fillRect(14, 36, 2, 6);
    gfx.fillRect(16, 36, 1, 1);
    gfx.fillRect(16, 39, 1, 1);
    gfx.fillRect(16, 41, 1, 1);
    gfx.fillRect(18, 37, 1, 5);
    gfx.fillRect(20, 37, 1, 5);
    gfx.fillRect(18, 36, 3, 1);
    gfx.fillRect(18, 39, 3, 1);
    gfx.fillRect(22, 36, 3, 1);
    gfx.fillRect(22, 41, 3, 1);
    gfx.fillRect(24, 37, 1, 1);
    gfx.fillRect(23, 38, 1, 1);
    gfx.fillRect(22, 39, 1, 2);
    gfx.fillRect(26, 36, 1, 6);
    gfx.fillRect(28, 36, 1, 6);
    gfx.fillRect(30, 36, 1, 6);
    gfx.fillRect(29, 37, 1, 2);
    gfx.fillRect(32, 36, 3, 1);
    gfx.fillRect(32, 41, 3, 1);
    gfx.fillRect(32, 36, 1, 6);
    gfx.fillRect(34, 39, 1, 3);

    // Legs spread
    gfx.fillStyle(0x2a2a3a);
    gfx.fillRect(12, 52, 8, 16);
    gfx.fillRect(28, 52, 8, 16);
    gfx.fillStyle(0x333333);
    gfx.fillRect(11, 66, 10, 4);
    gfx.fillRect(27, 66, 10, 4);

    // Head
    gfx.fillStyle(COLORS.andrei.skin);
    gfx.fillRect(12, 2, 24, 26);

    // Hair (short fade on sides, less volume on top)
    gfx.fillStyle(COLORS.andrei.hair);
    gfx.fillRect(15, 0, 18, 2);
    gfx.fillRect(13, 2, 22, 5);
    // Short fade on sides
    gfx.fillStyle(0x3a2515);
    gfx.fillRect(11, 3, 2, 4);
    gfx.fillRect(35, 3, 2, 4);
    gfx.fillStyle(0x4a3525);
    gfx.fillRect(11, 6, 2, 3);
    gfx.fillRect(35, 6, 2, 3);

    // Glasses
    gfx.fillStyle(COLORS.andrei.glasses);
    gfx.fillRect(13, 11, 9, 1);
    gfx.fillRect(13, 17, 9, 1);
    gfx.fillRect(13, 11, 1, 7);
    gfx.fillRect(21, 11, 1, 7);
    gfx.fillRect(24, 11, 9, 1);
    gfx.fillRect(24, 17, 9, 1);
    gfx.fillRect(24, 11, 1, 7);
    gfx.fillRect(32, 11, 1, 7);
    gfx.fillRect(21, 13, 3, 1);
    gfx.fillRect(11, 12, 2, 1);
    gfx.fillRect(33, 12, 4, 1);

    // Lenses
    gfx.fillStyle(COLORS.andrei.lenses);
    gfx.fillRect(14, 12, 7, 5);
    gfx.fillRect(25, 12, 7, 5);

    // Eyes
    gfx.fillStyle(COLORS.andrei.eyes);
    gfx.fillRect(16, 13, 3, 3);
    gfx.fillRect(28, 13, 3, 3);
    gfx.fillStyle(0xffffff);
    gfx.fillRect(15, 13, 1, 3);
    gfx.fillRect(19, 13, 1, 3);
    gfx.fillRect(27, 13, 1, 3);
    gfx.fillRect(31, 13, 1, 3);

    // Full trimmed beard
    gfx.fillStyle(COLORS.andrei.beard);
    gfx.fillRect(16, 20, 14, 2);
    gfx.fillRect(12, 18, 3, 8);
    gfx.fillRect(33, 18, 3, 8);
    gfx.fillRect(14, 23, 20, 4);
    gfx.fillRect(15, 27, 18, 1);

    // Smile (big grin with teeth)
    gfx.fillStyle(0xeebb99);
    gfx.fillRect(18, 21, 10, 1);
    gfx.fillStyle(0xffffff);
    gfx.fillRect(19, 21, 8, 1);
    gfx.fillStyle(0xeebb99);
    gfx.fillRect(17, 20, 1, 1);
    gfx.fillRect(28, 20, 1, 1);

    // Hands up
    gfx.fillStyle(COLORS.andrei.skin);
    gfx.fillRect(3, 22, 7, 5);
    gfx.fillRect(38, 22, 7, 5);
}

function drawMarabeige(gfx) {
    // === MARIA / MARABEIGE ===
    // Slim build, long curly highlighted blonde hair, blue-green eyes, always smiling, red lips

    // Body (pink/red top - slim)
    gfx.fillStyle(COLORS.maria.outfit);
    gfx.fillRect(15, 32, 18, 18);
    // Neckline detail
    gfx.fillStyle(0xc73550);
    gfx.fillRect(19, 32, 10, 3);

    // Skirt
    gfx.fillStyle(0xc73550);
    gfx.fillRect(13, 48, 22, 8);

    // Legs (slim)
    gfx.fillStyle(COLORS.maria.skin);
    gfx.fillRect(16, 56, 6, 12);
    gfx.fillRect(26, 56, 6, 12);
    // Shoes
    gfx.fillStyle(0xcc3366);
    gfx.fillRect(15, 68, 8, 4);
    gfx.fillRect(25, 68, 8, 4);

    // Head (slimmer face)
    gfx.fillStyle(COLORS.maria.skin);
    gfx.fillRect(14, 6, 20, 24);

    // Hair (long, curly, dark blonde with highlights - falls past shoulders)
    gfx.fillStyle(COLORS.maria.hair);
    // Top and crown
    gfx.fillRect(12, 2, 24, 10);
    // Left side - long curly
    gfx.fillRect(10, 2, 4, 42);
    gfx.fillRect(7, 8, 4, 34);
    // Right side - long curly
    gfx.fillRect(34, 2, 4, 42);
    gfx.fillRect(37, 8, 4, 34);
    // Curly wave texture left
    gfx.fillRect(5, 14, 3, 4);
    gfx.fillRect(6, 22, 3, 4);
    gfx.fillRect(5, 30, 3, 4);
    gfx.fillRect(7, 38, 2, 4);
    // Curly wave texture right
    gfx.fillRect(40, 14, 3, 4);
    gfx.fillRect(39, 22, 3, 4);
    gfx.fillRect(40, 30, 3, 4);
    gfx.fillRect(39, 38, 2, 4);
    // Top volume
    gfx.fillRect(12, 0, 24, 4);

    // Highlights (lighter golden streaks)
    gfx.fillStyle(COLORS.maria.hairHighlight);
    gfx.fillRect(15, 2, 2, 8);
    gfx.fillRect(22, 1, 3, 6);
    gfx.fillRect(30, 2, 2, 8);
    gfx.fillRect(11, 14, 1, 14);
    gfx.fillRect(36, 12, 1, 14);
    gfx.fillRect(8, 20, 1, 12);
    gfx.fillRect(39, 18, 1, 12);
    gfx.fillRect(9, 34, 1, 8);
    gfx.fillRect(38, 32, 1, 8);

    // Eyes (blue-green teal, large and expressive)
    gfx.fillStyle(0xffffff); // whites
    gfx.fillRect(17, 14, 6, 5);
    gfx.fillRect(27, 14, 6, 5);
    // Iris (blue-green)
    gfx.fillStyle(COLORS.maria.eyes);
    gfx.fillRect(19, 15, 4, 4);
    gfx.fillRect(29, 15, 4, 4);
    // Pupil
    gfx.fillStyle(0x1a3a3a);
    gfx.fillRect(20, 16, 2, 2);
    gfx.fillRect(30, 16, 2, 2);
    // Eye shine
    gfx.fillStyle(0xffffff);
    gfx.fillRect(20, 15, 1, 1);
    gfx.fillRect(30, 15, 1, 1);
    // Eyelashes
    gfx.fillStyle(0x333333);
    gfx.fillRect(17, 13, 6, 1);
    gfx.fillRect(27, 13, 6, 1);

    // Eyebrows
    gfx.fillStyle(COLORS.maria.hair);
    gfx.fillRect(18, 11, 5, 1);
    gfx.fillRect(28, 11, 5, 1);

    // Nose (subtle)
    gfx.fillStyle(0xf0c8a8);
    gfx.fillRect(23, 19, 2, 3);

    // Smile (red lipstick, open toothy smile)
    gfx.fillStyle(0xcc2244);
    gfx.fillRect(20, 24, 8, 2);
    gfx.fillRect(21, 26, 6, 2);
    // Teeth
    gfx.fillStyle(0xffffff);
    gfx.fillRect(22, 24, 5, 2);
    gfx.fillRect(22, 26, 5, 1);

    // Necklace
    gfx.fillStyle(0xcccccc);
    gfx.fillRect(18, 30, 12, 1);
    gfx.fillStyle(0x3344aa);
    gfx.fillRect(23, 31, 2, 2); // pendant

    // Arms (slim)
    gfx.fillStyle(COLORS.maria.skin);
    gfx.fillRect(9, 34, 5, 14);
    gfx.fillRect(34, 34, 5, 14);
    // Hands
    gfx.fillRect(8, 48, 5, 4);
    gfx.fillRect(35, 48, 5, 4);
}

function drawMarabeigeJump(gfx) {
    // Body
    gfx.fillStyle(COLORS.maria.outfit);
    gfx.fillRect(15, 30, 18, 18);
    gfx.fillStyle(0xc73550);
    gfx.fillRect(19, 30, 10, 3);

    // Skirt flowing
    gfx.fillStyle(0xc73550);
    gfx.fillRect(11, 46, 26, 8);

    // Legs spread
    gfx.fillStyle(COLORS.maria.skin);
    gfx.fillRect(13, 54, 6, 14);
    gfx.fillRect(29, 54, 6, 14);
    gfx.fillStyle(0xcc3366);
    gfx.fillRect(12, 66, 8, 4);
    gfx.fillRect(28, 66, 8, 4);

    // Head
    gfx.fillStyle(COLORS.maria.skin);
    gfx.fillRect(14, 4, 20, 24);

    // Hair flowing (more spread out when jumping)
    gfx.fillStyle(COLORS.maria.hair);
    gfx.fillRect(12, 0, 24, 10);
    gfx.fillRect(8, 2, 5, 44);
    gfx.fillRect(35, 2, 5, 44);
    gfx.fillRect(4, 10, 5, 34);
    gfx.fillRect(39, 10, 5, 34);
    gfx.fillRect(12, 0, 24, 4);
    // Curly waves flowing
    gfx.fillRect(2, 16, 3, 4);
    gfx.fillRect(3, 24, 3, 4);
    gfx.fillRect(2, 32, 3, 4);
    gfx.fillRect(43, 16, 3, 4);
    gfx.fillRect(42, 24, 3, 4);
    gfx.fillRect(43, 32, 3, 4);

    // Highlights
    gfx.fillStyle(COLORS.maria.hairHighlight);
    gfx.fillRect(16, 0, 2, 7);
    gfx.fillRect(23, 0, 3, 5);
    gfx.fillRect(30, 0, 2, 7);
    gfx.fillRect(9, 14, 1, 14);
    gfx.fillRect(38, 12, 1, 14);
    gfx.fillRect(5, 22, 1, 12);
    gfx.fillRect(42, 20, 1, 12);

    // Eyes
    gfx.fillStyle(0xffffff);
    gfx.fillRect(17, 12, 6, 5);
    gfx.fillRect(27, 12, 6, 5);
    gfx.fillStyle(COLORS.maria.eyes);
    gfx.fillRect(19, 13, 4, 4);
    gfx.fillRect(29, 13, 4, 4);
    gfx.fillStyle(0x1a3a3a);
    gfx.fillRect(20, 14, 2, 2);
    gfx.fillRect(30, 14, 2, 2);
    gfx.fillStyle(0xffffff);
    gfx.fillRect(20, 13, 1, 1);
    gfx.fillRect(30, 13, 1, 1);
    gfx.fillStyle(0x333333);
    gfx.fillRect(17, 11, 6, 1);
    gfx.fillRect(27, 11, 6, 1);

    // Eyebrows
    gfx.fillStyle(COLORS.maria.hair);
    gfx.fillRect(18, 9, 5, 1);
    gfx.fillRect(28, 9, 5, 1);

    // Smile (red lipstick, open toothy smile)
    gfx.fillStyle(0xcc2244);
    gfx.fillRect(20, 22, 8, 2);
    gfx.fillRect(21, 24, 6, 2);
    // Teeth
    gfx.fillStyle(0xffffff);
    gfx.fillRect(22, 22, 5, 2);
    gfx.fillRect(22, 24, 5, 1);

    // Necklace
    gfx.fillStyle(0xcccccc);
    gfx.fillRect(18, 28, 12, 1);
    gfx.fillStyle(0x3344aa);
    gfx.fillRect(23, 29, 2, 2);

    // Arms up
    gfx.fillStyle(COLORS.maria.skin);
    gfx.fillRect(6, 24, 5, 14);
    gfx.fillRect(37, 24, 5, 14);
    // Hands up
    gfx.fillRect(5, 20, 5, 5);
    gfx.fillRect(38, 20, 5, 5);
}

function drawTwitchLogo(gfx) {
    // Twitch purple background shape
    gfx.fillStyle(0x9146ff);
    // Main body
    gfx.fillRect(6, 4, 36, 34);
    // Speech bubble notch bottom-left
    gfx.fillRect(10, 38, 8, 6);
    // Right notch
    gfx.fillRect(30, 34, 6, 8);
    // Inner white area
    gfx.fillStyle(0xffffff);
    gfx.fillRect(10, 8, 28, 26);
    // Twitch "eyes" (the two vertical bars)
    gfx.fillStyle(0x9146ff);
    gfx.fillRect(18, 14, 4, 12);
    gfx.fillRect(26, 14, 4, 12);
}

export function createEnemySprites(scene) {
    // Doubt Cloud
    const doubtGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    doubtGfx.fillStyle(0x666688);
    doubtGfx.fillCircle(20, 20, 16);
    doubtGfx.fillCircle(12, 22, 10);
    doubtGfx.fillCircle(28, 22, 10);
    doubtGfx.fillStyle(0xff4444);
    doubtGfx.fillRect(14, 16, 4, 4);
    doubtGfx.fillRect(24, 16, 4, 4);
    doubtGfx.fillStyle(0x333333);
    doubtGfx.fillRect(15, 28, 10, 2);
    doubtGfx.generateTexture('enemy-doubt', 40, 40);
    doubtGfx.destroy();

    // Email Swarm
    const emailGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    emailGfx.fillStyle(0xffffff);
    emailGfx.fillRect(4, 10, 32, 20);
    emailGfx.fillStyle(0xdd4444);
    emailGfx.fillTriangle(4, 10, 20, 22, 36, 10);
    emailGfx.fillStyle(0xff0000);
    emailGfx.fillCircle(34, 8, 6);
    emailGfx.fillStyle(0xffffff);
    emailGfx.fillRect(32, 6, 5, 2);
    emailGfx.generateTexture('enemy-email', 40, 40);
    emailGfx.destroy();

    // Paperwork Golem
    const paperGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    paperGfx.fillStyle(0xfff8dc);
    paperGfx.fillRect(6, 2, 28, 36);
    paperGfx.fillStyle(0x333333);
    paperGfx.fillRect(10, 8, 16, 2);
    paperGfx.fillRect(10, 13, 16, 2);
    paperGfx.fillRect(10, 18, 16, 2);
    paperGfx.fillStyle(0xff0000);
    paperGfx.fillRect(12, 24, 5, 5);
    paperGfx.fillRect(22, 24, 5, 5);
    paperGfx.fillStyle(0x333333);
    paperGfx.fillRect(14, 32, 12, 2);
    paperGfx.generateTexture('enemy-paper', 40, 40);
    paperGfx.destroy();

    // Moving Box
    const boxGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    boxGfx.fillStyle(0x8B4513);
    boxGfx.fillRect(2, 4, 36, 32);
    boxGfx.fillStyle(0xDEB887);
    boxGfx.fillRect(4, 6, 32, 28);
    boxGfx.lineStyle(2, 0x8B4513);
    boxGfx.strokeRect(4, 6, 32, 28);
    boxGfx.fillStyle(0x333333);
    boxGfx.fillRect(12, 16, 5, 5);
    boxGfx.fillRect(22, 16, 5, 5);
    boxGfx.fillStyle(0x666666);
    boxGfx.fillRect(16, 26, 8, 3);
    boxGfx.generateTexture('enemy-box', 40, 40);
    boxGfx.destroy();

    // Butterfly (nervousness)
    const butterflyGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    butterflyGfx.fillStyle(0xff88cc);
    butterflyGfx.fillCircle(12, 16, 10);
    butterflyGfx.fillCircle(28, 16, 10);
    butterflyGfx.fillStyle(0xff44aa);
    butterflyGfx.fillCircle(12, 22, 7);
    butterflyGfx.fillCircle(28, 22, 7);
    butterflyGfx.fillStyle(0x333333);
    butterflyGfx.fillRect(19, 10, 2, 22);
    butterflyGfx.generateTexture('enemy-butterfly', 40, 40);
    butterflyGfx.destroy();

    // Tourist enemy (camera flash)
    const touristGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    touristGfx.fillStyle(0x444444);
    touristGfx.fillRect(10, 14, 20, 14); // camera body
    touristGfx.fillStyle(0x222222);
    touristGfx.fillCircle(20, 21, 6); // lens
    touristGfx.fillStyle(0x88ccff);
    touristGfx.fillCircle(20, 21, 4); // lens glass
    touristGfx.fillStyle(0xffff00);
    touristGfx.fillCircle(20, 6, 7); // flash burst
    touristGfx.fillStyle(0xffffff);
    touristGfx.fillCircle(20, 6, 4);
    touristGfx.generateTexture('enemy-tourist', 40, 40);
    touristGfx.destroy();

    // Generic enemy - LoL caster minion style (purple robed, glowing eyes)
    const genericGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    // Robe/body (purple)
    genericGfx.fillStyle(0x5533aa);
    genericGfx.fillTriangle(10, 38, 20, 16, 30, 38); // robe body
    genericGfx.fillStyle(0x442288);
    genericGfx.fillTriangle(12, 38, 20, 20, 28, 38); // inner robe shade
    // Hood
    genericGfx.fillStyle(0x5533aa);
    genericGfx.fillCircle(20, 12, 9);
    genericGfx.fillStyle(0x331166);
    genericGfx.fillCircle(20, 14, 7); // hood shadow/opening
    // Glowing eyes
    genericGfx.fillStyle(0xff4444);
    genericGfx.fillRect(16, 12, 3, 3);
    genericGfx.fillRect(22, 12, 3, 3);
    // Eye glow
    genericGfx.fillStyle(0xff8888);
    genericGfx.fillRect(17, 13, 1, 1);
    genericGfx.fillRect(23, 13, 1, 1);
    // Staff
    genericGfx.fillStyle(0x886622);
    genericGfx.fillRect(30, 6, 2, 32);
    genericGfx.fillStyle(0xaa44ff);
    genericGfx.fillCircle(31, 6, 4); // orb on staff
    genericGfx.generateTexture('enemy-generic', 40, 40);
    genericGfx.destroy();

    // Melon minion (for Zanuff) - LoL melee minion with watermelon head
    const melonGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    // Robe/body (dark green)
    melonGfx.fillStyle(0x1a5c1a);
    melonGfx.fillTriangle(10, 38, 20, 16, 30, 38);
    melonGfx.fillStyle(0x0f3d0f);
    melonGfx.fillTriangle(12, 38, 20, 20, 28, 38);
    // Melon head (round watermelon)
    melonGfx.fillStyle(0x2d8b2d);
    melonGfx.fillCircle(20, 11, 10);
    // Stripes on melon head
    melonGfx.fillStyle(0x5cb85c);
    melonGfx.fillRect(15, 3, 2, 16);
    melonGfx.fillRect(20, 2, 2, 18);
    melonGfx.fillRect(25, 3, 2, 16);
    // Angry glowing eyes
    melonGfx.fillStyle(0xff0000);
    melonGfx.fillRect(15, 10, 4, 3);
    melonGfx.fillRect(22, 10, 4, 3);
    // Angry eyebrows (slanted)
    melonGfx.fillStyle(0x111111);
    melonGfx.fillRect(14, 8, 5, 2);
    melonGfx.fillRect(22, 8, 5, 2);
    // Little sword (melee minion)
    melonGfx.fillStyle(0xaaaaaa);
    melonGfx.fillRect(31, 14, 2, 14); // blade
    melonGfx.fillStyle(0x886622);
    melonGfx.fillRect(30, 28, 4, 4); // hilt
    melonGfx.generateTexture('enemy-melon', 40, 40);
    melonGfx.destroy();

    // Flower minion (for Marabeige) - LoL caster minion with flower head
    const beerGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    // Robe/body (pink/magenta)
    beerGfx.fillStyle(0xcc44aa);
    beerGfx.fillTriangle(10, 38, 20, 16, 30, 38);
    beerGfx.fillStyle(0x993388);
    beerGfx.fillTriangle(12, 38, 20, 20, 28, 38);
    // Flower head - petals
    beerGfx.fillStyle(0xff66aa);
    beerGfx.fillCircle(14, 8, 5);  // left petal
    beerGfx.fillCircle(26, 8, 5);  // right petal
    beerGfx.fillCircle(20, 4, 5);  // top petal
    beerGfx.fillCircle(16, 14, 5); // bottom-left petal
    beerGfx.fillCircle(24, 14, 5); // bottom-right petal
    // Center of flower (face)
    beerGfx.fillStyle(0xffdd00);
    beerGfx.fillCircle(20, 10, 6);
    // Evil eyes
    beerGfx.fillStyle(0x660000);
    beerGfx.fillRect(17, 8, 3, 3);
    beerGfx.fillRect(22, 8, 3, 3);
    // Pollen particles floating around
    beerGfx.fillStyle(0xffff66);
    beerGfx.fillCircle(8, 4, 2);
    beerGfx.fillCircle(32, 6, 2);
    beerGfx.fillCircle(6, 16, 2);
    beerGfx.fillCircle(34, 14, 2);
    // Staff with pollen orb
    beerGfx.fillStyle(0x44aa44);
    beerGfx.fillRect(31, 10, 2, 26); // green stem staff
    beerGfx.fillStyle(0xffff00);
    beerGfx.fillCircle(32, 9, 3); // pollen orb
    beerGfx.generateTexture('enemy-flower', 40, 40);
    beerGfx.destroy();

    // Microsoft Teams notification enemy
    const teamsGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    // Purple Teams icon background
    teamsGfx.fillStyle(0x5b5fc7);
    teamsGfx.fillRect(4, 4, 32, 32);
    // White T shape
    teamsGfx.fillStyle(0xffffff);
    teamsGfx.fillRect(10, 10, 20, 4); // top bar
    teamsGfx.fillRect(18, 10, 4, 20); // vertical bar
    // Notification badge (red circle with number)
    teamsGfx.fillStyle(0xff0000);
    teamsGfx.fillCircle(32, 8, 6);
    teamsGfx.fillStyle(0xffffff);
    teamsGfx.fillRect(30, 6, 4, 4); // "!" 
    teamsGfx.generateTexture('enemy-teams', 40, 40);
    teamsGfx.destroy();

    // McDonald's food (burger/fries)
    const mcGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    mcGfx.fillStyle(0xffcc00); // top bun
    mcGfx.fillCircle(20, 12, 12);
    mcGfx.fillStyle(0x8B4513); // patty
    mcGfx.fillRect(8, 16, 24, 6);
    mcGfx.fillStyle(0x228b22); // lettuce
    mcGfx.fillRect(7, 14, 26, 3);
    mcGfx.fillStyle(0xff0000); // ketchup
    mcGfx.fillRect(10, 22, 20, 2);
    mcGfx.fillStyle(0xffcc00); // bottom bun
    mcGfx.fillRect(8, 24, 24, 6);
    mcGfx.fillStyle(0xff0000); // M arches
    mcGfx.fillRect(14, 32, 3, 6); mcGfx.fillRect(23, 32, 3, 6);
    mcGfx.fillRect(16, 30, 2, 2); mcGfx.fillRect(22, 30, 2, 2);
    mcGfx.fillRect(18, 29, 4, 2);
    mcGfx.generateTexture('enemy-mcdonalds', 40, 40);
    mcGfx.destroy();

    // BMW logo
    const bmwGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    bmwGfx.fillStyle(0x333333); // outer ring
    bmwGfx.fillCircle(20, 20, 16);
    bmwGfx.fillStyle(0x1a1a1a); // inner ring
    bmwGfx.fillCircle(20, 20, 14);
    bmwGfx.fillStyle(0x0066cc); // blue quadrants
    bmwGfx.fillRect(20, 6, 14, 14);
    bmwGfx.fillRect(6, 20, 14, 14);
    bmwGfx.fillStyle(0xffffff); // white quadrants
    bmwGfx.fillRect(6, 6, 14, 14);
    bmwGfx.fillRect(20, 20, 14, 14);
    // Clip to circle with dark overlay on corners
    bmwGfx.fillStyle(0x1a1a1a);
    bmwGfx.fillRect(0, 0, 6, 40); bmwGfx.fillRect(34, 0, 6, 40);
    bmwGfx.fillRect(0, 0, 40, 4); bmwGfx.fillRect(0, 36, 40, 4);
    bmwGfx.generateTexture('enemy-bmw', 40, 40);
    bmwGfx.destroy();

    // Ring (engagement/wedding ring)
    const ringGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    ringGfx.lineStyle(4, 0xffd700);
    ringGfx.strokeCircle(20, 22, 12);
    ringGfx.fillStyle(0xffd700);
    ringGfx.fillCircle(20, 22, 12);
    ringGfx.fillStyle(0x1a1a2e); // hole
    ringGfx.fillCircle(20, 22, 8);
    // Diamond on top
    ringGfx.fillStyle(0x88ddff);
    ringGfx.fillRect(16, 6, 8, 8);
    ringGfx.fillStyle(0xaaeeff);
    ringGfx.fillRect(18, 4, 4, 4);
    ringGfx.fillStyle(0xffffff);
    ringGfx.fillRect(19, 5, 2, 2);
    ringGfx.generateTexture('enemy-ring', 40, 40);
    ringGfx.destroy();

    // Wedding items (champagne glass)
    const weddingGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    weddingGfx.fillStyle(0xaaddff, 0.7); // glass bowl
    weddingGfx.fillCircle(20, 12, 10);
    weddingGfx.fillStyle(0xffdd44, 0.6); // champagne liquid
    weddingGfx.fillCircle(20, 14, 7);
    weddingGfx.fillStyle(0xcccccc); // stem
    weddingGfx.fillRect(18, 22, 4, 10);
    weddingGfx.fillStyle(0xcccccc); // base
    weddingGfx.fillRect(14, 32, 12, 3);
    // Bubbles
    weddingGfx.fillStyle(0xffffff, 0.7);
    weddingGfx.fillCircle(18, 10, 2); weddingGfx.fillCircle(22, 8, 1.5);
    weddingGfx.generateTexture('enemy-wedding', 40, 40);
    weddingGfx.destroy();

    // Keys (house keys)
    const keysGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    keysGfx.fillStyle(0xccaa44); // key head (circle)
    keysGfx.fillCircle(14, 14, 8);
    keysGfx.fillStyle(0x1a1a2e); // key hole
    keysGfx.fillCircle(14, 14, 4);
    keysGfx.fillStyle(0xccaa44); // key shaft
    keysGfx.fillRect(20, 12, 16, 4);
    // Key teeth
    keysGfx.fillRect(30, 16, 3, 4); keysGfx.fillRect(34, 16, 3, 4);
    keysGfx.fillRect(26, 16, 3, 3);
    // Second key
    keysGfx.fillStyle(0xaaaaaa);
    keysGfx.fillCircle(16, 26, 6);
    keysGfx.fillStyle(0x1a1a2e);
    keysGfx.fillCircle(16, 26, 3);
    keysGfx.fillStyle(0xaaaaaa);
    keysGfx.fillRect(22, 24, 12, 3);
    keysGfx.fillRect(30, 27, 3, 3); keysGfx.fillRect(26, 27, 3, 3);
    keysGfx.generateTexture('enemy-keys', 40, 40);
    keysGfx.destroy();

    // Cake (wedding cake)
    const cakeGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    cakeGfx.fillStyle(0xffffff); // bottom tier
    cakeGfx.fillRect(6, 26, 28, 10);
    cakeGfx.fillStyle(0xffeeee); // middle tier
    cakeGfx.fillRect(10, 16, 20, 10);
    cakeGfx.fillStyle(0xffffff); // top tier
    cakeGfx.fillRect(14, 8, 12, 8);
    // Decorations
    cakeGfx.fillStyle(0xff6688); // pink frosting
    cakeGfx.fillRect(6, 26, 28, 2); cakeGfx.fillRect(10, 16, 20, 2); cakeGfx.fillRect(14, 8, 12, 2);
    // Heart on top
    cakeGfx.fillStyle(0xff4466);
    cakeGfx.fillCircle(18, 5, 3); cakeGfx.fillCircle(22, 5, 3);
    cakeGfx.fillRect(16, 5, 8, 5);
    cakeGfx.generateTexture('enemy-cake', 40, 40);
    cakeGfx.destroy();
}

export function createItemSprites(scene) {
    // Controller power-up
    const ctrlGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    ctrlGfx.fillStyle(0x333333);
    ctrlGfx.fillRoundedRect(4, 10, 32, 20, 6);
    ctrlGfx.fillStyle(0x44ff44);
    ctrlGfx.fillRect(10, 16, 4, 2);
    ctrlGfx.fillRect(11, 15, 2, 4);
    ctrlGfx.fillStyle(0xff4444);
    ctrlGfx.fillCircle(28, 18, 3);
    ctrlGfx.fillStyle(0x4444ff);
    ctrlGfx.fillCircle(24, 22, 2);
    ctrlGfx.fillStyle(0xffff00);
    ctrlGfx.fillCircle(32, 14, 2);
    ctrlGfx.generateTexture('powerup-controller', 40, 40);
    ctrlGfx.destroy();

    // Heart collectible
    const heartGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    heartGfx.fillStyle(0xff2266);
    heartGfx.fillCircle(14, 14, 8);
    heartGfx.fillCircle(26, 14, 8);
    heartGfx.fillTriangle(6, 16, 34, 16, 20, 34);
    heartGfx.generateTexture('heart', 40, 40);
    heartGfx.destroy();

    // McDonald's collectibles for Level 1
    // Big Mac
    const bigmacGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    bigmacGfx.fillStyle(0xd4a043); // top bun
    bigmacGfx.fillRoundedRect(8, 6, 24, 8, 4);
    bigmacGfx.fillStyle(0x228b22); // lettuce
    bigmacGfx.fillRect(6, 13, 28, 3);
    bigmacGfx.fillStyle(0x8b4513); // patty 1
    bigmacGfx.fillRect(8, 16, 24, 5);
    bigmacGfx.fillStyle(0xd4a043); // middle bun
    bigmacGfx.fillRect(8, 21, 24, 4);
    bigmacGfx.fillStyle(0x8b4513); // patty 2
    bigmacGfx.fillRect(8, 25, 24, 5);
    bigmacGfx.fillStyle(0xffcc00); // cheese
    bigmacGfx.fillRect(6, 24, 28, 2);
    bigmacGfx.fillStyle(0xd4a043); // bottom bun
    bigmacGfx.fillRect(8, 30, 24, 6);
    bigmacGfx.generateTexture('mcdonalds-bigmac', 40, 40);
    bigmacGfx.destroy();

    // Fries
    const friesGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    friesGfx.fillStyle(0xcc0000); // box
    friesGfx.fillRect(10, 16, 20, 18);
    friesGfx.fillStyle(0xffcc00); // M on box
    friesGfx.fillRect(14, 22, 3, 8);
    friesGfx.fillRect(23, 22, 3, 8);
    friesGfx.fillRect(17, 20, 2, 4);
    friesGfx.fillRect(21, 20, 2, 4);
    friesGfx.fillStyle(0xffdd44); // fries sticking out
    friesGfx.fillRect(12, 8, 3, 12);
    friesGfx.fillRect(16, 6, 3, 14);
    friesGfx.fillRect(20, 7, 3, 13);
    friesGfx.fillRect(24, 9, 3, 11);
    friesGfx.generateTexture('mcdonalds-fries', 40, 40);
    friesGfx.destroy();

    // Hamburger
    const burgerGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    burgerGfx.fillStyle(0xd4a043); // top bun
    burgerGfx.fillRoundedRect(8, 10, 24, 8, 4);
    burgerGfx.fillStyle(0x228b22); // lettuce
    burgerGfx.fillRect(6, 17, 28, 3);
    burgerGfx.fillStyle(0x8b4513); // patty
    burgerGfx.fillRect(8, 20, 24, 5);
    burgerGfx.fillStyle(0xffcc00); // cheese
    burgerGfx.fillRect(6, 19, 28, 2);
    burgerGfx.fillStyle(0xd4a043); // bottom bun
    burgerGfx.fillRect(8, 25, 24, 6);
    burgerGfx.generateTexture('mcdonalds-burger', 40, 40);
    burgerGfx.destroy();

    // Soda cup
    const sodaGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    sodaGfx.fillStyle(0xcc0000); // cup
    sodaGfx.fillRect(13, 10, 14, 24);
    sodaGfx.fillRect(11, 10, 18, 4); // wider top
    sodaGfx.fillStyle(0xffcc00); // M logo
    sodaGfx.fillRect(16, 18, 2, 6);
    sodaGfx.fillRect(22, 18, 2, 6);
    sodaGfx.fillRect(18, 16, 1, 3);
    sodaGfx.fillRect(21, 16, 1, 3);
    sodaGfx.fillStyle(0xffffff); // lid
    sodaGfx.fillRect(10, 8, 20, 3);
    sodaGfx.fillStyle(0xcccccc); // straw
    sodaGfx.fillRect(18, 2, 2, 8);
    sodaGfx.generateTexture('mcdonalds-soda', 40, 40);
    sodaGfx.destroy();

    // Dog companion - French Bulldog
    const frenchieGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    frenchieGfx.fillStyle(0xd4a574);
    frenchieGfx.fillRect(8, 16, 24, 14); // body
    frenchieGfx.fillStyle(0xc49464);
    frenchieGfx.fillRect(12, 8, 18, 12); // head
    // Big bat ears (French Bulldog signature)
    frenchieGfx.fillStyle(0xd4a574);
    frenchieGfx.fillTriangle(12, 8, 8, 0, 16, 8);
    frenchieGfx.fillTriangle(26, 8, 32, 0, 30, 8);
    // Eyes
    frenchieGfx.fillStyle(0x222222);
    frenchieGfx.fillCircle(17, 13, 2);
    frenchieGfx.fillCircle(25, 13, 2);
    // Snout
    frenchieGfx.fillStyle(0x8B6914);
    frenchieGfx.fillRect(18, 16, 6, 4);
    // Legs
    frenchieGfx.fillStyle(0xc49464);
    frenchieGfx.fillRect(10, 30, 5, 8);
    frenchieGfx.fillRect(25, 30, 5, 8);
    frenchieGfx.generateTexture('dog-frenchie', 40, 40);
    frenchieGfx.destroy();

    // Dog companion - Pug
    const pugGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    pugGfx.fillStyle(0xe8c89c);
    pugGfx.fillRect(8, 16, 24, 14); // body
    pugGfx.fillStyle(0xd4b08c);
    pugGfx.fillCircle(20, 12, 10); // round head
    // Dark face mask
    pugGfx.fillStyle(0x6B4914);
    pugGfx.fillCircle(20, 14, 5);
    // Big eyes
    pugGfx.fillStyle(0x222222);
    pugGfx.fillCircle(16, 11, 3);
    pugGfx.fillCircle(24, 11, 3);
    // Floppy ears
    pugGfx.fillStyle(0x6B4914);
    pugGfx.fillRect(9, 8, 5, 8);
    pugGfx.fillRect(26, 8, 5, 8);
    // Legs
    pugGfx.fillStyle(0xd4b08c);
    pugGfx.fillRect(10, 30, 5, 8);
    pugGfx.fillRect(25, 30, 5, 8);
    // Curly tail
    pugGfx.fillStyle(0xe8c89c);
    pugGfx.fillCircle(34, 18, 3);
    pugGfx.generateTexture('dog-pug', 40, 40);
    pugGfx.destroy();
}

export function createTileSprites(scene) {
    // Ground tile
    const groundGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    groundGfx.fillStyle(0x4a8c3f);
    groundGfx.fillRect(0, 0, 32, 32);
    groundGfx.fillStyle(0x3d7534);
    groundGfx.fillRect(0, 0, 32, 4);
    groundGfx.fillStyle(0x5c3d1e);
    groundGfx.fillRect(0, 4, 32, 28);
    groundGfx.fillStyle(0x4a3218);
    groundGfx.fillRect(4, 8, 4, 4);
    groundGfx.fillRect(16, 14, 4, 4);
    groundGfx.fillRect(24, 22, 4, 4);
    groundGfx.generateTexture('tile-ground', 32, 32);
    groundGfx.destroy();

    // Platform tile
    const platGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    platGfx.fillStyle(0x6b5b3d);
    platGfx.fillRect(0, 0, 32, 16);
    platGfx.fillStyle(0x8b7355);
    platGfx.fillRect(0, 0, 32, 4);
    platGfx.fillStyle(0x5c4d33);
    platGfx.fillRect(2, 4, 2, 12);
    platGfx.fillRect(14, 4, 2, 12);
    platGfx.fillRect(28, 4, 2, 12);
    platGfx.generateTexture('tile-platform', 32, 16);
    platGfx.destroy();

    // City ground
    const cityGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    cityGfx.fillStyle(0x555555);
    cityGfx.fillRect(0, 0, 32, 32);
    cityGfx.fillStyle(0x666666);
    cityGfx.fillRect(0, 0, 32, 4);
    cityGfx.fillStyle(0x444444);
    cityGfx.fillRect(8, 12, 2, 2);
    cityGfx.fillRect(20, 20, 2, 2);
    cityGfx.generateTexture('tile-city', 32, 32);
    cityGfx.destroy();

    // House floor
    const houseGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    houseGfx.fillStyle(0xb8860b);
    houseGfx.fillRect(0, 0, 32, 32);
    houseGfx.fillStyle(0xa0760a);
    houseGfx.fillRect(0, 0, 16, 32);
    houseGfx.fillStyle(0xc89620);
    houseGfx.fillRect(0, 0, 32, 2);
    houseGfx.generateTexture('tile-house', 32, 32);
    houseGfx.destroy();

    // Sandy/vacation tile
    const sandGfx = scene.make.graphics({ x: 0, y: 0, add: false });
    sandGfx.fillStyle(0xc2a868);
    sandGfx.fillRect(0, 0, 32, 32);
    sandGfx.fillStyle(0xd4ba7a);
    sandGfx.fillRect(0, 0, 32, 4);
    sandGfx.fillStyle(0xb09858);
    sandGfx.fillRect(6, 12, 3, 3);
    sandGfx.fillRect(20, 8, 2, 2);
    sandGfx.fillRect(14, 22, 3, 3);
    sandGfx.generateTexture('tile-sand', 32, 32);
    sandGfx.destroy();
}
