const express = require('express');
const router = express.Router();
const {DB} = require('../db/db');
const cache = require('memory-cache');

router.get('/', async (req, res) => {
    try{
        let data = JSON.parse(cache.get(`leases`));
        if (!data){
            const db = new DB();
            data =  await db.getAllLeases();
            cache.put(`leases`, JSON.stringify(data));
        }
        res.json({'response':data});
      
    }catch(err){
        res.status(400).send({'error':'not supported in api ' + err});
      
    }
});

router.get('/:city', async (req, res) => {
    try{
        const db = new DB();
        const city = req.params.city;
        const area = req.query.area;
        const bathrooms = req.query.bathroom;
        const bedrooms = req.query.bedroom;
        const minRent = req.query['rentMinimum'];
        const maxRent = req.query['rentMaximum']; 
        const minSize = req.query['sizeMinimum'];
        const maxSize = req.query['sizeMaximum']; 
        const furnishing = req.query.furnishing;


        const cacheKey = `leases:${city}:${area}:${bathrooms}:\
        ${bedrooms}:${minRent}:${maxRent}:${minSize}:${maxSize}:${furnishing}`;
        let data = JSON.parse(cache.get(cacheKey));
        if(!data){
            // Response validation for integer parameters (if provided)
            const size = {};
            if (minSize !== undefined && maxSize !== undefined) {
                const minSizeInt = parseInt(minSize);
                const maxSizeInt = parseInt(maxSize);
                if (isNaN(minSizeInt) || isNaN(maxSizeInt) || minSizeInt < 0 || maxSizeInt < 0) {
                    throw new Error('Size values must be non-negative integers');
                }
                size.minimum = minSizeInt;
                size.maximum = maxSizeInt;
            }

            const rent = {};
            if (minRent !== undefined && maxRent !== undefined) {
                const minRentInt = parseInt(minRent);
                const maxRentInt = parseInt(maxRent);
                if (isNaN(minRentInt) || isNaN(maxRentInt) || minRentInt < 0 || maxRentInt < 0) {
                    throw new Error('Rent values must be non-negative integers');
                }
                rent.minimum = minRentInt;
                rent.maximum = maxRentInt;
            }

            if (bathrooms !== undefined) {
                const bathroomsInt = parseInt(bathrooms);
                if (isNaN(bathroomsInt) || bathroomsInt < 0) {
                    throw new Error('Bathrooms value must be a non-negative integer');
                }
            }

            if (bedrooms !== undefined) {
                const bedroomsInt = parseInt(bedrooms);
                if (isNaN(bedroomsInt) || bedroomsInt < 0) {
                    throw new Error('Bedrooms value must be a non-negative integer');
                }
            }

            // Response validation for string parameters (if provided)
            if (typeof area !== 'undefined' && typeof area !== 'string' ||
            typeof furnishing !== 'undefined' && typeof furnishing !== 'string') {
                throw new Error('String values must be provided for optional parameters');
            }


            data = await db.getLeasesByCityAndFilters(city, area, { rent, size,
                furnishing, bathrooms, bedrooms });
            
            // cache the data
            cache.put(cacheKey, JSON.stringify(data), 2592000);
        }
        res.json({'response':data});
      
    }catch(err){
        res.status(400).send({'error': err.message});
      
    }
});


module.exports = {
    leasesRouter: router
};
