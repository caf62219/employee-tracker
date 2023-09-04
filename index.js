const mysql = require('mysql2');
const inquirer = require('inquirer')
const db= require('./config/connection.js')

//database connection
db.connect((error) => {
  if (error) throw error;
  userQuestions();
})

//prompt user for options of what to do
const userQuestions = () =>{
inquirer
  .prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'toDo',
      choices: ["View Employees", "View All Roles", "View All Departments", "Add Employee", "Update Employee Role", "Add role", "Add Department","Exit"]
    },
     ])
  .then((response) => {
    if (response.toDo === "View Employees") {
        viewEmployees()
        };
    if (response.toDo === "View All Roles") {
        viewAllRoles()
        };
    if (response.toDo === "View All Departments") {
        viewAllDepartments()
        };
    if (response.toDo === "Add Employees") {
        addEmployees()
        };
    if (response.toDo === "Add role") {
        addRole()
        };
    if (response.toDo === "Add Department") {
        addDepartment()
        };
    if (response.toDo === "Update Employees Role") {
        updateEmployeesRole()
        };
    if(response.toDo === "Exit") {
      db.end();
    }
    
  });
}

  const viewEmployees = () => {
    const employees= 'SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name as department, roles.salary, CONCAT (manager.first_name, manager.last_name) as manager, FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id Join employee as manager ON employees.manager_id = manager.id'
    db.query(employees, (error, response) => {
      if (error) throw error;
        console.table(response);
        userQuestions();
    })
  };

  const viewAllRoles = () => {
    const role= 'Select roles.id, roles.title, roles.salary, departments.name AS `department` FROM roles INNER JOIN departments on roles.department_id =departments.id'
    db.query(role, (error, response) => {
      if (error) throw error;
        console.table(response);
        userQuestions();
    })
  };

  const viewAllDepartments = () => {
    const department= 'Select * from departments'
    db.query(department, (error, response) => {
      if (error) throw error;
        console.table(response);
        userQuestions();
    })
  };

  const addEmployees = () => {
    inquirer.prompt ([
      {
        type: 'input',
        message: "What is the employee's first name?",
        name: "firstName"
      },
      {
        type: 'input',
        message: "What is the employee's last name?",
        name: "lastName"
      },
    ])
    .then((response)=> {
    let newemployee= 'INSERT INTO roles () Values (?,?,?)'
    
    db.query(department, (error, response) => {
      if (error) throw error;
        console.table(response);
        viewAllRoles();
    })
  })
  };

  //adding a role 
  const addRole = () => {
    const allDept='SELECT * FROM departments';
    db.query(allDept, (error, response)=> {
      if (error) throw error;
      let deptsArray =[];
      response.forEach((department) => {deptsArray.push(department.name)});
      deptsArray.push('New Department');
      inquirer
        .prompt([
          {
            type: 'list',
            message: 'To which department would you like to add this role?',
            name: 'departmentTitle',
            choices: deptsArray
          }
        ])
        .then((answer) => {
          if (answer.departmentTitle === 'New Department') {
            this.addDepartment()
          } else {
            addNewRole(response);
          }
        })
    

    const addNewRole = (departmentInfo) => {
      inquirer.prompt ([
        {
           type: 'input',
           message: "What is the role you are looking to add?",
          name: "newRole"
        },
        {
          type: 'input',
          message: "What is the salary of the new role?",
          name: "newRoleSalary"
        },
      ])

      .then((answer) => {
        let departmentId;

        response.forEach((departments) => {
          if (departmentInfo.departmentTitle === departments.name) {
            departmentId = departments.id
          }
        })
        
        let newRole = 'INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)';
        let newRoleValues = [answer.newRole, answer.newRoleSalary, departmentId]
    
        db.query(newRole, newRoleValues, (error, response) => {
          if (error) throw error;
            console.table(response);
           viewAllRoles();
    })
  })

}})
  };

  //add a new department
  const addDepartment = () => {
    inquirer.prompt ([
      {
        type: 'input',
        message: "What new department would you like to add?",
        name: "newDepartment"
      }
    ])
    .then((response) => {
      db.query ('insert into departments(name) values(?)', response.newDepartment, (error, response)=> {
        if (error) throw error;
        console.log('Successfully added department!')
      viewAllDepartments();
    })
    })
  };

  const updateEmployeesRole = () => {
    inquirer.prompt ([
      {
        type: 'input',
        message: "What is the employee's first name?",
        name: "firstName"
      },
      {
        type: 'input',
        message: "What is the employee's last name?",
        name: "lastName"
      },

    ])
  }


//mysql query
//counts the number of instock from favorite books the out of stock
// db.query('SELECT in_stock COUNT(id) AS total_count FROM favorite_books GROUP BY in_stock', function (err, results) {
//   console.log(results);
// });

//gives the sum quantity,  the max quanity and min quantity and the average quanity per section.  This is done in the order listed
// db.query('SELECT section, SUM(quantity) AS total_in_section, MAX(quantity) AS max_quantity, MIN(quantity) AS min_quantity, AVG(quantity) AS avg_quantity FROM favorite_books GROUP BY section', function (err, results) {
//   console.log(results);
// });


