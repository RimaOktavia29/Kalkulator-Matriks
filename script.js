// Matrix Calculator JavaScript
class MatrixCalculator {
    constructor() {
        this.matrixA = [];
        this.matrixB = [];
        this.initializeEventListeners();
        this.generateMatrices(); // Generate initial matrices
    }

    initializeEventListeners() {
        // Matrix generation
        document.getElementById('generateMatrices').addEventListener('click', () => this.generateMatrices());
        
        // Matrix controls
        document.getElementById('randomA').addEventListener('click', () => this.randomizeMatrix('A'));
        document.getElementById('randomB').addEventListener('click', () => this.randomizeMatrix('B'));
        document.getElementById('zeroA').addEventListener('click', () => this.clearMatrix('A'));
        document.getElementById('zeroB').addEventListener('click', () => this.clearMatrix('B'));
        document.getElementById('identityA').addEventListener('click', () => this.identityMatrix('A'));
        document.getElementById('identityB').addEventListener('click', () => this.identityMatrix('B'));

        // Operations
        document.getElementById('add').addEventListener('click', () => this.addMatrices());
        document.getElementById('subtract').addEventListener('click', () => this.subtractMatrices());
        document.getElementById('multiply').addEventListener('click', () => this.multiplyMatrices());
        document.getElementById('transpose').addEventListener('click', () => this.transposeMatrix());
        document.getElementById('determinant').addEventListener('click', () => this.calculateDeterminant());
        document.getElementById('inverse').addEventListener('click', () => this.calculateInverse());
        document.getElementById('scalarMultiply').addEventListener('click', () => this.showScalarInput());
        document.getElementById('power').addEventListener('click', () => this.showPowerInput());

        // Scalar operations
        document.getElementById('applyScalar').addEventListener('click', () => this.applyScalarMultiplication());
        document.getElementById('cancelScalar').addEventListener('click', () => this.hideScalarInput());

        // Power operations
        document.getElementById('applyPower').addEventListener('click', () => this.applyPowerOperation());
        document.getElementById('cancelPower').addEventListener('click', () => this.hidePowerInput());

        // Clear result
        document.getElementById('clearResult').addEventListener('click', () => this.clearResult());
    }

    generateMatrices() {
        const rowsA = parseInt(document.getElementById('rowsA').value);
        const colsA = parseInt(document.getElementById('colsA').value);
        const rowsB = parseInt(document.getElementById('rowsB').value);
        const colsB = parseInt(document.getElementById('colsB').value);

        this.createMatrixInput('matrixA', rowsA, colsA);
        this.createMatrixInput('matrixB', rowsB, colsB);
        
        this.matrixA = this.createEmptyMatrix(rowsA, colsA);
        this.matrixB = this.createEmptyMatrix(rowsB, colsB);
    }

