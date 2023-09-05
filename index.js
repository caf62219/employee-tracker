const mysql = require("mysql2");
const inquirer = require("inquirer");
const db = require("./config/connection.js");

//database connection
db.connect((error) => {
  if (error) throw error;
  userQuestions();
});

//prompt user for options of what to do
const userQuestions = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "toDo",
        choices: [
          "View Employees",
          "View All Roles",
          "View All Departments",
          "View Employees by Manager",
          "View Employees by Department",
          "View Budget by Department",
          "Add Employee",
          "Add role",
          "Add Department",
          "Update Employee Role",
          "Update Employee Manager",
          "Delete Employee",
          "Delete Role",
          "Delete Department",                          "Exit"
        ],
      },
    ])
    .then((response) => {
      if (response.toDo === "View Employees") {
        viewEmployees();
      } else if (response.toDo === "View All Roles") {
        viewAllRoles();
      } else if (response.toDo === "View All Departments") {
        viewAllDepartments();
      } else if (response.toDo === "View Employees by Manager") {
        viewEmployeesByManager();
      } else if (response.toDo === "View Employees by Department") {
        viewEmployeesByDepartment();
      } else if (response.toDo ==="View Budget by Department") {
        viewBudgetByDepartment();
      } else if (response.toDo === "Add Employee") {
        addEmployees();
      } else if (response.toDo === "Add role") {
        addRole();
      } else if (response.toDo === "Add Department") {
        addDepartment();
      } else if (response.toDo === "Update Employee Role") {
        updateEmployeesRole();
      } else if (response.toDo === "Update Employee Manager") {
        updateEmployeesManager();
      } else if (response.toDo === "Delete Employee") {
        deleteEmployee();
      } else if (response.toDo === "Delete Role") {
        deleteRole();
      } else if (response.toDo === "Delete Department") {
        deleteDepartment();
      } else if (response.toDo === "Exit") {
        db.end();
      }
    });
};
//-----------------------------------------------------------------Viewing the tables----------------------------------------------------------------------------------------------------
//Viewing employees table
const viewEmployees = () => {
  const employees =
    "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name as department, roles.salary, CONCAT (manager.first_name, ' ',manager.last_name) as manager FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id LEFT Join employees as manager ON employees.manager_id = manager.id";
  db.query(employees, (error, response) => {
    if (error) throw error;
    console.table(response);
    userQuestions();
  });
};
//Viewing the roles table
const viewAllRoles = () => {
  const role =
    "Select roles.id, roles.title, roles.salary, departments.name AS `department` FROM roles INNER JOIN departments on roles.department_id =departments.id";
  db.query(role, (error, response) => {
    if (error) throw error;
    console.table(response);
    userQuestions();
  });
};
//viewing the departments table
const viewAllDepartments = () => {
  const department = "Select * from departments";
  db.query(department, (error, response) => {
    if (error) throw error;
    console.table(response);
    userQuestions();
  });
};

//view employees by manager
const viewEmployeesByManager = () => {
  const sqlSelect =
    "SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, departments.name, employees.id, employees.first_name, employees.last_name, roles.title, roles.salary FROM employees LEFT JOIN employees manager ON employees.manager_id = manager.id JOIN roles ON (employees.role_id = roles.id && employees.manager_id !='null') JOIN departments ON roles.department_id = departments.id ";
  db.query(sqlSelect, (error, response) => {
    if (error) throw error;
    console.table(response);
    userQuestions();
  })
}

//view employees by department
const viewEmployeesByDepartment = () => {
  const sqlSelect =
    "SELECT departments.name, roles.title, employees.id, employees.first_name, employees.last_name FROM employees LEFT JOIN roles on (roles.id = employees.role_id) Left join departments ON (roles.department_id = departments.id)  Order by departments.name ";
  db.query(sqlSelect, (error, response) => {
    if (error) throw error;
    console.table(response);
    userQuestions();
  })
}

//view budget by department

const viewBudgetByDepartment= () => {
  const allDepartments = "SELECT * FROM departments";
  db.query(allDepartments, (error, response) => {
    if (error) throw error;
    let departmentsArray = [];
    response.forEach((department) => {
      departmentsArray.push({
        name: department.name,
        value: department.id,
      });
    });
    
    inquirer
      .prompt([
        {
          type: "list",
          message: "Which department do you want the budget for?",
          name: "departmentBudget",
          choices: departmentsArray,
        },
      ])
      .then((response)=> {
        const sqlSelect =`departments.name AS department, SUM(roles.salary) AS budget FROM  departments INNER JOIN roles ON departments.id= roles.department_id  INNER JOIN employees on roles.id = employees.role_id WHERE name = response.departmentBudget`;
        db.query(sqlSelect, (error, response) => {
        if (error) throw error;
          console.table(response);
          userQuestions();
  })
})
  })
}

//----------------------------------------------------------------------------------adding to tables----------------------------------------------------------------------------------

