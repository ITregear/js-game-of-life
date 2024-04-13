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


function populateGrid(emptyGrid) {

    // Accepts empty (or populated) grid, and creates a new grid with randomly populated 0 or 1
    
    const populatedGrid = createGrid(emptyGrid.length, emptyGrid[0].length);

    for (let i = 0; i < populatedGrid.length; i++) {
        for (let j = 0; j < populatedGrid[i].length; j++) {
            populatedGrid[i][j] = Math.floor(Math.random() * 2); 
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


function main() {

    const grid = createGrid(10, 10);
    const populatedGrid = populateGrid(grid);
    const countedGrid = countNeighbours(populatedGrid);
    const newPopulatedGrid = applyRules(populatedGrid, countedGrid);

    console.log(grid);
    console.log("");
    console.log(populatedGrid);
    console.log("");
    console.log(countedGrid);
    console.log("");
    console.log(newPopulatedGrid);


}

if (require.main === module) {
    main();
}