    createMatrixInput(containerId, rows, cols) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const input = document.createElement('input');
                input.type = 'number';
                input.className = 'matrix-input';
                input.step = '0.1';
                input.value = '0';
                input.id = `${containerId}_${i}_${j}`;
                input.addEventListener('input', () => this.updateMatrix(containerId, i, j, input.value));
                container.appendChild(input);
            }
        }
    }

    createEmptyMatrix(rows, cols) {
        return Array(rows).fill().map(() => Array(cols).fill(0));
    }

    updateMatrix(matrixId, row, col, value) {
        const numValue = parseFloat(value) || 0;
        if (matrixId === 'matrixA') {
            this.matrixA[row][col] = numValue;
        } else if (matrixId === 'matrixB') {
            this.matrixB[row][col] = numValue;
        }
    }

    getMatrixFromInputs(matrixId) {
        const rows = matrixId === 'matrixA' ? 
            parseInt(document.getElementById('rowsA').value) : 
            parseInt(document.getElementById('rowsB').value);
        const cols = matrixId === 'matrixA' ? 
            parseInt(document.getElementById('colsA').value) : 
            parseInt(document.getElementById('colsB').value);
        
        const matrix = [];
        for (let i = 0; i < rows; i++) {
            matrix[i] = [];
            for (let j = 0; j < cols; j++) {
                const input = document.getElementById(`${matrixId}_${i}_${j}`);
                matrix[i][j] = parseFloat(input.value) || 0;
            }
        }
        return matrix;
    }

    randomizeMatrix(matrixType) {
        const matrixId = `matrix${matrixType}`;
        const rows = matrixType === 'A' ? 
            parseInt(document.getElementById('rowsA').value) : 
            parseInt(document.getElementById('rowsB').value);
        const cols = matrixType === 'A' ? 
            parseInt(document.getElementById('colsA').value) : 
            parseInt(document.getElementById('colsB').value);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const randomValue = Math.floor(Math.random() * 21) - 10; // Random between -10 and 10
                const input = document.getElementById(`${matrixId}_${i}_${j}`);
                input.value = randomValue;
                this.updateMatrix(matrixId, i, j, randomValue);
            }
        }
    }

    clearMatrix(matrixType) {
        const matrixId = `matrix${matrixType}`;
        const rows = matrixType === 'A' ? 
            parseInt(document.getElementById('rowsA').value) : 
            parseInt(document.getElementById('rowsB').value);
        const cols = matrixType === 'A' ? 
            parseInt(document.getElementById('colsA').value) : 
            parseInt(document.getElementById('colsB').value);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const input = document.getElementById(`${matrixId}_${i}_${j}`);
                input.value = '0';
                this.updateMatrix(matrixId, i, j, 0);
            }
        }
    }

    identityMatrix(matrixType) {
        const matrixId = `matrix${matrixType}`;
        const rows = matrixType === 'A' ? 
            parseInt(document.getElementById('rowsA').value) : 
            parseInt(document.getElementById('rowsB').value);
        const cols = matrixType === 'A' ? 
            parseInt(document.getElementById('colsA').value) : 
            parseInt(document.getElementById('colsB').value);

        if (rows !== cols) {
            this.displayError('Matriks identitas harus berukuran persegi (n×n)');
            return;
        }

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const value = i === j ? 1 : 0;
                const input = document.getElementById(`${matrixId}_${i}_${j}`);
                input.value = value;
                this.updateMatrix(matrixId, i, j, value);
            }
        }
    }

    addMatrices() {
        const matrixA = this.getMatrixFromInputs('matrixA');
        const matrixB = this.getMatrixFromInputs('matrixB');

        if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
            this.displayError('Ukuran matriks harus sama untuk operasi penjumlahan');
            return;
        }

        const result = matrixA.map((row, i) => 
            row.map((val, j) => val + matrixB[i][j])
        );

        this.displayResult('Hasil Penjumlahan A + B', result);
    }

    subtractMatrices() {
        const matrixA = this.getMatrixFromInputs('matrixA');
        const matrixB = this.getMatrixFromInputs('matrixB');

        if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
            this.displayError('Ukuran matriks harus sama untuk operasi pengurangan');
            return;
        }

        const result = matrixA.map((row, i) => 
            row.map((val, j) => val - matrixB[i][j])
        );

        this.displayResult('Hasil Pengurangan A - B', result);
    }

    multiplyMatrices() {
        const matrixA = this.getMatrixFromInputs('matrixA');
        const matrixB = this.getMatrixFromInputs('matrixB');

        if (matrixA[0].length !== matrixB.length) {
            this.displayError('Jumlah kolom matriks A harus sama dengan jumlah baris matriks B untuk perkalian');
            return;
        }

        const result = [];
        for (let i = 0; i < matrixA.length; i++) {
            result[i] = [];
            for (let j = 0; j < matrixB[0].length; j++) {
                let sum = 0;
                for (let k = 0; k < matrixB.length; k++) {
                    sum += matrixA[i][k] * matrixB[k][j];
                }
                result[i][j] = sum;
            }
        }

        this.displayResult('Hasil Perkalian A × B', result);
    }

    transposeMatrix() {
        const matrixA = this.getMatrixFromInputs('matrixA');
        const result = matrixA[0].map((_, colIndex) => matrixA.map(row => row[colIndex]));
        this.displayResult('Hasil Transpose A^T', result);
    }

    calculateDeterminant() {
        const matrixA = this.getMatrixFromInputs('matrixA');
        
        if (matrixA.length !== matrixA[0].length) {
            this.displayError('Determinan hanya dapat dihitung untuk matriks persegi');
            return;
        }

        const det = this.determinant(matrixA);
        this.displayResult('Determinan Matriks A', null, `det(A) = ${det.toFixed(4)}`);
    }

    determinant(matrix) {
        const n = matrix.length;
        
        if (n === 1) {
            return matrix[0][0];
        }
        
        if (n === 2) {
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        }
        
        // Gaussian elimination method for larger matrices
        const mat = matrix.map(row => [...row]); // Create copy
        let det = 1;
        
        for (let i = 0; i < n; i++) {
            // Find pivot
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(mat[k][i]) > Math.abs(mat[maxRow][i])) {
                    maxRow = k;
                }
            }
            
            // Swap rows if needed
            if (maxRow !== i) {
                [mat[i], mat[maxRow]] = [mat[maxRow], mat[i]];
                det *= -1;
            }
            
            // If diagonal element is 0, determinant is 0
            if (Math.abs(mat[i][i]) < 1e-10) {
                return 0;
            }
            
            det *= mat[i][i];
            
            // Eliminate column
            for (let k = i + 1; k < n; k++) {
                const factor = mat[k][i] / mat[i][i];
                for (let j = i; j < n; j++) {
                    mat[k][j] -= factor * mat[i][j];
                }
            }
        }
        
        return det;
    }

    calculateInverse() {
        const matrixA = this.getMatrixFromInputs('matrixA');
        
        if (matrixA.length !== matrixA[0].length) {
            this.displayError('Invers hanya dapat dihitung untuk matriks persegi');
            return;
        }

        const det = this.determinant(matrixA);
        if (Math.abs(det) < 1e-10) {
            this.displayError('Matriks singular (determinan = 0), tidak memiliki invers');
            return;
        }

        const inverse = this.inverse(matrixA);
        this.displayResult('Invers Matriks A^(-1)', inverse);
    }

    inverse(matrix) {
        const n = matrix.length;
        
        // Special case for 2x2 matrix
        if (n === 2) {
            const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
            return [
                [matrix[1][1] / det, -matrix[0][1] / det],
                [-matrix[1][0] / det, matrix[0][0] / det]
            ];
        }
        
        // Gauss-Jordan elimination for larger matrices
        const augmented = [];
        for (let i = 0; i < n; i++) {
            augmented[i] = [...matrix[i], ...Array(n).fill(0)];
            augmented[i][n + i] = 1; // Identity matrix on the right
        }
        
        // Forward elimination
        for (let i = 0; i < n; i++) {
            // Find pivot
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
                    maxRow = k;
                }
            }
            
            // Swap rows
            if (maxRow !== i) {
                [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
            }
            
            // Make diagonal element 1
            const pivot = augmented[i][i];
            for (let j = 0; j < 2 * n; j++) {
                augmented[i][j] /= pivot;
            }
            
            // Eliminate column
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    const factor = augmented[k][i];
                    for (let j = 0; j < 2 * n; j++) {
                        augmented[k][j] -= factor * augmented[i][j];
                    }
                }
            }
        }
        
        // Extract inverse matrix
        const result = [];
        for (let i = 0; i < n; i++) {
            result[i] = augmented[i].slice(n);
        }
        
        return result;
    }

    showScalarInput() {
        document.getElementById('scalarInput').style.display = 'block';
    }

    hideScalarInput() {
        document.getElementById('scalarInput').style.display = 'none';
    }

    applyScalarMultiplication() {
        const scalar = parseFloat(document.getElementById('scalarValue').value) || 0;
        const matrixA = this.getMatrixFromInputs('matrixA');
        
        const result = matrixA.map(row => row.map(val => val * scalar));
        
        this.displayResult(`Hasil Perkalian Skalar ${scalar} × A`, result);
        this.hideScalarInput();
    }

    showPowerInput() {
        const matrixA = this.getMatrixFromInputs('matrixA');
        
        if (matrixA.length !== matrixA[0].length) {
            this.displayError('Operasi pangkat hanya dapat dilakukan pada matriks persegi');
            return;
        }
        
        document.getElementById('powerInput').style.display = 'block';
    }

    hidePowerInput() {
        document.getElementById('powerInput').style.display = 'none';
    }

    applyPowerOperation() {
        const power = parseInt(document.getElementById('powerValue').value) || 0;
        const matrixA = this.getMatrixFromInputs('matrixA');
        
        if (power < 0) {
            this.displayError('Pangkat negatif belum didukung');
            this.hidePowerInput();
            return;
        }
        
        if (power === 0) {
            // A^0 = Identity matrix
            const n = matrixA.length;
            const result = Array(n).fill().map((_, i) => 
                Array(n).fill().map((_, j) => i === j ? 1 : 0)
            );
            this.displayResult(`Hasil A^${power} (Matriks Identitas)`, result);
        } else if (power === 1) {
            this.displayResult(`Hasil A^${power}`, matrixA);
        } else {
            const result = this.matrixPower(matrixA, power);
            this.displayResult(`Hasil A^${power}`, result);
        }
        
        this.hidePowerInput();
    }

    matrixPower(matrix, power) {
        let result = matrix.map(row => [...row]); // Copy matrix
        
        for (let i = 1; i < power; i++) {
            result = this.multiplyTwoMatrices(result, matrix);
        }
        
        return result;
    }

    multiplyTwoMatrices(matrixA, matrixB) {
        const result = [];
        for (let i = 0; i < matrixA.length; i++) {
            result[i] = [];
            for (let j = 0; j < matrixB[0].length; j++) {
                let sum = 0;
                for (let k = 0; k < matrixB.length; k++) {
                    sum += matrixA[i][k] * matrixB[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result;
    }

    displayResult(title, matrix = null, text = null) {
        const resultDiv = document.getElementById('result');
        
        let html = `<div class="result-text">${title}</div>`;
        
        if (text) {
            html += `<div class="result-text">${text}</div>`;
        }
        
        if (matrix) {
            html += '<div class="result-matrix" style="grid-template-columns: repeat(' + matrix[0].length + ', 1fr);">';
            
            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < matrix[i].length; j++) {
                    const value = typeof matrix[i][j] === 'number' ? 
                        matrix[i][j].toFixed(3).replace(/\.?0+$/, '') : 
                        matrix[i][j];
                    html += `<div class="result-cell">${value}</div>`;
                }
            }
            
            html += '</div>';
        }
        
        resultDiv.innerHTML = html;
    }

    displayError(message) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `<div class="error-message">❌ Error: ${message}</div>`;
    }

    clearResult() {
        document.getElementById('result').innerHTML = '';
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MatrixCalculator();
});

