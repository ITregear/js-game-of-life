document.addEventListener('DOMContentLoaded', () => {
    const pauseButton = document.getElementById('pauseBtn');
    const resetButton = document.getElementById('resetBtn');
    const sparsenessSlider = document.getElementById('sparsenessSlider');

    pauseButton.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
    });

    resetButton.addEventListener('click', () => {
        startSimulation();
    });
    
    sparsenessSlider.addEventListener('input', (event) => {
        // Update the global sparseness variable
        sparseness = parseFloat(event.target.value);
    });
    
});
