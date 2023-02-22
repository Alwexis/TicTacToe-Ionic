export class Util {

    static checkWinner(board: string[][], player: string) {
        const winningPositions = [
            [[0, 0], [0, 1], [0, 2]],  // fila 1
            [[1, 0], [1, 1], [1, 2]],  // fila 2
            [[2, 0], [2, 1], [2, 2]],  // fila 3
            [[0, 0], [1, 0], [2, 0]],  // columna 1
            [[0, 1], [1, 1], [2, 1]],  // columna 2
            [[0, 2], [1, 2], [2, 2]],  // columna 3
            [[0, 0], [1, 1], [2, 2]],  // diagonal 1
            [[0, 2], [1, 1], [2, 0]]   // diagonal 2
        ];

        for (let position of winningPositions) {
            if (position.every(([i, j]) => board[i][j] === player)) {
                return true;
            }
        }

        return null;
    }

}
