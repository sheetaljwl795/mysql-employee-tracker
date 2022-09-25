SELECT * from employee;

SELECT * FROM role r JOIN department d ON r.department_id = d.id ;

SELECT * FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id;

SELECT * FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id;

SELECT * FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id ORDER BY e.first_name DESC;

SELECT e.first_name, e.last_name, r.title, r.salary, d.name  FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee manager ON manager.id = e.manager_id ORDER BY salary DESC;

SELECT e.first_name, e.last_name, r.title, r.salary, d.name, CONCAT(manager.first_name, " ", manager.last_name) AS manager_name  FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee manager ON manager.id = e.manager_id ORDER BY salary DESC;