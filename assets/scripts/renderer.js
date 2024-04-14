const Chart = require('chart.js/auto').Chart;

/*
Game of Life Simulation

2D infinite grid
Cells can be live or dead
Each cell interacts with eight neighbours

For each time step:
1. Any live cell with fewer than two live neighbours dies
2. Any live cell with two/three live neighbours lives
3. Any live cell with >3 live neighbours dies
4. Any dead cell with exactly 3 live neighbours becomes live

Must be a seed to begin.

*/

function createGrid(rows, cols) {

    // Create an grid of zeroes with rows and columns defined by rows, cols
    // Returns this empty grid

    const grid = new Array(rows);
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols).fill(0);
    }
    return grid;
}


function populateGrid(emptyGrid, sparseness = 0.5) {

    // Accepts empty (or populated) grid, and creates a new grid with randomly populated 0 or 1

    const populatedGrid = createGrid(emptyGrid.length, emptyGrid[0].length);

    for (let i = 0; i < populatedGrid.length; i++) {
        for (let j = 0; j < populatedGrid[i].length; j++) {
            populatedGrid[i][j] = Math.random() < sparseness ? 1 : 0;
        }
    }
    return populatedGrid;
}


function countNeighbours(populatedGrid) {

    // Accepts a populated grid, and counts number of neighbours per cell
    // Returns a new grid with neighbour count per cell

    const countedGrid = createGrid(populatedGrid.length, populatedGrid[0].length);

    for (let i = 0; i < populatedGrid.length; i++) {
        for (let j = 0; j < populatedGrid[0].length; j++) {
            let count = 0;

            for (let k = -1; k <= 1; k++) {
                for (let l = -1; l <= 1; l++) {
                    if (k === 0 && l === 0) continue;

                    const ni = (i + k + populatedGrid.length) % populatedGrid.length;
                    const nj = (j + l + populatedGrid[i].length) % populatedGrid[i].length;

                    count += populatedGrid[ni][nj];
                }
            }

            countedGrid[i][j] = count;
        }
    }

    return countedGrid;

}


function countPopulation(populatedGrid) {

    // Counts the entire population in the grid
    // Returns an integer

    let totalCount = 0;

    for (let i = 0; i < populatedGrid.length; i++) {
        for (let j = 0; j < populatedGrid[0].length; j++) {
            totalCount += populatedGrid[i][j];
        }
    }

    return totalCount;
}


function applyRules(populatedGrid, countedGrid) {

    /*
    Rules:
    for each cell c:
        if alive:
            1. c < 2:
                dies
            2. c == 2 or c == 3:
                lives
            3. c > 3:
                dies
        if dead:
            4. c == 3:
                lives

    */

    const newPopulatedGrid = createGrid(populatedGrid.length, populatedGrid[0].length);

    for (let i = 0; i < populatedGrid.length; i++) {
        for (let j = 0; j < populatedGrid[0].length; j++) {

            // Assume current cell dies unless rule keeps it alive
            let currentState = populatedGrid[i][j];
            let currentNeighbourCount = countedGrid[i][j];
            let newState = 0;

            if (currentState === 1) {
                // If alive, apply rules 1-3
                if (currentNeighbourCount < 2 || currentNeighbourCount > 3) {
                    // Die if c < 2 or c > 3
                    newState = 0;
                } else {
                    // Live if c == 2 or c == 3
                    newState = 1;
                }
            } else {
                // If dead, apply rule 4
                if (currentNeighbourCount === 3) {
                    newState = 1;
                }
            }

            newPopulatedGrid[i][j] = newState;
        }
    }

    return newPopulatedGrid;
}


function runGeneration() {

    // Keeps track of generation number as well as population count
    // Updates grid and applies rules to calculate new grid
    // Calls printGridToApp() which renders the population
    // Calls updateChart() to update the chart of population versus generation

    if (!isPaused) {

        let countedGrid = countNeighbours(populatedGrid);
        populatedGrid = applyRules(populatedGrid, countedGrid);

        let currentCellCount = countPopulation(populatedGrid);
        generationCount += 1;

        cellCounts.push(currentCellCount);
        generations.push(generationCount);

        printGridToApp(populatedGrid);
        updateChart(generations, cellCounts);
    }
}

function startSimulation(gridSizeX, gridSizeY, refreshRate) {

    // Creates a new grid with rows = gridSizeX, cols = gridSizeY
    // Prints initial grid to begin simulation
    // Runs simulation at desired refreshRate

    grid = createGrid(gridSizeY, gridSizeX);
    populatedGrid = populateGrid(grid, sparseness);

    printGridToApp(populatedGrid);
    intervalId = setInterval(runGeneration, 1000 / refreshRate);
}


function handleResetEvent() {

    generationCount = 0;
    generations.length = 0;
    cellCounts.length = 0;

    startSimulation(gridSizeX, gridSizeY, refreshRate);

}


function printGridToApp(grid) {

    // Renders grid as grid HTML element
    // Black if alive, white if dead

    gridContainer.innerHTML = '';
    const table = document.createElement('table');
    for (let i = 0; i < grid.length; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < grid[i].length; j++) {
            const td = document.createElement('td');
            td.style.width = '20px';
            td.style.height = '5px';
            td.style.backgroundColor = grid[i][j] === 1 ? 'black' : 'white';
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
}


function updateChart(generations, numberOfAliveCells) {
    const ctx = document.getElementById('aliveCellsChart').getContext('2d');

    console.log("func start");

    // Function to generate random RGB colors
    function getRandomColor() { // Make sure this function name is consistent
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }

    if (!window.populationChart) {
        console.log("init");
        // Construct the datasets using the alive cell counts
        const datasets = [{
            label: 'Number of Alive Cells',
            data: numberOfAliveCells,
            fill: false,
            borderColor: getRandomColor(),
            tension: 0.1
        }];

        // Construct the chart with the datasets and labels
        window.populationChart = new Chart(ctx, {
            type: 'line',
            data: {
                label: generations,
                datasets: datasets
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        });
    } else {
        // Update the chart's dataset with new data and labels
        window.populationChart.data.labels = generations;
        window.populationChart.data.datasets[0].data = numberOfAliveCells;
        window.populationChart.update();
    }
}


// Global Variables
let gridContainer;
let populatedGrid;
let sparseness = 0.5;
let isPaused = false;
let generationCount = 0;
let generations = [];
let cellCounts = [];

gridSizeX = 150;
gridSizeY = 25;
refreshRate = 10;

document.addEventListener('DOMContentLoaded', () => {
    gridContainer = document.getElementById('grid');
    startSimulation(gridSizeX, gridSizeY, refreshRate);
});