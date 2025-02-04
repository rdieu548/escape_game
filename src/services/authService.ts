import type { User } from '@/types/game';

function createUser(username: string): User {
    return {
        id: Date.now().toString(),
        username,
        highScores: {},
        savedGames: []
    };
}

function getUserFromStorage(username: string): User | null {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    return users[username] || null;
}

export const authService = {
    currentUser: null as User | null,

    login(username: string): User {
        // Simule une connexion
        let user = getUserFromStorage(username);
        if (!user) {
            user = createUser(username);
        }
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    },

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    },

    getCurrentUser(): User | null {
        if (this.currentUser) return this.currentUser;
        const saved = localStorage.getItem('currentUser');
        if (saved) {
            this.currentUser = JSON.parse(saved);
            return this.currentUser;
        }
        return null;
    },

    saveUser(user: User) {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        users[user.username] = user;
        localStorage.setItem('users', JSON.stringify(users));
        if (this.currentUser?.id === user.id) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
    }
}; 