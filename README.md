# WebP Server

**THIS PROJECT IS UNDER EARLY DEVELOPMENT, DON'T USE IT ON PRODUCTION ENVIORMENT.**

This is a NodeJS Server based on Express and cwebp, which allows you to serve WebP images on the fly.

> e.g When you visit `https://a.com/1.jpg`，it will serve as `image/webp` without changing the URL.

## Usage

Define your pics folder on `index.js` (for instance there is a `1.jpg` in the related pic folder):

```
const IMG_PATH = "/PATH/TO/pics"
```

run the APP and let Nginx to `proxy_pass http://localhost:3000/;`
