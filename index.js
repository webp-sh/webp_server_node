const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const {exec} = require('child_process');

const express = require('express');
const bodyParser = require('body-parser');
const webp = require('webp-converter');

const config = require('./config');
const app = express();

const HOST = config.HOST;
const PORT = config.PORT;
const IMG_PATH = config.IMG_PATH;

// enable json support
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({
    extended: true
}));


// Define the catch-all interface
app.get('/*', (req, res) => {
    // check local first
    if (config.LOCAL && ['127.0.0.1', '::1', 'localhost'].indexOf(req.ip) === -1) {
        res.send("Opps! Not allowed to access webp server directly.");
        return;
    }
    // Get requested URL and concatenate absolute path and URL
    let requested_img_path = path.join(IMG_PATH, req.originalUrl);
    let ua = req.headers['user-agent'];

    // Check if its Safari, and send the original image
    console.log("UA is " + ua);
    if (ua.includes('Safari') && !ua.includes('Chrome') && !ua.includes('Firefox')) {
        console.log("Gotcha Safari!");
        res.sendFile(requested_img_path);
        return;
    }

    let cache_path = path.join(__dirname, "webp/" + path.dirname(req.originalUrl));
    console.log("CACHE PATH is " + cache_path);
    let cache_image_path = path.join(__dirname, "webp/" + req.originalUrl.split(".")[0] + ".webp");

    // Make Cache path for the processed images
    if (!fs.existsSync(cache_path)) {
        fs.mkdirSync(cache_path, {
            recursive: true
        });
    }

    // Hit Cache, then just send the processed images
    if (fs.existsSync(cache_image_path)) {
        console.log("Sending");
        res.sendFile(cache_image_path);
        return;
    }

    let webp_image = webp.cwebp(requested_img_path, cache_image_path, "-q 80", function (status, error) {
        res.sendFile(cache_image_path);
        console.log("Convert" + requested_img_path);
        console.log(status, error);
    })
});


// GitHub webhook
const createComparisonSignature = (body, secret) => {
    const hmac = crypto.createHmac('sha1', secret);
    return hmac.update(JSON.stringify(body)).digest('hex');
};
const compareSignatures = (signature, comparison_signature) => {
    const source = Buffer.from(signature);
    const comparison = Buffer.from(comparison_signature);
    return crypto.timingSafeEqual(source, comparison); // constant time comparison
};

app.post('/hook', (req, res) => {

    let payload = req.body;
    let gh = req.headers['x-hub-signature'].split('=')[1];

    const me = createComparisonSignature(payload, config.SECRET);
    if (compareSignatures(me, gh)) {
        res.send('Valid request from Github. Updating now...');
        exec(config.CMD, (err, stdout, stderr) => {
            console.log(stdout)
        });

    } else {
        res.send('Invalid signature.')
    }

});


app.listen(PORT, HOST, () => console.log(`WebP Server is listening on http://${HOST}:${PORT} !`));
