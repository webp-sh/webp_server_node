# WebP Server

**THIS PROJECT IS UNDER EARLY DEVELOPMENT, DON'T USE IT ON PRODUCTION ENVIORMENT.**

This is a NodeJS Server based on Express and cwebp, which allows you to serve WebP images on the fly.

> e.g When you visit `https://a.com/1.jpg`，it will serve as `image/webp` without changing the URL.

## Usage

1. Clone the repo and run `npm install` in it.
2. Make Sure you've install pm2, if not ,use `npm install pm2 -g`
3. Define your pics folder on `index.js` (for instance there is a `1.jpg` in the related pic folder):
	```
	const IMG_PATH = "/PATH/TO/pics"
	```
4. Run the APP with `pm2 start ecosystem.config.js --env production`.
5. Let Nginx to `proxy_pass http://localhost:3333/;`
