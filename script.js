       document.addEventListener('DOMContentLoaded', function () {
    const equationInput = document.getElementById('equation');
    const x0Input = document.getElementById('x0');
    const y0Input = document.getElementById('y0');
    const hInput = document.getElementById('h');
    const stepsInput = document.getElementById('steps');
    const solveBtn = document.getElementById('solve-btn');
    const errorDiv = document.getElementById('error');
    const solutionDiv = document.getElementById('solution');
    const solutionBody = document.getElementById('solution-body');

    // Evaluate function safely
    function evaluateFunction(x, y, expr) {
        try {
            return new Function('x', 'y', `return (${expr})`)(x, y);
        } catch (e) {
            throw new Error("Invalid equation");
        }
    }

    // Solve differential equation using Modified Euler's method
    function solve() {
        try {
            const equation = equationInput.value;
            const x0 = parseFloat(x0Input.value);
            const y0 = parseFloat(y0Input.value);
            const h = parseFloat(hInput.value);
            const steps = parseInt(stepsInput.value);
            const modifications = parseInt(document.getElementById("m").value); // Get modification count

            if (isNaN(x0) || isNaN(y0) || isNaN(h) || isNaN(steps) || isNaN(modifications) || h <= 0 || steps < 1 || modifications < 1) {
                throw new Error("Invalid input parameters");
            }

            const solutions = [];
            let x = x0;
            let y = y0;

            solutions.push({
                x,
                y,
                slope1: evaluateFunction(x, y, equation),
                slope2: 0
            });

            for (let i = 0; i < steps; i++) {
                let yNew = y;

                for (let modCount = 0; modCount < modifications; modCount++) { // Apply modifications
                    const k1 = evaluateFunction(x, yNew, equation);
                    const yPred = yNew + h * k1;
                    const k2 = evaluateFunction(x + h, yPred, equation);

                    let yNext = y + (h / 2) * (k1 + k2); // Compute next step

                    // Stop early if modification converges
                    if (Math.abs(yNext - yNew) < 1e-6) break;

                    yNew = yNext; // Update yNew for next modification
                }

                y = yNew;
                x = x + h; // Move to the next step

                solutions.push({
                    x,
                    y,
                    slope1: evaluateFunction(x, y, equation),
                    slope2: evaluateFunction(x, yNew, equation)
                });
            }

            displaySolution(solutions);
            errorDiv.style.display = 'none';
        } catch (e) {
            errorDiv.textContent = "Error solving equation. Please check your input.";
            errorDiv.style.display = 'block';
            solutionDiv.style.display = 'none';
        }
    }

    // Display solution in table
    function displaySolution(solutions) {
        solutionBody.innerHTML = '';

        solutions.forEach((point, index) => {
            const row = document.createElement('tr');

            const stepCell = document.createElement('td');
            stepCell.textContent = index;

            const xCell = document.createElement('td');
            xCell.textContent = point.x.toFixed(4);

            const yCell = document.createElement('td');
            yCell.textContent = point.y.toFixed(4);

            const k1Cell = document.createElement('td');
            k1Cell.textContent = point.slope1.toFixed(4);

            const k2Cell = document.createElement('td');
            k2Cell.textContent = point.slope2.toFixed(4);

            row.appendChild(stepCell);
            row.appendChild(xCell);
            row.appendChild(yCell);
            row.appendChild(k1Cell);
            row.appendChild(k2Cell);

            solutionBody.appendChild(row);
        });

        solutionDiv.style.display = 'block';
    }

    // Event listeners
    solveBtn.addEventListener('click', solve);
});
