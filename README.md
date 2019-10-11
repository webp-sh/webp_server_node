# WebP Server

**THIS PROJECT IS UNDER EARLY DEVELOPMENT, DON'T USE IT ON PRODUCTION ENVIRONMENT.**

![](./pics/webp_server.png)

This is a NodeJS Server based on Express and cwebp, which allows you to serve WebP images on the fly.

> e.g When you visit `https://a.com/1.jpg`，it will serve as `image/webp` without changing the URL.
>
> For Safari and Opera users, the original image will be used.

## Usage

Make sure I've installed `node` on your system, and the version of it shall be greater than 10.

1. Clone the repo and run `npm install` in it.
2. Make Sure you've install pm2, if not, use `npm install pm2 -g`
3. Define your pics folder on `index.js` (for instance there is a `1.jpg` in the related pic folder):
	```
	const IMG_PATH = "/PATH/TO/pics"
	```
4. Run the APP with `pm2 start ecosystem.config.js --env production`, as this is a temporary solution to suppress errors, this should be fixed on later commits.
5. Let Nginx to `proxy_pass http://localhost:3333/;`

## Detailed deploy instruction on a systemd based distros
The following examples is tested under Ubuntu 18.04.
### 1. Install node
```shell script
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
```
### 2. Clone and install deps
Refer to the previous usage section.
### 3. Add users
```shell script
useradd -s /usr/sbin/nologin webp
groupadd webp
chown webp:webp -R /opt/webp_server/
```
### 4. systemd service
```shell script
cp ./webp.service /lib/systemd/systemd/
systemctl daemon-reload
systemctl enable webp.service
systemctl start webp.service
```
### 5. Nginx configuration
Suppose you're using Wordpress and would like to serve Media images locate and edit your nginx configuration as follows
```
location ^~ /wp-content/uploads/ {
        proxy_pass http://127.0.0.1:3333;
}
```
where `wp-content/uploads` is your image path.
