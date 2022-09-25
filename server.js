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

const viewRoles = () => {
  console.log('Roles View');

  var sql = 'SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id';
  
  connection.query(sql, function(err, res) {
    if (err) throw err;
    console.log(res.length + ' total Roles'); 
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
     
    const departments = connection.query("SELECT id, name FROM department");
    
    const depts = departments.map(({ id, name }) => ({ value: id, name: name })); 

  
  inquirer.prompt([
    {
      type: 'input', 
      name: 'role',
      message: "enter new role",
      validate: role => {
        if (role) {
            return true;
        } else {
            console.log('please enter role which you wants to add');
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
            console.log('please enter salary for this role');
            return false;
        }
      }
    },

    {
      type: 'list', 
      name: 'depatmentId',
      message: "What deparment id is asscoiated with this role?",
      choices: depts    
    }

  ]).then(answer => {
    var params = [answer.role, answer.salary, answer.depatmentId];
  
    var sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
  
    connection.query(sql, params, function(err, res) {
    if (err) throw err;
    console.log(`Added ${answer.role} to roles!`);
    viewRoles();
    initalPrompt();
  });
  });
};