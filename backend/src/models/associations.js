import { User } from "./user.model.js";
import { Quiz } from "./quiz.model.js";
import QuizAttempt from "./quiz-attempt.model.js";
import Question from "./question.model.js";
import Answer from "./answer.model.js";

// User -> Quiz
User.hasMany(Quiz, { foreignKey: 'user_id', as: 'quizzes' });
Quiz.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User -> QuizAttempt
User.hasMany(QuizAttempt, { foreignKey: 'user_id', as: 'userAttempts' });
QuizAttempt.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Quiz -> Question
Quiz.hasMany(Question, { foreignKey: 'quiz_id', as: 'questions' });
Question.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });

// Quiz -> QuizAttempt
Quiz.hasMany(QuizAttempt, { foreignKey: 'quiz_id', as: 'quizAttempts' });
QuizAttempt.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });

// Question -> Answer
Question.hasMany(Answer, { foreignKey: 'question_id', as: 'answers' });
Answer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

export { User, Quiz, QuizAttempt, Question, Answer };