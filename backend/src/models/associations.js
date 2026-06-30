import { User } from "./user.model.js";
import { Quiz } from "./quiz.model.js";
import QuizAttempt from "./quiz-attempt.model.js";
import Question from "./question.model.js";
import Answer from "./answer.model.js";

// Relaciones User
User.hasMany(Quiz, { foreignKey: 'user_id', as: 'quizzes' });
User.hasMany(QuizAttempt, { foreignKey: 'user_id', as: 'userAttempts' });

// Relaciones Quiz
Quiz.belongsTo(User, { foreignKey: 'user_id', as: 'creator' }); // Cambiado alias a 'creator' para evitar confusión con el usuario del intento
Quiz.hasMany(Question, { foreignKey: 'quiz_id', as: 'questions' });
Quiz.hasMany(QuizAttempt, { foreignKey: 'quiz_id', as: 'quizAttempts' });

// Relaciones QuizAttempt
QuizAttempt.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
QuizAttempt.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });

// Relaciones Question
Question.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });
Question.hasMany(Answer, { foreignKey: 'question_id', as: 'answers' });

// Relaciones Answer
Answer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

export { User, Quiz, QuizAttempt, Question, Answer };