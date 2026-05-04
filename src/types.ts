export interface User {
    id: string;
    name: string;
    email: string;
}

export type workState = 'TO_DO' | 'IN_PROGRESS' | 'DONE';

export interface Work {
    title: string;
    manager: User;
    state: workState;
}