const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => { 
    res.send('Silence is Golden!'); 
});

// send payload to GRA
app.post("/", async (req, res) => {
    const payload = req.body;
    const { endpoint, security_key, path } = req.headers;
    
    try {
        if (endpoint) {
            const headers = { 'Content-Type': 'application/json' };
            if (security_key) { headers['security_key'] = security_key }            
            const response = await axios.post(`${endpoint+"/"+path}`, payload, { headers: headers });
            console.log(response.data);
            res.status(200).json(response.data);
        }
        else {
            console.log("Endpoint", endpoint + " not provided!");
            res.status(400).json({ message: "Endpoint not provided" });
        }
    }
    catch (error) {
        console.log(`Error sending payload: ${error}`);
        res.status(500).json({ status: 'error', message: error.message});
    }
});

// run server
app.listen(7500, () => {
    console.log(`Server is active on port 7500`);
});
