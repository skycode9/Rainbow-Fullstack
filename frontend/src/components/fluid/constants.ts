export const FLUID_OPTS = {
    blend: 5,
    intensity: 2,
    force: 1.1,
    distortion: 0.4,
    curl: 1.9,
    radius: 0.3,
    swirl: 4,
    pressure: 0.8,
    densityDissipation: 0.96,
    velocityDissipation: 1.0,
    fluidColor: '#40e0d0', // Turquoise to match your rainbow theme
    backgroundColor: '#000000',
    showBackground: false, // Let your existing background show through
    rainbow: true, // Enable rainbow mode for your brand
    dyeRes: 512,
    simRes: 128,
    refreshRate: 60,
} as const;
