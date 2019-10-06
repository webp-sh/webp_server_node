const express = require('express')
var webp = require('webp-converter')
const path = require('path')
const app = express()
const port = 3000


app.get('/*',function(req,res){
	var requested_img_path = path.join(__dirname, req.originalUrl);
	var store_path = path.parse(requested_img_path)

	var new_file_path = store_path['dir']+"/"+store_path['base']+".webp";
	
	var webp_image = webp.cwebp(requested_img_path,new_file_path,"-q 80",function(status,error){
		res.sendFile(new_file_path);
		console.log(status,error);
	})

})
app.listen(port, () => console.log(`WebP Server listening on port ${port}!`))
