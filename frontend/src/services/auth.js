const AUTH_TOKEN_KEY = 'token';

export const auth = {
    login: (token) => {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    },
    
    logout: () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
    },
    
    isAuthenticated: () => {
        return !!localStorage.getItem(AUTH_TOKEN_KEY);
    },
    
    getToken: () => {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    }
}; 