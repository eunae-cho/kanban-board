export interface IUser {
    idx: number;    //PRIMARY KEY
    name: string;
    email: string;
    password: string;
}

export type workState = 'TO_DO' | 'IN_PROGRESS' | 'DONE';

export interface IWork {
    no: string, //work 고유번호
    title: string;
    manager: IUser;
    state: workState;
}

