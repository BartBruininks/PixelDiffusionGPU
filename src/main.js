import { PixelDiffusionSimulation } from './PixelDiffusionSimulation';

// Wait for the DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create the simulation
    const simulation = new PixelDiffusionSimulation('simulation-container');
    
    // For debugging
    window.simulation = simulation;
});