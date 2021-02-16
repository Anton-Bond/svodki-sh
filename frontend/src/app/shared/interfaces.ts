export interface User {
    email: string
    password: string
    name?: string
    role?: string
    userId?: string
}

export interface Message {
    type: string
    text: string
}
