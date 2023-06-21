-- =============================================
-- CREATE STRUCTURE
-- =============================================
DROP DATABASE IF EXISTS testing_system;
CREATE DATABASE testing_system;
USE testing_system;

-- create table 2: account

CREATE TABLE `account` (
	id 				SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	email 			VARCHAR(50) UNIQUE KEY,
	username		VARCHAR(50) UNIQUE KEY NOT NULL,
	fullname 		NVARCHAR(50) NOT NULL,
	department_id	SMALLINT UNSIGNED NOT NULL,
    `role`			ENUM('Admin', 'Employee','Manager') NOT NULL,
    `status`		BIT NOT NULL DEFAULT 0, -- 0: Block, 1: Active,
	created_date	DATETIME NOT NULL DEFAULT NOW(),
    FOREIGN KEY (department_id) REFERENCES department(id)
);
-- create table 1: department
CREATE TABLE department(
	id 				SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	`name` 			VARCHAR(50) UNIQUE KEY NOT NULL,
    creator_id		SMALLINT UNSIGNED NOT NULL,
    manager_id		SMALLINT UNSIGNED NOT NULL,
    total_member	SMALLINT DEFAULT 1,
    join_date		DATETIME NOT NULL DEFAULT NOW(),
    FOREIGN KEY (creator_id) REFERENCES `account`(id),
    FOREIGN KEY (manager_id) REFERENCES `account`(id)
);


-- create table 3: group
CREATE TABLE `group` (
	id 				SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	total_member 	SMALLINT DEFAULT 1,
    creator_id		SMALLINT UNSIGNED NOT NULL,
	created_date	DATETIME NOT NULL DEFAULT NOW(),
    FOREIGN KEY (creator_id) REFERENCES `account`(id)
    );
    
-- create table 4: group_account
CREATE TABLE group_account (
	group_id 		SMALLINT UNSIGNED NOT NULL,
	account_id 		SMALLINT UNSIGNED NOT NULL,
	join_date		DATETIME NOT NULL DEFAULT NOW(),
    PRIMARY KEY(group_id, account_id),
    FOREIGN KEY (group_id) REFERENCES `group`(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES `account`(id) ON DELETE CASCADE
);