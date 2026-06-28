export interface User {
    id: number;
    email: string;
    is_active: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    paasword: string;
}

export interface AtuhResponse {
    access_token: string;
    token_type: string;
    user: User;
}