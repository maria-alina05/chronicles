// Game constants and shared data
export const GAME_DATA = {
    title: 'The Chronicles of Zanuff & Marabeige',
    subtitle: '"Mad About You"',
    players: {
        p1: { name: 'Zanuff', realName: 'Andrei' },
        p2: { name: 'Marabeige', realName: 'Maria' }
    },
    intro: {
        description: [
            'A quiet evening at home...',
            'Zanuff and Marabeige are watching Doctorul_ on Twitch.',
            'Suddenly, the screen glitches... a strange light pulls them in!',
            'They wake up in a pixelated world - separated.',
            'They must find each other and relive their greatest moments together.'
        ]
    },
    mechanics: {
        flowerAllergy: {
            description: 'Marabeige is allergic to flowers! Zanuff must spray them before they hurt her.',
            zanuffAbility: 'Anti-Pollen Spray (hold E / Space to aim and shoot)',
            marabeigeWeakness: 'Takes damage near flowers, sneezes = knockback'
        }
    },
    levels: [
        {
            id: 1,
            title: 'The Beginning',
            date: 'January 31, 2025',
            description: 'Separated in the digital world, they must find each other. The day they became a couple - the day everything changed.',
            theme: 'park',
            enemies: ['doubt-cloud', 'distance-ghost'],
            flowers: true,
            storyBefore: ['Where am I?! I need to find you!', 'This world is strange... but I know you are out there.'],
            storyAfter: ['We found each other. From this moment on, we are one.', 'January 31 - the day our story truly began.']
        },
        {
            id: 2,
            title: 'New Horizons',
            date: 'October 2025',
            description: 'Together they leave the old world behind. A new adventure at a new company - but the inbox never sleeps.',
            theme: 'office',
            enemies: ['email-swarm', 'meeting-zombie', 'deadline-timer'],
            flowers: true,
            storyBefore: ['New company, new challenges!', 'At least we have each other in this meeting-infested dungeon.'],
            storyAfter: ['We survived corporate chaos... together.', 'Time to level up this relationship.']
        },
        {
            id: 3,
            title: 'Wanderlust',
            date: 'Summer 2025 - 2026',
            description: 'Marabeige wants to see EVERY tourist attraction. Zanuff... would rather stay at home. But love conquers laziness!',
            theme: 'vacation',
            enemies: ['tourist-camera', 'selfie-stick', 'tour-guide'],
            flowers: true,
            storyBefore: ['Can we just... sit at a cafe for five minutes?', 'Look! A castle! And a museum! And a church!'],
            storyAfter: ['Next time I pick the activity: board game cafe.', 'Okay, that sunset WAS worth the 10km walk.']
        },
        {
            id: 4,
            title: 'The Promise',
            date: 'January 31, 2026',
            description: 'Exactly one year later. One ring. One question. One forever. But first - survive the butterflies!',
            theme: 'romantic',
            enemies: ['butterfly-nerves', 'ring-guardian'],
            flowers: true,
            storyBefore: ['One year since we found each other again...', 'Zanuff has something important to say.'],
            storyAfter: ['She said YES!', 'Achievement Unlocked: Eternal Bond']
        },
        {
            id: 4,
            title: 'Forever Yours',
            date: 'July 18, 2026',
            description: 'The civil ceremony. Official on paper, eternal in the heart. Paperwork has never been this epic.',
            theme: 'city',
            enemies: ['paperwork-golem', 'bureaucracy-blob'],
            flowers: true,
            storyBefore: ['Today we make it official!', 'If we can defeat the bureaucracy boss...'],
            storyAfter: ['Signed, sealed, delivered - we are ONE.', 'But the adventure is far from over...']
        },
        {
            id: 5,
            title: 'Home Sweet Home',
            date: 'August 2026',
            description: 'Building their kingdom, one room at a time. The dogs approve. Watch out for rogue furniture!',
            theme: 'house',
            enemies: ['moving-box', 'furniture-puzzle', 'ikea-manual'],
            flowers: true,
            storyBefore: ['Our own castle! Well... once we unpack.', 'The French Bulldog and Pug are ready to help!'],
            storyAfter: ['Home is wherever you are.', 'And our dogs finally have a yard to zoom in.']
        }
    ],
    ending: {
        title: 'The Grand Celebration',
        date: 'September 27, 2026',
        description: 'The wedding. The party. The beginning of everything.',
        lines: [
            'They escaped the digital world...',
            'But the greatest adventure was the love they built together.',
            'From watching streamers on Twitch...',
            'To building a life, a home, a family.',
            '"Mad About You" - always and forever.',
            'The Chronicles of Zanuff & Marabeige',
            'To be continued... in real life.'
        ]
    }
};

export const COLORS = {
    bg: 0x1a1a2e,
    primary: 0xe94560,
    secondary: 0x0f3460,
    accent: 0x16213e,
    gold: 0xffd700,
    white: 0xffffff,
    
    // Maria/Marabeige colors
    maria: {
        hair: 0xb8934a,      // dark blonde base
        hairHighlight: 0xe0c878, // lighter highlights
        skin: 0xffdab9,      // light peach
        eyes: 0x2ea5b5,      // blueish-green teal
        outfit: 0xe94560     // pink/red
    },
    // Andrei/Zanuff colors
    andrei: {
        hair: 0x2e1a0a,      // very dark brown
        skin: 0xf5d6b8,      // slightly tan
        eyes: 0x4a3520,      // dark brown
        glasses: 0x5c4033,   // thin brown prescription frames
        lenses: 0xc8d8ee,    // light blue-grey transparent lenses
        beard: 0x2e1a0a,     // dark brown beard
        outfit: 0x1a1a1a     // black t-shirt
    }
};
