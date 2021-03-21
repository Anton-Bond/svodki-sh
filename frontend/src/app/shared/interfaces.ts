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

export interface Svtable {
    svtableDate: string
    name: string
    exth: any[]
    cols: any[]
    rows: any[]
    svtableId?: string
}