// adds new employees
const addEmployees = () => {
  //getting a list of roles and allowing a new role to be added if the user wishes
  const allRoles = "SELECT * FROM roles";
  db.query(allRoles, (error, response) => {
    if (error) throw error;
    let rolesArray = [];
    response.forEach((role) => {
      rolesArray.push({
        name: role.title,
        value: role.id,
      });
    });
    rolesArray.push({
      name: "New Role",
      value: "New Role",
    });
    inquirer
      .prompt([
        {
          type: "list",
          message: "What is the role of the new employee?",
          name: "roleTitle",
          choices: rolesArray,
        },
      ])
      .then((answer) => {
        if (answer.roleTitle === "New Role") {
          this.addRole();
        } else {
          addNewEmployee(answer);
        }
      });
//function to add the new employee
    const addNewEmployee = (answer) => {
      const allManagers = "SELECT * FROM employees";
      db.query(allManagers, (error, response) => {
        if (error) throw error;
        let managersArray = [];
        response.forEach((manager) => {
          managersArray.push({
            name: `${manager.first_name} ${manager.last_name}`,
            value: manager.id,
          });
        });
        inquirer
          .prompt([
            {
              type: "input",
              message: "What is the employee's first name?",
              name: "firstName",
            },
            {
              type: "input",
              message: "What is the employee's last name?",
              name: "lastName",
            },
            {
              type: "list",
              message: "Who is the employee's manager?",
              name: "managerName",
              choices: managersArray,
            },
          ])
          //inserting the new values into the table
          .then((response) => {
            let newEmployee =
              "INSERT INTO employees (first_name, last_name, role_id, manager_id) Values (?,?,?,?)";
            let newEmployeeValues = [
              response.firstName,
              response.lastName,
              answer.roleTitle,
              response.managerName,
            ];

            db.query(newEmployee, newEmployeeValues, (error, response) => {
              if (error) throw error;
              console.log('New Employee Added');
              viewEmployees();
            });
          });
      });
    };
  });
};

//adding a role
const addRole = () => {
  //getting a list of the departments for the user to choose from
  const allDept = "SELECT * FROM departments";
  db.query(allDept, (error, response) => {
    if (error) throw error;
    let deptsArray = [];
    response.forEach((department) => {
      deptsArray.push(department.name);
    });
    deptsArray.push("New Department");
    inquirer
      .prompt([
        {
          type: "list",
          message: "To which department would you like to add this role?",
          name: "departmentTitle",
          choices: deptsArray,
        },
      ])
      //allows the user to add a new department if needed
      .then((answer) => {
        if (answer.departmentTitle === "New Department") {
          this.addDepartment();
        } else {
          addNewRole(answer);
        }
      });
//function for adding a new role
    const addNewRole = (departmentInfo) => {
      inquirer
        .prompt([
          {
            type: "input",
            message: "What is the role you are looking to add?",
            name: "newRole",
          },
          {
            type: "input",
            message: "What is the salary of the new role?",
            name: "newRoleSalary",
          },
        ])
//then statement that puts all the new values into the roles table
        .then((answer) => {
          let departmentId;

          response.forEach((departments) => {
            if (departmentInfo.departmentTitle === departments.name) {
              departmentId = departments.id;
            }
          });

          let newRole =
            "INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)";
          let newRoleValues = [
            answer.newRole,
            answer.newRoleSalary,
            departmentId,
          ];

          db.query(newRole, newRoleValues, (error, response) => {
            if (error) throw error;
            console.log('New Role added');
            viewAllRoles();
          });
        });
    };
  });
};

//add a new department
const addDepartment = () => {
  //question for user
  inquirer
    .prompt([
      {
        type: "input",
        message: "What new department would you like to add?",
        name: "newDepartment",
      },
    ])
    //to add the new department to the table
    .then((response) => {
      db.query(
        "insert into departments(name) values(?)",
        response.newDepartment,
        (error, response) => {
          if (error) throw error;
          console.log("Successfully added department!");
          viewAllDepartments();
        }
      );
    });
};

