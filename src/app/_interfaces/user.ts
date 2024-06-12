import { Gender } from "./gender";

export interface User {
    id: number;
    rut: string;
    name: string;
    birthdate: string;
    email: string;
    isActive: boolean;
    gender: Gender;

}
