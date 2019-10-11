const path = require('path');
const fs = require('fs');

const express = require('express');
let webp = require('webp-converter');

const config = require('./config');
const PORT = config.PORT;
const HOST = config.HOST;
const IMG_PATH = config.IMG_PATH;


const app = express();

// Define the catch-all interface
app.get('/*', (req, res) => {
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

app.listen(PORT, HOST, () => console.log(`WebP Server is listening on http://${HOST}:${PORT}!`));
