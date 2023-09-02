SELECT *
FROM departments 
JOIN roles ON departments.name = roles.department;

SELECT *
FROM employees 
JOIN roles ON employees.roles = roles.title;