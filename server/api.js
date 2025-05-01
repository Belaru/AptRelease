const express = require('express');
const path = require('path');
const compression = require('compression');
const fileUpload = require('express-fileupload');
const { OAuth2Client } = require('google-auth-library');
const session = require('express-session');
const {DB} = require('./db/db.js');

const { leasesRouter } = require('./routes/leases.js');
const { leaseUploadRouter } = require('./routes/lease-upload.js');
const { filtersRouter } = require('./routes/filters.js');
const { coordinatesRouter} = require('./routes/coordinates.js');
const {leaseReport} = require('./routes/lease-reports.js');
const {leaseDelete} = require('./routes/lease-delete.js');
const {userProfileRouter} = require('./routes/user-profile.js');

  
const _filename = 
__filename || typeof require !== 'undefined' && require('url').fileURLToPath || '';


const app = express();

// Add middleware to serve static files
app.use(
    express.static(path.join(path.dirname(_filename), '..', 'client', 'build'), {
        setHeaders: (res, path) => {
            // Set cache control headers only for image files
            if (path.endsWith('.webp') || 
            path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.jpn')) {
                // cache for 30 days
                res.setHeader('Cache-Control', 'public, max-age=2592000'); 
            }
        }
    })
);

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to compress data
app.use(compression());

app.use(
    fileUpload({
        createParentPath: true,
    })
);

// Used to salt the hash---change periodically
// resave, saveunitialized??
app.use(session({
    secret: 'shhh',
    // resave: false,
    // saveUninitialized: true
}));


// Use releases router
app.use('/leases/', leasesRouter);
app.use('/coordinate/', coordinatesRouter);
app.use('/filters/', filtersRouter);
app.use('/leaseUpload/', leaseUploadRouter);
app.use('/leaseReport/', leaseReport);
app.use('/leaseDelete/', leaseDelete);
app.use('/userProfile/', userProfileRouter);


/**
 * Swagger
 */

const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');

// Swagger leases definition
const swaggerLeasesDocument = YAML.load('./routes/leases-swagger.yaml');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerLeasesDocument));


// Add a POST API endpoint for login with token verification
app.post('/login', async (req, res) => {
    const { idToken } = req.body;
  
    // console.log('Received token:', idToken);

    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const client = new OAuth2Client(clientId);
  
    try {
    // Call the verifyIdToken to verify and decode the token
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: clientId,
        });
  
        // Get the JSON with all the user info
        const payload = ticket.getPayload();

        const db = new DB();

        let user = await db.findUser(payload.email);

        if (!user) {
        // If the user doesn't exist, create a new user in the database
            user = await db.createUser({
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
                leases: null
            });
        } else {
        // If the user already exists, update their information
            user.name = payload.name;
            user.picture = payload.picture;
            await user.save();
        }

        // Store userId in the session
        req.session.userId = payload.email;


        res.status(201).json({ message: 'Login successful', data: payload });
    
    } catch (error) {
        // console.error('Token verification failed:', error.message);
        res.status(401).json({ message: 'Login failed', error: error.message });
    }
});


app.delete('/logout', async(req, res) => {
    try {
        await req.session.destroy();
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// get api for restricted access
app.get('/restrictedAccess', (req, res) => {
    if (req.session.userId){
        res.status(200).json({ userId: req.session.userId });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});



app.use((req, res) => {
    res.status(404).json({ message: '404 - Not Found' });
});

module.exports = { app };

