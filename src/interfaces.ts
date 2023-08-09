import { QueryResult } from "pg";

export type Movie = {
    id: number;
    name: string;
    category: string;
    duration: number;
    price: number;
};

export type MovieCreate = Omit<Movie, "id">;
export type MovieResult = QueryResult<Movie>;
