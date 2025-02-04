import type { Scenario } from '@/types/game';

export const scenarios: Scenario[] = [
    {
        id: 'lab-escape',
        name: 'Évasion du Laboratoire',
        description: 'Échappez-vous d\'un laboratoire secret avant que le virus ne se propage!',
        difficulty: 'medium',
        timeLimit: 3600,
        image: '/images/lab.jpg'
    },
    {
        id: 'haunted-mansion',
        name: 'Le Manoir Hanté',
        description: 'Explorez un manoir abandonné et découvrez ses secrets...',
        difficulty: 'hard',
        timeLimit: 4800,
        image: '/images/mansion.jpg'
    }
];

export function getScenarios(): Scenario[] {
    return scenarios;
}

export function getScenario(id: string): Scenario | undefined {
    return scenarios.find(s => s.id === id);
} 