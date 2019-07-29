DROP DATABASE IF EXISTS test_va;
CREATE DATABASE test_va;
use test_va;

CREATE TABLE va (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(100),
  user_email VARCHAR(255),
  user_birthdate DATE NOT NULL,
  virtual_account CHAR(16) UNIQUE,
  create_date TIMESTAMP DEFAULT NOW()
);

DELIMITER $$

CREATE TRIGGER generate_virtual_account
BEFORE INSERT ON va
FOR EACH ROW BEGIN
    SET @auto_inc = (SELECT COUNT(*) FROM va WHERE user_birthdate like NEW.user_birthdate);
    -- Note that below we limit running number from 00 to 09
    SET NEW.virtual_account = CONCAT('98800332',
                                     DATE_FORMAT(NEW.user_birthdate, '%y%m%d'),
                                     LPAD(CAST(@auto_inc as decimal(1, 0)), 2, '0') 
                                    );
END

$$

DELIMITER ;


-- Move these tests to the application program
-- Test adding different dates
INSERT INTO va (user_birthdate) VALUES 
('1996-06-15'), 
('1987-03-1');

-- Test adding same date more than 10 times
INSERT INTO va (user_birthdate) VALUES 
('1993-06-15'), 
('1993-06-15'), 
('1993-06-15'), 
('1993-06-15'), 
('1993-06-15'), 
('1993-06-15'), 
('1993-06-15'), 
('1993-06-15'), 
('1993-06-15'), 
('1993-06-15');

-- Adding one more should return an error
INSERT INTO va (user_birthdate) VALUES 
('1993-06-15');
