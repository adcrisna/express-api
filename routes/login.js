const express = require('express');
const loginRouter = express.Router();
const connection = require('../config/database');
const { body, validationResult } = require('express-validator');

loginRouter.post('/loginUser', [

    body('username').notEmpty(),
    body('password').notEmpty()

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    let username = req.body.username
	let password = req.body.password

    connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function (err, rows) {
        console.log(rows)
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }

        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Username Atau Password Salah!',
            })
        }
        else {
            return res.status(200).json({
                status: true,
                message: 'Selamat Datang',
                data: rows[0]
            })
        }
    })
});
module.exports = loginRouter;