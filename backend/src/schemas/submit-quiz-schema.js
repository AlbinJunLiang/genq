import { z } from "zod";

export const submitQuizSchema = z
    .object({
        quizId: z.number().int().positive(),

        attemptUuid: z.string().uuid(),

        answers: z
            .array(
                z.object({
                    questionId: z.number().int().positive(),

                    answerIds: z
                        .array(z.number().int().positive())
                        .min(1, "You must select at least one answer."),
                })
            )
            .min(1, "You must answer at least one question."),
    })
    .superRefine((data, ctx) => {
        const questionIds = data.answers.map(a => a.questionId);

        if (new Set(questionIds).size !== questionIds.length) {
            ctx.addIssue({
                code: "custom",
                path: ["answers"],
                message: "Duplicate questions are not allowed.",
            });
        }
    });


/**
 * @schema
 * {
  "quizId": 1,
  "attemptId": "550e8400-e29b-41d4-a716-446655440000",
  "answers": [
    {
      "questionId": 1,
      "answerIds": [4]
    },
    {
      "questionId": 2,
      "answerIds": [7, 8]
    }
  ]
}
 */