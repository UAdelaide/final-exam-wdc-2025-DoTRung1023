DROP DATABASE IF EXISTS DogWalkService;
CREATE DATABASE DogWalkService;
USE DogWalkService;
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('owner', 'walker') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Dogs (
    dog_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    size ENUM('small', 'medium', 'large') NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES Users(user_id)
);

CREATE TABLE WalkRequests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    dog_id INT NOT NULL,
    requested_time DATETIME NOT NULL,
    duration_minutes INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    status ENUM('open', 'accepted', 'completed', 'cancelled') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dog_id) REFERENCES Dogs(dog_id)
);

CREATE TABLE WalkApplications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    walker_id INT NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
    FOREIGN KEY (walker_id) REFERENCES Users(user_id),
    CONSTRAINT unique_application UNIQUE (request_id, walker_id)
);

CREATE TABLE WalkRatings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    walker_id INT NOT NULL,
    owner_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
    FOREIGN KEY (walker_id) REFERENCES Users(user_id),
    FOREIGN KEY (owner_id) REFERENCES Users(user_id),
    CONSTRAINT unique_rating_per_walk UNIQUE (request_id)
);

-- Five users:
insert into Users (username, email, password_hash, role) values
('alice123', 'alice@example.com', 'hashed123', 'owner'),
('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
('carol123', 'carol@example.com', 'hashed789', 'owner'),
('davidowner', 'david@example.com', 'hashed101', 'owner'),
('sarahwalker', 'sarah@example.com', 'hashed202', 'walker');

-- Five dogs:
insert into Dogs (owner_id, name, size) values
((select user_id from Users where username = 'alice123'), 'Max', 'medium'),
((select user_id from Users where username = 'carol123'), 'Bella', 'small'),
((select user_id from Users where username = 'alice123'), 'Charlie', 'large'),
((select user_id from Users where username = 'davidowner'), 'Luna', 'medium'),
((select user_id from Users where username = 'carol123'), 'Rocky', 'small');

-- Five walk requests:
insert into WalkRequests (dog_id, requested_time, duration_minutes, location, status) values
((select dog_id from Dogs where name = 'Max' and owner_id = (select user_id from Users where username = 'alice123')), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
((select dog_id from Dogs where name = 'Bella' and owner_id = (select user_id from Users where username = 'carol123')), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
((select dog_id from Dogs where name = 'Charlie' and owner_id = (select user_id from Users where username = 'alice123')), '2025-06-12 14:00:00', 60, 'City Park', 'open'),
((select dog_id from Dogs where name = 'Luna' and owner_id = (select user_id from Users where username = 'davidowner')), '2025-06-13 16:30:00', 30, 'Riverside Trail', 'completed'),
((select dog_id from Dogs where name = 'Rocky' and owner_id = (select user_id from Users where username = 'carol123')), '2025-06-15 10:00:00', 45, 'Downtown Square', 'open');

