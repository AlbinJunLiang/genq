CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auth_id VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('USER', 'ADMIN') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    visibility ENUM(
        'PUBLIC',
        'PRIVATE',
        'ACCESS_ONLY_VIA_LINK',
        'INACTIVE'
    ) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_at DATETIME,

    duration_seconds BIGINT NOT NULL,
    attempts INT DEFAULT 1,

    user_id INT NOT NULL,

    CONSTRAINT fk_quizzes_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE quiz_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE,

    user_id INT NOT NULL,
    quiz_id INT NOT NULL,

    quiz_attempted_content JSON,

    score DECIMAL(5,2),

    duration_seconds BIGINT,

    status ENUM(
        'IN_PROGRESS',
        'COMPLETED',
        'EXPIRED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'IN_PROGRESS',

    finished_at DATETIME,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_attempt_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_attempt_quiz
        FOREIGN KEY (quiz_id)
        REFERENCES quizzes(id)
        ON DELETE CASCADE
);

CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,

    content TEXT NOT NULL,

    type ENUM(
        'UNIQUE',
        'MULTIPLE',
        'OTHER'
    ) NOT NULL,

    status ENUM(
        'ACTIVE',
        'INACTIVE'
    ) NOT NULL DEFAULT 'ACTIVE',

    quiz_id INT NOT NULL,

    CONSTRAINT fk_question_quiz
        FOREIGN KEY (quiz_id)
        REFERENCES quizzes(id)
        ON DELETE CASCADE
);

CREATE TABLE answers (
    id INT AUTO_INCREMENT PRIMARY KEY,

    content TEXT NOT NULL,

    is_correct BOOLEAN NOT NULL DEFAULT FALSE,

    status ENUM(
        'ACTIVE',
        'INACTIVE'
    ) NOT NULL DEFAULT 'ACTIVE',

    question_id INT NOT NULL,

    CONSTRAINT fk_answer_question
        FOREIGN KEY (question_id)
        REFERENCES questions(id)
        ON DELETE CASCADE
);