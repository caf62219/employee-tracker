INSERT INTO departments (name)
VALUES ("sales"),
       ("engineering"),
       ("legal"),
       ("administration"),
       ("accounting")
       ;

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
       ("Sales Associate", 50000, 1),
       ("Salesperson", 80000, 1),
       ("Engineering Lead", 150000, 2),
       ("Engineer", 120000, 2),
       ("Accountant", 125000, 5),
       ("Accountant Manager", 160000, 5),
       ("Lawyer", 190000, 3),
       ("CEO", 300000, 4),
       ("Director", 250000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, null),
       ("Jane", "Frank", 2, 1),
       ("Sarah", "Smith", 3, 1),
       ("Katherine", "Levee", 4, null),
       ("Samantha", "Jones", 5, 4),
       ("Jim", "Shine", 6, 7),
       ("William", "Dorr", 7, null),
       ("James", "Lindem", 8, null),
       ("Karen", "Eisenhart", 9, null),
       ("Chelsea", "Jacob", 10, null) ;



