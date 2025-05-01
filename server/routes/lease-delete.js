const express = require('express');
const router = express.Router();
const {DB} = require('../db/db');
const cache = require('memory-cache');

const idRegex = /^[a-f\d]{24}$|^\d{1,12}$|^(?:(?:[0-9a-fA-F]{2}){12})$/;

router.delete('/:leaseId', async (req, res) => {
    const leaseId = req.params.leaseId;
    const userEmail = req.body.email;

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

        // Delete the lease
        await db.deleteLease(leaseId);

        const user = await db.findUser(userEmail);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // delete lease from user
        user.leases = user.leases.filter(lease => !lease._id.equals(leaseId));
        await user.save();


        // cache control
        cache.del(`leases`);
        const cityCachePattern = `leases:${lease.city}:*`;
        cache.keys(cityCachePattern).forEach(key => {
            cache.del(key);
        });

        res.status(200).json({ message: 'Lease deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = {
    leaseDelete: router
};