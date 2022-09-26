const express = require('express');
const usersRouter = express.Router();
const connection = require('../config/database');
const { body, validationResult } = require('express-validator');

usersRouter.get('/dataUsers', function (req, res) {
    connection.query('SELECT * FROM users ORDER BY user_id desc', function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'List Data Users',
                data: rows
            })
        }
    });
});

usersRouter.post('/insertUser', [

    body('nama').notEmpty(),
    body('username').notEmpty(),
    body('password').notEmpty()

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    let formData = {
        nama: req.body.nama,
        username: req.body.username,
        password: req.body.password
    }
    connection.query('SELECT * FROM users WHERE username = "'+formData.username+'"', function (err, result) {
        console.log(result)
        if (result.length > 0) {
            return res.status(200).json({
                status: true,
                message: 'Username Sudah Digunakan',
            })
        } else {
            connection.query('INSERT INTO users SET ?', formData, function (err, rows) {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        message: 'Internal Server Error',
                    })
                } else {
                    return res.status(201).json({
                        status: true,
                        message: 'Insert Data Successfully',
                        data: rows[0]
                    })
                }
            })
        }
    });
});

usersRouter.get('/detailUser/(:id)', function (req, res) {

    let id = req.params.id;

    connection.query(`SELECT * FROM users WHERE user_id = ${id}`, function (err, rows) {

        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }

        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data User Not Found!',
            })
        }
        else {
            return res.status(200).json({
                status: true,
                message: 'Detail Data User',
                data: rows[0]
            })
        }
    })
})

usersRouter.patch('/updateUser/:user_id', [

    body('nama').notEmpty(),
    body('username').notEmpty(),
    body('password').notEmpty()

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    let user_id = req.params.user_id;

    let formData = {
        nama: req.body.nama,
        username: req.body.username,
        password: req.body.password
    }

    connection.query(`UPDATE users SET ? WHERE user_id = ${user_id}`, formData, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Update Data Successfully!'
            })
        }
    })
});

usersRouter.delete('/deleteUser/(:user_id)', function(req, res) {
    let user_id = req.params.user_id; 
    connection.query(`DELETE FROM users WHERE user_id = ${user_id}`, function(err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Delete Data Successfully!',
            })
        }
    })
});
module.exports = usersRouter;