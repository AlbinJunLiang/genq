import { QuizApiResponse, QuizDetail } from "../../interfaces/quiz-interface";

export const INITIAL_QUIZ_MOCK: QuizApiResponse = {
    quiz: {
        id: 42,
        uuid: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        title: "Fundamentos de Computación y Ciberseguridad",
        description: "Evaluación sobre arquitectura de sistemas, memoria y conceptos básicos de ciberseguridad.",
        visibility: "PUBLIC",
        endAt: "2026-07-15T14:30:00.000Z",
        durationSeconds: 1800,
        attemptsLimit: 2,
        userId: 12,
        createdAt: "2026-06-20T10:00:00.000Z",
        questions: [
            // Pregunta 1
            {
                id: 101,
                content: "¿Qué componente es el responsable de realizar cálculos aritméticos y lógicos en la CPU?",
                type: "UNIQUE",
                status: "ACTIVE",
                quizId: 42,
                answers: [
                    { id: 1, content: "Unidad de Control", status: "ACTIVE", questionId: 101 },
                    { id: 2, content: "ALU (Unidad Aritmético Lógica)", status: "ACTIVE", questionId: 101 },
                    { id: 3, content: "Registro de instrucción", status: "ACTIVE", questionId: 101 },
                    { id: 4, content: "Bus de datos", status: "ACTIVE", questionId: 101 }
                ]
            },
            // Pregunta 2
            {
                id: 102,
                content: "¿Qué tipo de memoria es la más cercana al procesador en la jerarquía de memoria?",
                type: "UNIQUE",
                status: "ACTIVE",
                quizId: 42,
                answers: [
                    { id: 5, content: "Memoria Caché", status: "ACTIVE", questionId: 102 },
                    { id: 6, content: "Memoria RAM", status: "ACTIVE", questionId: 102 },
                    { id: 7, content: "Disco Duro", status: "ACTIVE", questionId: 102 },
                    { id: 8, content: "Memoria SSD", status: "ACTIVE", questionId: 102 }
                ]
            },
            // Pregunta 3
            {
                id: 103,
                content: "¿Cuáles de los siguientes son tipos de ataques informáticos? (Seleccione todas las que correspondan)",
                type: "MULTIPLE",
                status: "ACTIVE",
                quizId: 42,
                answers: [
                    { id: 9, content: "Phishing", status: "ACTIVE", questionId: 103 },
                    { id: 10, content: "Malware", status: "ACTIVE", questionId: 103 },
                    { id: 11, content: "Firewall", status: "ACTIVE", questionId: 103 },
                    { id: 12, content: "DDoS", status: "ACTIVE", questionId: 103 }
                ]
            }
        ]
    },
    attemptUuid: 'fdccb991-b8bd-4d12-bd1c-7r3619765ddd'
};