INSERT INTO department (id, name)
VALUES ("Web Development"),
       ("Data Science"),
       ("Math"),
       ("Electives");

INSERT INTO role (id, title, salary, department_id)
VALUES ("Intro to JavaScript", 1),
       ("Data Science", 2),
       ("Linear Algebra", 3),
       ("History of the Internet", 4),
       ("Machine Learning", 4),
       ("Game Design", 1 ),
       ("Cloud Development", 1);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES ("Intro to JavaScript", 1),
       ("Data Science", 2),
       ("Linear Algebra", 3),
       ("History of the Internet", 4),
       ("Machine Learning", 4),
       ("Game Design", 1 ),
       ("Cloud Development", 1);