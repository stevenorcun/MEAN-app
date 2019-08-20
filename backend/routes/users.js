const express = require('express');
const User = require('../model/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then( hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            user.save()
                .then( result => {
                    res.status(200).json({
                        message: 'New user created',
                        user: result
                    })
                })
                .catch( err => {
                    res.status(500).json({
                        error: err
                    })
                })
        })
})

router.post('/login', (req, res) => {
    let fetchedUser;
    User.findOne({ email: req.body.email})
        .then( user => {
            if(!user){
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            // On peut alor utiliser fetchedUser dans le prochain then block.
            // user n'existe que dans le premier bloc then
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then (result => {
            console.log(result)
            if(!result){
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            // On génère le token grace à sign
            // 3 arg => Le paylod, Le secret et la durée du token
            const token = jwt.sign(
                {email: fetchedUser.email, userId: fetchedUser._id},
                'secret_this_should_be_longer',
                {expiresIn: '1h'}
                );
            res.status(200).json({
                token
            })
        })
        .catch( err => {
            console.log(err);
            return res.status(401).json({
                message: 'Auth failed'
            });
        })
})

module.exports = router;
