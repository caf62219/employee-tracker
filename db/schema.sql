DROP DATABASE IF EXISTS business_employees_db;
CREATE DATABASE business_employees_db;

USE business_employees_db;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department VARCHAR(30),
  FOREIGN KEY (department) REFERENCES departments(name) ON DELETE SET NULL
);

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role VARCHAR(30), 
  manager_id INT,
  FOREIGN KEY (role) REFERENCES roles(title) ON DELETE SET NULL,
  FOREIGN KEY (manager_id) REFERENCES employees(id)
);






  


