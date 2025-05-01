/* eslint-disable no-console */
// require('dotenv').config();
require('dotenv').config({path:require('find-config')('.env')});
const dbUrl = process.env.ATLAS_URI;
const mongoose = require('mongoose');
const { leases, users } = require('./schemas');

let instance;

/**
 * Represents a MongoDB database connection.
 */
class DB{
    
    constructor() {
        if (!instance) {
            instance = this;
            this.db = null;
        }
        return instance;
    }

    async connect() {
        if (instance.db) {
            return;
        }
        await mongoose.connect(dbUrl);
        instance.db = mongoose.connection;
        instance.db.on('error', console.error.bind(console, 'connection error:'));
        instance.db.once('open', function () {
            // eslint-disable-next-line no-console
            console.log('Successfully connected to MongoDB database ');
        });
    }

    async close() {
        await mongoose.connection.close();
        instance = null;
    }

    async open(dbname, collName) {
        try {
            await instance.connect(dbname, collName);
        } finally {
            await instance.close();
        }
    }

    async createManyLeases(data) {
        try{
            await this.connect();
            const result = await leases.insertMany(data);
            // console.log('Leases inserted successfully:', result);
            return result;
        } catch (error) {
            console.error('An error occurred while saving leases:', error);
        } 
    }
    
    async getAllLeases() {
        try{
            await this.connect();
            const apartmentList = await leases.find({}).select('-__v');
            return apartmentList;
        } catch (error) {
            console.error('An error occurred while retrieving leases:', error);
        } 
    }
    async getAllFilterList(filter) {
        try{
            await this.connect();
            const filterList = await leases.distinct(filter);
            return filterList;
        } catch (error) {
            console.error('An error occurred while retrieving leases:', error);
        } 
    }
  
    async getLeasesByCityAndFilters(city, area, filters) {
        try{
            await this.connect();
            if (!city || typeof filters !== 'object') {
                throw new Error('Invalid input parameters');
            }
            const query = this.leaseQuery(city, area, filters);
            const releases = await leases.find(query).select('-__v');
            return releases;
        } catch (error) {
            console.error('An error occurred while retrieving leasess:', error);
        }
    }
    leaseQuery(city, area, filters){

        const query = { city: city};

        if (area) {
            query.areaType = area;
        }

        if (filters.furnishing) {
            query.furnishing = filters.furnishing;
        }
        if (filters.bathroom){
            query.bathroom = filters.bathroom;
        }
        if(filters.bedroom){
            query.bedroom = filters.bedroom;
        }
        // Add rent range query if both minimum and maximum are provided
        if (filters.rent && filters.rent.minimum !== undefined 
            && filters.rent.maximum !== undefined) {
            query.rentPrice = {
                $gte: filters.rent.minimum,
                $lte: filters.rent.maximum
            };
        }

        // Add size range query if both minimum and maximum are provided
        if (filters.size && filters.size.minimum !== undefined 
            && filters.size.maximum !== undefined) {
            query.size = {
                $gte: filters.size.minimum,
                $lte: filters.size.maximum
            };
        }
        return query;
    }

    async deleteMany() {
        try {
            await this.connect();
            await leases.deleteMany({});
        } catch (error) {
            console.error('An error occurred while deleting:', error);
        }
    }

    //FOR USERS
    async createUser(userData) {
        try {
            await this.connect();
            const result = await users.create(userData);
            console.log('User created successfully:', result);
            return result;
        } catch (error) {
            console.error('An error occurred while creating user:', error);
        }
    }

    async findUser(email) {
        try {
            await this.connect();
            const user = await users.findOne({email: email}).select('-__v');
            return user;
        } catch (error) {
            console.error('User could not be found:', error);
        }
    }

    
    async findLeaseById(leaseId) {
        try {
            await this.connect();
            const lease = await leases.findById(leaseId);
            return lease;
        } catch (error) {
            console.error('An error occurred while finding lease by ID:', error);
        }
    }
    
    async updateLease(leaseId, newlease) {
        try {
            await this.connect();
            let lease = await leases.findById(leaseId);
    
            if (!lease) {
                throw new Error('Lease not found');
            }
            // Update the reports field
            lease = newlease;
    
            // Save the updated lease back to the database
            await lease.save();
    
            return lease;
        } catch (error) {
            console.error('An error occurred while updating lease reports:', error);
        }
    }

    async deleteLease(leaseId) {
        try {
            await this.connect();
            const result = await leases.deleteOne({ _id: leaseId });
            if (result.deletedCount === 0) {
                throw new Error('Lease not found');
            }
            return result;
        } catch (error) {
            console.error('An error occurred while deleting the lease:', error);
            throw error;
        }
    }
    
}

module.exports = {DB};