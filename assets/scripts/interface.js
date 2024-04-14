document.addEventListener('DOMContentLoaded', () => {
    /*
    Runs once the content has loaded
    Creates objects for the user inputs (buttons and sliders)
    Runs functions depending on which button is pressed
    */

    const pauseButton = document.getElementById('pauseBtn');
    const resetButton = document.getElementById('resetBtn');
    const sparsenessSlider = document.getElementById('sparsenessSlider');

    pauseButton.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
    });

    resetButton.addEventListener('click', () => {
        handleResetEvent();
    });
    
    sparsenessSlider.addEventListener('input', (event) => {
        sparseness = parseFloat(event.target.value);
    });
    
});
