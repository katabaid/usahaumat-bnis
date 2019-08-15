-- DROP DATABASE IF EXISTS va;
CREATE DATABASE va;
use va;

CREATE TABLE bnis_va_cust (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100),
    user_email VARCHAR(255),
    user_birthdate DATE NOT NULL,
    virtual_account CHAR(16) UNIQUE,
    created_date DATETIME NOT NULL DEFAULT NOW() ,
    last_active_date DATETIME NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL
);

CREATE TABLE bnis_trx (
    trx_id INT AUTO_INCREMENT PRIMARY KEY, -- Remove AUTO_INCREMENT?
    trx_amount BIGINT NOT NULL,
    billing_type_db CHAR(1) NOT NULL,
    billing_type VARCHAR(25) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(30),
    virtual_account CHAR(16),   -- I think that this should reference bnis_va_cust
    datetime_expired DATETIME,
    description VARCHAR(100),
    created_date DATETIME NOT NULL DEFAULT NOW(),
    last_active_date DATETIME NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL
);

CREATE TABLE bnis_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    log_date DATETIME NOT NULL DEFAULT NOW(), 
    method_name VARCHAR(100) NOT NULL,
    message_type CHAR(1) NOT NULL,
    message TEXT
);

DELIMITER $$

CREATE TRIGGER generate_virtual_account
BEFORE INSERT ON bnis_va_cust
FOR EACH ROW BEGIN
    SET @auto_inc = (SELECT COUNT(*) FROM bnis_va_cust WHERE user_birthdate like NEW.user_birthdate);
    -- Note that below we limit running number from 00 to 99
    SET NEW.virtual_account = CONCAT('98800332',
                                     DATE_FORMAT(NEW.user_birthdate, '%y%m%d'),
                                     LPAD(CAST(@auto_inc as decimal(2, 0)), 2, '0') 
                                    );
END

$$

DELIMITER ;
