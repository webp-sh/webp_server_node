const path = require('path');
const fs = require('fs');

const express = require('express');
let webp = require('webp-converter');

const config = require('./config');
const PORT = config.PORT;
const HOST = config.HOST;
const ALLOWED_TYPES = config.ALLOWED_TYPES;
let IMG_PATH = config.IMG_PATH;
if (process.argv.length === 3)
    IMG_PATH = process.argv[2];


const app = express();

// Define the catch-all interface
app.get('/*', (req, res) => {
    // Get requested URL and concatenate absolute path and URL
    let requested_img_path = path.join(IMG_PATH, req.originalUrl); // Will get /PATH/TO/pics/images/tsuki.jpg

    // Check allowed file extensions
    let file_extension = path.extname(req.originalUrl).split('.')[1].toLowerCase();
    if (!ALLOWED_TYPES.includes(file_extension)) {
        res.status(500).send("File Not Allowed.");
    }

    let cache_path = path.join(__dirname, "webp/" + path.dirname(req.originalUrl)); // Will get /PATH/TO/webp_server/webp/images
    let cache_img_path = path.join(__dirname, "webp/" + req.originalUrl.split(".")[0] + ".webp"); // Will get /PATH/TO/webp_server/webp/images/tsuki.webp

    // Check the original image for existence
    if (!fs.existsSync(requested_img_path)) {
        // The original image doesn't exist, check the webp image, delete if processed.
        if (fs.existsSync(cache_img_path)) {
            fs.unlink(cache_img_path);
        }
        res.status(404).send("Not Found.");
    }

    // Check if its Safari, and send the original image
    let ua = req.headers['user-agent'];
    console.log("UA is " + ua);
    if (ua.includes('Safari') && !ua.includes('Chrome') && !ua.includes('Firefox')) {
        console.log("Gotcha Safari!");
        res.sendFile(requested_img_path);
        return;
    }

    // Make Cache path for the processed images
    if (!fs.existsSync(cache_path)) {
        fs.mkdirSync(cache_path, {
            recursive: true
        });
    }

    // Hit Cache, then just send the processed images
    if (fs.existsSync(cache_img_path)) {
        console.log("Sending");
        res.sendFile(cache_img_path);
        return;
    }

    let webp_image = webp.cwebp(requested_img_path, cache_img_path, "-q 80", function (status, error) {
        res.sendFile(cache_img_path);
        console.log("Convert" + requested_img_path);
        console.log(status, error);
    })
});


app.listen(PORT, HOST, () =>
    console.log(`WebP Server is listening on http://${HOST}:${PORT} with ${IMG_PATH}`));
