const express = require('express');
const router = express.Router();
const {DB} = require('../db/db');
const cache = require('memory-cache');

const idRegex = /^[a-f\d]{24}$|^\d{1,12}$|^(?:(?:[0-9a-fA-F]{2}){12})$/;

router.post('/:leaseId', async (req, res) => {
    const leaseId = req.params.leaseId;

    if (!idRegex.test(leaseId)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }
    try {
        // Fetch the lease from the database
        const db = new DB();
        const lease = await db.findLeaseById(leaseId);

        if (!lease) {
            return res.status(404).json({ error: 'Lease not found' });
        }

        // Increment the reports field
        lease.reports = (lease.reports || 0) + 1;

        await db.updateLease(leaseId, lease);


        // cache control
        cache.del(`leases`);
        const cityCachePattern = `leases:${lease.city}:*`;
        cache.keys(cityCachePattern).forEach(key => {
            cache.del(key);
        });
        res.status(200).json({ message: 'Reports field incremented successfully', lease });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = {
    leaseReport: router
};