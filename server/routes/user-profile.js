const express = require('express');
const router = express.Router();
const {DB} = require('../db/db');

router.get('/:email', async (req, res) => {
    try{
        const db = new DB();
        const email = req.params.email;
        const user =  await db.findUser(email);
        if(user){
            res.json({'response': user});
        }else{
            res.status(404).json({'error':'User not found'});
        }

    }catch(err){
        res.status(404).send({'error': 'An error occurred'});
      
    }
});

module.exports = {
    userProfileRouter: router
};