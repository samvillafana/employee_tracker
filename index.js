require('dotenv').config();

const express = require('express');

const mysql = require('mysql2');

const inquirer = require('inquirer');

const Table = require('cli-table-redemption');

const chalk = require('chalk');


const {
    HOST,
    USER,
    PASSWORD,
    PORT,
    DATABASE

} = process.env

const app = express();

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: PASSWORD,
    database: 'employee_tracker',

});
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

});
inquirer
    .prompt([{
        type: 'list',
        name: 'menuChoice',
        message: 'What would you like to do Supervisor?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add an employee',
            'Add a role',
            'Update an employee role',
            "Exit"
        ]
    }]).then(answers => {
        // console.log(answers);
        switch (answers.menuChoice) {
            case 'View all departments':
                viewAllDepartments()
                break;
            case 'View all roles':
                viewAllRoles()
                break;
            case 'View all employees':
                viewAllEmployees()
                break;
            case 'Add a department':
                addDepartment()
                break;

            case 'Add an employee':
                addEmployee()
                break;

            case 'Add a role':
                addRole()
                break;

            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    });

const viewAllDepartments = async () => {
    let sql = `SELECT * FROM departments;`
    connection.query(sql, (err, results) => {
        if (err) {
            throw err
        }
        let table = new Table({
            head: [chalk.yellow('Department ID'), chalk.yellow('Department Name')],
            colWidths: [20, 20]
        });

        for (let i = 0; i < results.length; i++) {
            table.push([`${chalk.white(results[i].id)}`, `${results[i].name}`]);
        }



        console.log(chalk.cyan(table.toString()));
        connection.end();
    })
}
const viewAllRoles = async () => {
    let sql = `SELECT * FROM roles;`
    connection.query(sql, (err, results) => {
        if (err) {
            throw err
        }
        let table = new Table({
            head: [chalk.yellow('ID'), chalk.yellow('Title'), chalk.yellow('Salary'), chalk.yellow('Department_ID')],
            colWidths: [20, 20, 20, 20]
        });

        for (let i = 0; i < results.length; i++) {
            table.push([`${chalk.white(results[i].id)}`, `${results[i].title}`, `${results[i].salary}`, `${results[i].department_id}`]);
        }



        console.log(chalk.cyan(table.toString()));
        connection.end();
    })
}

const viewAllEmployees = async () => {
    let sql = `SELECT * FROM employees;`
    connection.query(sql, (err, results) => {
        if (err) {
            throw err
        }
        let table = new Table({
            head: [chalk.yellow('ID'), chalk.yellow('First_Name'), chalk.yellow('Last_Name'), chalk.yellow('Role_Id'), chalk.yellow('Manager_Id')],
            colWidths: [20, 20, 20, 20, 20]
        });

        for (let i = 0; i < results.length; i++) {
            table.push([`${chalk.white(results[i].id)}`, `${results[i].first_name}`, `${results[i].last_name}`, `${results[i].role_id}`, `${results[i].manager_id}`]);
        }

        console.log(chalk.cyan(table.toString()));
        connection.end();
    })
}

const addDepartment = async () => {
    inquirer
        .prompt(
            [{
                name: 'deptName',
                message: 'Please enter new department name'
            }, ]
        ).then(answers => {
            console.log(answers);
            var deptName = answers.deptName;
            connection.query(`INSERT INTO departments (name) VALUES ('${deptName}')`, function (err) {
                if (err) throw err;
                console.log(`Department added!`);
                connection.end();
            });
        });

}

const addEmployee = () => {
    inquirer
        .prompt(
            [{
                    name: 'id',
                    message: 'Please enter employee id'
                },
                {
                    name: 'firstName',
                    message: 'Please enter first name'
                },
                {
                    name: 'lastName',
                    message: 'Please enter last name'
                },
                {
                    name: 'roleId',
                    message: 'Please enter role ID'
                },
                {
                    name: 'managerId',
                    message: 'Please enter manager ID'
                },
            ]
        ).then(answers => {
            console.log(answers);
            let id = answers.id
            let firstName = answers.firstName;
            let lastName = answers.lastName;
            let roleId = answers.roleId;
            let managerId = answers.managerId;

            connection.query(`INSERT INTO employees (id, first_name, last_name, role_id, manager_id) VALUES ('${id}', '${firstName}', '${lastName}', '${roleId}', '${managerId}')`, function (err) {
                if (err) throw err;
                console.log(`Employee added!`);
                connection.end();
            });
        });
}

const addRole = () => {
    inquirer
        .prompt(
            [{
                    name: 'id',
                    message: 'Please enter role id'
                },
                {
                    name: 'title',
                    message: 'Please enter title'
                },
                {
                    name: 'salary',
                    message: 'Please enter salary'
                },
                {
                    name: 'departmentId',
                    message: 'Please enter department ID'
                },

            ]
        ).then(answers => {
            console.log(answers);
            let id = answers.id
            let title = answers.title;
            let salary = answers.salary;
            let departmentId = answers.departmentId;


            connection.query(`INSERT INTO roles (id, title, salary, department_id) VALUES ('${id}', '${title}', '${salary}', '${departmentId}')`, function (err) {
                if (err) throw err;
                console.log(`Role added!`);
                connection.end();
            });
        });
}

const updateEmployeeRole = async () => {
    let newRoleId = '';
    inquirer.prompt({
        name: 'newRole',
        message: 'Please enter new role id'
    }).then(answer => {
        newRoleId = answer.newRole;
        connection.query(`SELECT * FROM EMPLOYEES`, (err, results) => {
            if (err) throw err;
            let employees = [];
            console.log(results)
            results.forEach(employee => {
                employees.push(`id: ${employee.id} LAST NAME: ${employee.last_name}`)
            })

            inquirer.prompt([{
                type: 'list',
                name: 'employee',
                message: 'Please select employee',
                choices: employees
            }]).then(answers => {
                let employee = answers.employee
                console.log(employee.split(' '))
                let id = employee.split(" ")[1];
                console.log('the employee id is ===> ', id)
                connection.query(`UPDATE employees SET role_id = ${newRoleId} WHERE id = ${id}`, (err) => {
                    if (err) throw err;
                    console.log(`Employee role updated!`);
                    connection.end();
                })
            })
        });

    })

}