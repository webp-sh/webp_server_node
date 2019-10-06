const express = require('express')
var webp = require('webp-converter')
const path = require('path')
const fs = require('fs')
const app = express()
const port = 3000


app.get('/*',function(req,res){
	var requested_img_path = path.join(__dirname, req.originalUrl);
	var store_path = path.parse(requested_img_path)

	var cache_path = path.join(__dirname,"webp/" + req.originalUrl.split(".")[0] + ".webp");
	if(fs.existsSync(cache_path)){
		res.sendFile(cache_path)
		return;
	}
	console.log(cache_path);
	
	var webp_image = webp.cwebp(requested_img_path,cache_path,"-q 80",function(status,error){
		res.sendFile(cache_path);
		console.log("Convert" + requested_img_path);
		console.log(status,error);
	})

})
app.listen(port, () => console.log(`WebP Server listening on port ${port}!`))
