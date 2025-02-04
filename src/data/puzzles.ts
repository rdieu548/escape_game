interface PuzzleRequirement {
    itemId?: string;
    puzzleId?: number;
}

interface PuzzleReward {
    item?: string;
    score: number;
}

interface Puzzle {
    id: number;
    scenarioId: string;
    orderIndex: number;
    title: string;
    description: string;
    type: 'code' | 'combination' | 'riddle' | 'item_use';
    solution: string;
    hints: string[];
    requirements?: PuzzleRequirement[];
    reward: PuzzleReward;
    unlocks?: number[];  // IDs des puzzles débloqués
}

const puzzles: Puzzle[] = [
    {
        id: 1,
        scenarioId: 'lab-escape',
        orderIndex: 1,
        type: 'code',
        title: 'Code du casier',
        description: 'Le casier semble contenir quelque chose d\'important. Un code à 4 chiffres le protège.',
        solution: '1234',
        hints: ['Regardez les post-its sur le bureau', 'La date de création du laboratoire ?'],
        reward: {
            item: 'Clé USB',
            score: 100
        },
        unlocks: [2]
    },
    {
        id: 2,
        scenarioId: 'lab-escape',
        orderIndex: 2,
        type: 'item_use',
        title: 'Ordinateur verrouillé',
        description: 'L\'ordinateur nécessite une clé USB pour démarrer.',
        solution: 'Clé USB',
        hints: ['Cherchez un moyen de démarrer l\'ordinateur'],
        requirements: [{ itemId: 'Clé USB' }],
        reward: {
            score: 150
        },
        unlocks: [3]
    }
];

export function getPuzzles(scenarioId: string): Puzzle[] {
    return puzzles.filter(p => p.scenarioId === scenarioId)
                 .sort((a, b) => a.orderIndex - b.orderIndex);
}

export function checkSolution(puzzleId: number, answer: string, inventory: string[]): boolean {
    const puzzle = puzzles.find(p => p.id === puzzleId);
    if (!puzzle) return false;

    // Vérifie les prérequis
    if (puzzle.requirements) {
        for (const req of puzzle.requirements) {
            if (req.itemId && !inventory.includes(req.itemId)) return false;
        }
    }

    // Vérifie la solution selon le type
    switch (puzzle.type) {
        case 'code':
            return puzzle.solution.toLowerCase() === answer.toLowerCase();
        case 'item_use':
            return puzzle.solution === answer;
        default:
            return false;
    }
}

export function getAvailablePuzzles(scenarioId: string, solvedPuzzles: number[], inventory: string[]): Puzzle[] {
    return puzzles
        .filter(p => p.scenarioId === scenarioId)
        .filter(p => {
            // Vérifie si le puzzle est débloqué
            const isUnlocked = !puzzles.some(otherPuzzle => 
                otherPuzzle.unlocks?.includes(p.id) && !solvedPuzzles.includes(otherPuzzle.id)
            );

            // Vérifie si les prérequis sont remplis
            const hasRequirements = !p.requirements || p.requirements.every(req => 
                req.itemId ? inventory.includes(req.itemId) : true
            );

            return isUnlocked && hasRequirements;
        })
        .sort((a, b) => a.orderIndex - b.orderIndex);
} 