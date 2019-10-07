const express = require('express')
var webp = require('webp-converter')
const path = require('path')
const fs = require('fs')
const app = express()
const port = 3333

const IMG_PATH = "/PATH/TO/pics"

// Define the catch-all interface
app.get('/*',function(req,res){
		// Get requested URL and concatenate absolute path and URL
        var requested_img_path = path.join(IMG_PATH, req.originalUrl);

        var cache_path = path.join(__dirname,"webp/" + path.dirname(req.originalUrl));
		console.log("CACHE PATH is " + cache_path)
        var cache_image_path = path.join(__dirname,"webp/" + req.originalUrl.split(".")[0] + ".webp");

		// Make Cache path for the processed images
        if(!fs.existsSync(cache_path)){
                fs.mkdirSync(cache_path, { recursive: true });
        }

		// Hit Cache, then just send the processed images
        if(fs.existsSync(cache_image_path)){
                console.log("Sending")
                res.sendFile(cache_image_path)
                return;
        }

        var webp_image = webp.cwebp(requested_img_path,cache_image_path,"-q 80",function(status,error){
                res.sendFile(cache_image_path);
                console.log("Convert" + requested_img_path);
                console.log(status,error);
        })
})
app.listen(port, () => console.log(`WebP Server is listening on port ${port}!`))
