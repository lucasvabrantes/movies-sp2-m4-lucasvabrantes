import { NextFunction, Request, Response } from "express";
import { QueryResult } from "pg";
import { client } from "./database";

const verifyEqualNameExists = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const queryResultName: QueryResult = await client.query(
        `
    SELECT * FROM movies WHERE name = $1;`,
        [req.body.name]
    );

    if (queryResultName.rowCount > 0) {
        const message = "Movie name already exists!";
        return res.status(409).json({ message });
    }

    return next();
};

const verifyMovieExists = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    const queryResultId: QueryResult = await client.query(
        `
    SELECT * FROM movies WHERE "id" = $1;`,
        [req.params.id]
    );

    if (!queryResultId.rows.length) {
        const message = "Movie not found!";
        return res.status(404).json({ message });
    }

    res.locals.foundMovie = queryResultId.rows[0];

    return next();
};

export default { verifyEqualNameExists, verifyMovieExists };
