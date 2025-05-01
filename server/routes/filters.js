const express = require('express');
const router = express.Router();
const {DB} = require('../db/db');

router.get('/:filter', async (req, res) => {
    try{
        const db = new DB();
        const filter = req.params.filter;
        const data =  await db.getAllFilterList(filter);
        res.json({'response':data});
      
    }catch(err){
        res.status(400).send({'error':'not supported in api ' + err});
      
    }
});
module.exports = {
    filtersRouter: router
};