//-----------------------------------------------------------------------------------------------------UPDATES------------------------------------------------------------------------------------
//update employee role
const updateEmployeesRole = () => {
  //getting all employees for a list
  const allEmployees = "SELECT * FROM employees";
  db.query(allEmployees, (error, response) => {
    if (error) throw error;
    let employeesArray = [];
    response.forEach((employee) => {
      employeesArray.push({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      });
    });
    //getting all roles for a list
    const employeeRoles = "SELECT * FROM roles";
    db.query(employeeRoles, (error, response) => {
      if (error) throw error;
      let employeeRolesArray = [];
      response.forEach((role) => {
        employeeRolesArray.push({
          name: `${role.title}`,
          value: role.id,
        });
      });
    //getting a list of all employees to set a manger
    const employeeManagers= "SELECT * FROM employees";
      db.query(employeeManagers, (error, response) => {
        if (error) throw error;
        let employeeManagersArray = [];
        response.forEach((manager) => {
          employeeManagersArray.push({
            name: `${manager.first_name} ${manager.last_name}`,
            value: manager.id,
          });
        });
      //prompt questions
        inquirer
        .prompt([
          {
            type: "list",
            message: "What is the employee's name?",
            name: "employeeName",
            choices: employeesArray,
          },
          {
            type: "list",
            message: "What is the new role of the employee?",
            name: "employeeNewRole",
            choices: employeeRolesArray,
          },
          {
            type: "list",
            message: "Who is the employee's new manager?",
            name:"newManager",
            choices: employeeManagersArray
          }
        ])
        //updating the employee manager and role based on the changes
        .then((response) => {
          db.query(
            `Update employees set role_id=${response.employeeNewRole}, manager_id= ${response.newManager} where id = ${response.employeeName}`,
            (error, response) => {
              if (error) throw error;
              console.log("Successfully updated employee role!");
              viewEmployees();
            }
          );
        });
    });
  });
  });
};
//updating employee manager
const updateEmployeesManager = () => {
  //getting all employees for a list
  const allEmployees = "SELECT * FROM employees";
  db.query(allEmployees, (error, response) => {
    if (error) throw error;
    let employeesArray = [];
    response.forEach((employee) => {
      employeesArray.push({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      });
    });
    //getting a list of all employees to set a manger
    const employeeManagers= "SELECT * FROM employees";
      db.query(employeeManagers, (error, response) => {
        if (error) throw error;
        let employeeManagersArray = [];
        response.forEach((manager) => {
          employeeManagersArray.push({
            name: `${manager.first_name} ${manager.last_name}`,
            value: manager.id,
          });
        });
      //prompt questions
        inquirer
        .prompt([
          {
            type: "list",
            message: "What is the employee's name for which you want to change the manager?",
            name: "employeeName",
            choices: employeesArray,
          },
          {
            type: "list",
            message: "Who is the employee's new manager?",
            name:"newManager",
            choices: employeeManagersArray
          }
        ])
        //updating the employee manager  based on the changes
        .then((response) => {
          db.query(
            `Update employees set manager_id= ${response.newManager} where id = ${response.employeeName}`,
            (error, response) => {
              if (error) throw error;
              console.log("Successfully updated employee manager!");
              viewEmployees();
            }
          );
        });
    });
  });
};

//------------------------------------------------------------------Deleting-------------------------------------------------------------------------------
//delete employee
const deleteEmployee = () => {
  //getting all employees for a list
  const allEmployees = "SELECT * FROM employees";
  db.query(allEmployees, (error, response) => {
    if (error) throw error;
    let employeesArray = [];
    response.forEach((employee) => {
      employeesArray.push({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      });
    }); 
      //prompt questions
        inquirer
        .prompt([
          {
            type: "list",
            message: "What employee would you like to delete?",
            name: "employeeToDelete",
            choices: employeesArray,
          }
        ])
        //deleting the employee based on the user request
        .then((response) => {
          db.query(
            `Delete from employees where id = ${response.employeeToDelete}`,
            (error, response) => {
              if (error) throw error;
              console.log("Successfully removed employee!");
              viewEmployees();
            }
          );
        });
   
  });
};

//delete role
const deleteRole = () => {
  //getting all roles for a list
  const allRoles = "SELECT * FROM roles";
  db.query(allRoles, (error, response) => {
    if (error) throw error;
    let rolesArray = [];
    response.forEach((role) => {
      rolesArray.push({
        name: role.title,
        value: role.id
      });
    }); 
      //prompt questions
        inquirer
        .prompt([
          {
            type: "list",
            message: "What role would you like to delete?",
            name: "roleToDelete",
            choices: rolesArray,
          }
        ])
        //deleting the role based on the user request
        .then((response) => {
          db.query(
            `Delete from roles where id = ${response.roleToDelete}`,
            (error, response) => {
              if (error) throw error;
              console.log("Successfully removed role!");
              viewAllRoles();
            }
          );
        });
   
  });
};
//delete department
const deleteDepartment = () => {
  //getting all roles for a list
  const allDepartments = "SELECT * FROM departments";
  db.query(allDepartments, (error, response) => {
    if (error) throw error;
    let departmentsArray = [];
    response.forEach((department) => {
      departmentsArray.push({
        name: department.name,
        value: department.id
      });
    }); 
      //prompt questions
        inquirer
        .prompt([
          {
            type: "list",
            message: "What department would you like to delete?",
            name: "departmentToDelete",
            choices: departmentsArray,
          }
        ])
        //deleting the department based on the user request
        .then((response) => {
          db.query(
            `Delete from departments where id = ${response.departmentToDelete}`,
            (error, response) => {
              if (error) throw error;
              console.log("Successfully removed department!");
              viewAllDepartments();
            }
          );
        });
   
  });
};
//mysql query
//counts the number of instock from favorite books the out of stock
// db.query('SELECT in_stock COUNT(id) AS total_count FROM favorite_books GROUP BY in_stock', function (err, results) {
//   console.log(results);
// });

//gives the sum quantity,  the max quanity and min quantity and the average quanity per section.  This is done in the order listed
// db.query('SELECT section, SUM(quantity) AS total_in_section, MAX(quantity) AS max_quantity, MIN(quantity) AS min_quantity, AVG(quantity) AS avg_quantity FROM favorite_books GROUP BY section', function (err, results) {
//   console.log(results);
// });
