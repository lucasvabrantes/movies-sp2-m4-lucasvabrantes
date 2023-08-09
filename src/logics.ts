import { Request, Response } from "express";
import { MovieCreate } from "./interfaces";
import format from "pg-format";
import { QueryResult } from "pg";
import { client } from "./database";

const registerMovie = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const queryString: string = format(
        `INSERT INTO movies (%I) VALUES (%L) RETURNING *`,
        Object.keys(req.body),
        Object.values(req.body)
    );

    const queryResult: QueryResult = await client.query(queryString);

    return res.status(201).json(queryResult.rows[0]);
};

const readMovies = async (req: Request, res: Response): Promise<Response> => {
    const queryResultCategory: QueryResult = await client.query(
        `SELECT * FROM movies WHERE category = $1;`,
        [req.query.category]
    );

    if (queryResultCategory.rowCount > 0) {
        return res.status(200).json(queryResultCategory.rows);
    }

    const queryStringAll: string = `SELECT * FROM movies;`;
    const queryResultAll: QueryResult = await client.query(queryStringAll);

    return res.status(200).json(queryResultAll.rows);
};

const readMovieById = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const { foundMovie } = res.locals;

    return res.status(200).json(foundMovie);
};

const updateMovie = async (req: Request, res: Response): Promise<Response> => {
    const updateQueryFormat: string = format(
        `UPDATE movies SET (%I) = ROW(%L) WHERE "id" = $1 RETURNING *;`,
        Object.keys(req.body),
        Object.values(req.body)
    );

    const queryResult: QueryResult = await client.query(updateQueryFormat, [
        req.params.id,
    ]);

    return res.status(200).json(queryResult.rows[0]);
};

const deleteMovie = async (req: Request, res: Response): Promise<Response> => {
    await client.query(`DELETE FROM movies WHERE "id" = $1 RETURNING *;`, [
        req.params.id,
    ]);

    return res.status(204).json();
};
export default {
    registerMovie,
    readMovies,
    readMovieById,
    updateMovie,
    deleteMovie,
};
