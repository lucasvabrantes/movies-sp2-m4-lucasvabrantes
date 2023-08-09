import "dotenv/config";
import express, { Application, json } from "express";
import { startDatabase } from "./database";
import logics from "./logics";
import middlewares from "./middlewares";

const app: Application = express();
app.use(json());

app.get("/movies", logics.readMovies);
app.post("/movies", middlewares.verifyEqualNameExists, logics.registerMovie);

app.use("/movies/:id", middlewares.verifyMovieExists);

app.get("/movies/:id", logics.readMovieById);
app.patch("/movies/:id", middlewares.verifyEqualNameExists, logics.updateMovie);
app.delete("/movies/:id", logics.deleteMovie);

const PORT: number = 3000;
app.listen(PORT, async (): Promise<void> => {
    await startDatabase();
    console.log(`App is running on port ${PORT}`);
});
