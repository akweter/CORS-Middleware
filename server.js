const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', async (req, res) => { 
    const browserOutput = `
    <html>
        <head>
            <title>CORS Proxy Middleware</title>
            <link rel="icon" href="https://avatars.githubusercontent.com/u/71665600?v=4" />
        </head>
        <body style="padding: 0 10%;">
            <h1> <u> CORS Proxy Middleware </u></h1>
            <cite>Make POST & GET request to <a href="http://localhost:7100">this url</a></cite>

            <h2>Getting Started.</h2>
            
            <kbd>
                <ol>
                    <li><strong>endpoint</strong> - <emp>Here is where your requets is going</emp></li>
                    <li><strong>path</strong> -  Path for the request </li>
                    <li><strong>security_key</strong> - <del>This is only when applicable</del> </li>
                    <li><strong>payload </strong> - Request body </li>
                </ol>
            </kbd>
            <p/>

            <big>POST</strong>
            <table border="1" width="50%">
                <thead>
                    <tr>
                        <td>
                            <strong>HEADER</strong>
                        </td>
                        <td>
                            <strong>BODY</strong>
                        </td>
                        <td>
                            <strong>PARAMS</strong>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>endpoint</strong></td>
                        <td><strong>payload</strong></td>
                        <td><strong>path</strong></td>
                    </tr>
                </tbody>
            </table> <br />
            <small><strong>path</strong> may be applicable in some cases.</small>
            <p/>

            <big>GET</strong></big>
            <kbd>
                <ol>
                    <li>Do Not pass body for get request.</li>
                    <li>Make get request to <strong>/app</strong> following your path</li>
                </ol>
            </kbd>

            <h3><u>Example Request</u></h3>
            <code>
            fetch(http://localhost:7100/blog, payload, {
                method: "POST",
                headers: {
                    endpoint: "https://unclejamie.tech"
                    security_key: {value}
                }
            });
            </code>
            <ul>
                <li>Here, a request is made to https://unclejamie.tech/blog with security key in the header.</li>
                <li>No need to pass set other headers.</li>
                <li>If security key is not applicable, just leave it!</li>
            </ul>

            <br/>

            Connect with the developer via <a href="mailto:jamesakweter@gmail.com">email</a>
        </body>
    </html>
    `;
    res.status(200).send(browserOutput);
});

// send payload to GRA
app.post("/:id", async (req, res) => {
    const payload = req.body;
    const path = req.path;
    const { endpoint, security_key, } = req.headers;
    
    try {
        if (endpoint) {
            const headers = { 'Content-Type': 'application/json' };
            if (security_key) { headers['security_key'] = security_key }            
            const response = await axios.post(endpoint+'/'+path, payload, { headers: headers });
            console.log("Successful", response.status);
            res.status(200).json(response.data);
        }
        else {
            console.log("Endpoint: (",endpoint,") not provided!");
            res.status(400).json({ message: "Endpoint not provided" });
        }
    }
    catch (error) {
        if (error.response) {
            console.log(error.response.data);
            res.status(500).json({ status: 'error', message: 'You have error, check the console.'});
        }
        else if (error.request) {
            console.log(`No response received from the server for request: ${error.request.data} `);
            res.status(500).json({ status: 'error', message: 'You have error, check the console.' });
        }
        else {
            console.log(`Error ${error}`);
            res.status(500).json({ status: 'error', message: 'You have error, check the console.' });
        }
    }
});

app.listen(7100, async () => {
    console.log(`Server is active on port 7100`);
    exec('start http://localhost:7100', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });
});