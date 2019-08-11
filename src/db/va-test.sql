-- Move these tests to the application program
-- Test adding different dates
INSERT INTO bnis_va_cust (user_birthdate) VALUES 
('1996-06-15'), 
('1987-03-1');

-- Test adding same date more than 10 times
INSERT INTO bnis_va_cust (user_birthdate) VALUES 
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
INSERT INTO bnis_va_cust (user_birthdate) VALUES 
('1993-06-15');