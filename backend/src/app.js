import express from 'express';
import userRoutes from './routes/user.routes.js';
import quizRouter from './routes/quiz.routes.js';
import { env } from './config/env.js';
import questionRouter from './routes/question.routes.js';
import answerRouter from './routes/answer.routes.js';
import cors from "cors";
import attemptRouter from './routes/attempt.routes.js';
import completionRouter from './routes/completion.routes.js';
import modelRouter from './routes/model.routes.js';


const app = express();
const apiVersion = 'v1';

// Middlewares básicos
app.use(express.json());



app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"] // Asegúrate de incluir Authorization
}));


app.use(express.urlencoded({ extended: true }));

// Rutas
app.use(`/api/${apiVersion}/users`, userRoutes);
app.use(`/api/${apiVersion}/quizzes`, quizRouter);
app.use(`/api/${apiVersion}/questions`, questionRouter);
app.use(`/api/${apiVersion}/answers`, answerRouter);
app.use(`/api/${apiVersion}/attempts`, attemptRouter);
app.use(`/api/${apiVersion}/completions`, completionRouter);
app.use(`/api/${apiVersion}/models`, modelRouter);






if (env.ENVIRONMENT === "development") {
    const swaggerUi = await import("swagger-ui-express");
    const swaggerSpec = await import("./config/swagger.js");

    app.use(
        "/api/docs",
        swaggerUi.default.serve,
        swaggerUi.default.setup(swaggerSpec.default)
    );
}

// Manejo de ruta 404
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));

export default app;