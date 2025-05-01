const express = require('express');
const router = express.Router();
require('dotenv').config();
const mapboxToken = process.env.MAPBOX_TOKEN;

router.get('/:address', async (req, res) => {
    try{
        const address = req.params.address;
        // eslint-disable-next-line max-len
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?proximity=ip&access_token=${mapboxToken}`);
        const data = await response.json();
        res.json({'coordinates':data.features[0].geometry.coordinates});
      
    }catch(err){
        res.status(400).send({'error':'address coordinates not found ' + err});
      
    }
});
module.exports = {
    coordinatesRouter: router
};
