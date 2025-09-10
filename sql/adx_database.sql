
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    reset_token VARCHAR(255),
    token_expiry DATETIME
);
INSERT INTO users (email, password) 
VALUES ('panchalsoham123@gmail.com', '$2y$10$exampleHashedPasswordHere');