// Add some helper functions for better user experience
document.addEventListener('keydown', (e) => {
    // Allow Enter key to move to next input in matrix
    if (e.key === 'Enter' && e.target.classList.contains('matrix-input')) {
        const inputs = Array.from(document.querySelectorAll('.matrix-input'));
        const currentIndex = inputs.indexOf(e.target);
        const nextInput = inputs[currentIndex + 1];
        if (nextInput) {
            nextInput.focus();
            nextInput.select();
        }
    }
    
    // Allow Escape key to clear focus
    if (e.key === 'Escape') {
        document.activeElement.blur();
    }
});

// Add input validation
document.addEventListener('input', (e) => {
    if (e.target.classList.contains('matrix-input')) {
        const value = e.target.value;
        // Allow negative numbers, decimals, and empty values
        if (value !== '' && isNaN(parseFloat(value))) {
            e.target.style.borderColor = '#dc3545';
            e.target.style.backgroundColor = '#f8d7da';
        } else {
            e.target.style.borderColor = '#ff99cc';
            e.target.style.backgroundColor = 'white';
        }
    }
});

// Add tooltips for better user experience
const tooltips = {
    'generateMatrices': 'Buat ulang matriks dengan ukuran yang dipilih',
    'randomA': 'Isi matriks A dengan angka acak (-10 sampai 10)',
    'randomB': 'Isi matriks B dengan angka acak (-10 sampai 10)',
    'zeroA': 'Kosongkan semua elemen matriks A (isi dengan 0)',
    'zeroB': 'Kosongkan semua elemen matriks B (isi dengan 0)',
    'identityA': 'Buat matriks A menjadi matriks identitas (harus persegi)',
    'identityB': 'Buat matriks B menjadi matriks identitas (harus persegi)',
    'add': 'Jumlahkan matriks A dan B (ukuran harus sama)',
    'subtract': 'Kurangkan matriks A dan B (ukuran harus sama)',
    'multiply': 'Kalikan matriks A dengan B (kolom A = baris B)',
    'transpose': 'Transpose matriks A (tukar baris dan kolom)',
    'determinant': 'Hitung determinan matriks A (harus persegi)',
    'inverse': 'Hitung invers matriks A (harus persegi dan det ≠ 0)',
    'scalarMultiply': 'Kalikan matriks A dengan skalar (angka)',
    'power': 'Pangkatkan matriks A (harus persegi)'
};

// Add title attributes for tooltips
document.addEventListener('DOMContentLoaded', () => {
    Object.keys(tooltips).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.title = tooltips[id];
        }
    });
});