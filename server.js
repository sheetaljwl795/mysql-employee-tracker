const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

//Connection to the database
const connection = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'shriganesh',
      database: 'employee_db'
    },

);

connection.connect(err => {
  if (err) throw err;
  initalPrompt();
})

const initalPrompt = () => {
  inquirer.prompt([
    {
            type: "list",
            name: "action",
            message: "Welcome! What would you like to do?",
            choices: [
              "View all departments",
              "View all roles",
              "View all employees", 
              "Add a department",
              "Add a role",
              "Add an employee",           
              "Update role for an employee",
              "Update employee's manager",
              "View employees by manager",
              "View employees by department",
              "Delete a department",
              "Delete a role",
              "Delete an employee",
              "View the total utilized budget of a department",
              "Quit"]
    }]). then((response) => {
      switch (response.action) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;        
        case "Add a department":
          addNewDepartment();
          break;
        case "Add a role":
          addNewRole();
          break;
        case "Add an employee":
          addNewEmployee();
          break;
        case "Update role for an employee":
          updateRole();
          break;
        case "Update employee's manager":
          updateManager();
          break;
        case "View employees by manager":
          viewEmployeeByManager();
          break;
        case "View employees by department":
          viewEmployeeByDepartment();
            break;
        case "Delete a department":
          deleteDepartment();
          break;
        case "Delete a role":
          deleteRole();
          break;
        case "Delete an employee":
          deleteEmployee();
          break;
        case "View the total utilized budget of a department":
          viewBudget();
          break;
        case "Quit":
          exit();
          break;        
        default:
          break;
      }
    })  
};

// View all Departmenrs
const viewDepartments = () => {
  console.log('Department View');

  var sql = 'SELECT department.id AS id, department.name AS department FROM department';
  
  connection.query(sql, function(err, res) {
    if (err) throw err;
    console.log(res.length + ' total departments'); 
    console.table(res);
    initalPrompt();
  });    
};

// View all Roles
const viewRoles = () => {
  console.log('Roles View');

  var sql = 'SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id';
  
  connection.query(sql, function(err, res) {
    if (err) throw err;
    // console.log(res.length + ' total Roles'); 
    console.table(res);
    initalPrompt();
  });
};

// View all Employee
const viewEmployees = () => {
  console.log('Employee View');

  var sql = 'SELECT e.first_name, e.last_name, r.title, r.salary, d.name, CONCAT(manager.first_name, " ", manager.last_name) AS manager_name  FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee manager ON manager.id = e.manager_id ORDER BY salary DESC';
  
  connection.query(sql, function(err, res) {
    if (err) throw err;
    console.log(res.length + ' total employees'); 
    console.table(res);
    initalPrompt();
  });    
};
// Add new department
const addNewDepartment = () => {
  
  inquirer.prompt([
    {
      type: 'input', 
      name: 'addDepartment',
      message: "enter the name of the department",
      validate: addDepartment => {
        if (addDepartment) {
            return true;
        } else {
            console.log('please enter department name you want to add');
            return false;
        }
      }
    }
  ]).then(answer => {
  
    var sql = 'INSERT INTO department (name) VALUES (?)';
  
    connection.query(sql, answer.addDepartment, function(err, res) {
    if (err) throw err;
    console.log(answer.addDepartment + "was added as new deparment.");
    console.table('All Departments');
    viewDepartments();
    initalPrompt();
  });
  });
};

// Add new Role
const addNewRole =  () => {

  const addRole = "SELECT  id, name FROM department";

  connection.query(addRole, (err, res) => {
    if (err) throw err;

    // console.log(res);
    const dept = res.map(choice => choice.name);
    // console.log(dept);

    inquirer.prompt([
    {
      type: 'input', 
      name: 'role',
      message: "Enter new role:",
      validate: role => {
        if (role) {
            return true;
        } else {
            console.log('Please enter role which you wants to add');
            return false;
        }
      }
    }, 
    {
      type: 'input', 
      name: 'salary',
      message: "What is the salary for this role?",
      validate: salary => {
        if (salary) {
            return true;
        } else {
            console.log('Please enter salary for this role');
            return false;
        }
      }
    },
    {
      type: 'list', 
      name: 'dept',
      message: "Select the Department for this new role:",
      choices: dept    
    }
    ]).then(answer => {   
    const sql = `INSERT INTO role(title, salary, department_id) VALUES ("${answer.role}", "${answer.salary}", (SELECT id FROM department WHERE name = "${answer.dept}"));`

    connection.query(sql, function(err, res) {
      if (err) throw err;
      console.log('Added ' + answer.role + ' to roles!');
      viewRoles();
    });
  });
});
};

// Add an employee
const addNewEmployee = () => {

  connection.query('SELECT * from role', (err, res) => {
    const roles = res.map(({ id, title }) => ({ value: id, name: title }))    
  
    inquirer.prompt([
    {
      type: 'input', 
      name: 'fName',
      message: "Enter First Name:",
      validate: fName => {
        if (fName) {
            return true;
        } else {
            console.log('Please enter firt name');
            return false;
        }
      }
    }, 
    {
      type: 'input', 
      name: 'lName',
      message: "Enter Last Name:",
      validate: lName => {
        if (lName) {
            return true;
        } else {
            console.log('Please enter last name');
            return false;
        }
      }
    },
    {
      type: 'list', 
      name: 'empRole',
      message: "Select the role of this employee",
      choices: roles      
    },  
    ]).then(answer => {
      const parameters = [answer.fName, answer.lName, answer.empRole]

      connection.query('SELECT * FROM employee', (err, res) => {

        const managers = res.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
       
        inquirer.prompt([
          {
            type: 'list',
            name: 'manager',
            message: "Who is the employee's manager?",
            choices: managers
          }
        ]).then(mgrChoice => {
          const manager = mgrChoice.manager;
          parameters.push(manager);

          const sqlEmp = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';

          connection.query(sqlEmp, parameters, (err, res) => {
            if (err) throw err;
            viewEmployees();
        })
        })
      })
      
    });
  }) 
};

