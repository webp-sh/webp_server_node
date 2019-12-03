<p align="center">
	<img src="./pics/webp_server.png"/>
</p>

**THIS PROJECT IS UNDER DEVELOPMENT, DON'T USE IT ON PRODUCTION ENVIRONMENT.**

This is a NodeJS Server based on Express and cwebp, which allows you to serve WebP images on the fly.

> e.g When you visit `https://a.com/1.jpg`，it will serve as `image/webp` without changing the URL.
>
> For Safari and Opera users, the original image will be used.

## Usage(Docker)

If you've docker installed, you can try build the package by doing as follows(don't worry, it's simple):

1. Download the `docker-compose.yml` file to a folder you like, let's say `/home/nova/server1/`.
2. Edit the `docker-compose.yml`, at line 10 `./INTAKE` to the directory which contains your images.
3. run `docker-compose up -d` in that folder, this will run WebP Server with some parameters written in the `docker-compose.yml` and create the related folders.
4. Configure a NGINX server to reverse proxy it for public use.

That't it, the supervision and fail-over is handled by Docker Daemon, no more PM2s or NPMs are needed, Yay!

> Or, if you like the traditional way, see below.

## Usage(Traditional)

Make sure you've installed `node` on your system, and the version of it shall be greater than 10, it will convert `jpg,jpeg,png` files by default, this can be customized by editing the `config.js`.

1. Clone the repo and run `npm install` in it.
2. Make Sure you've install pm2, if not, use `npm install pm2 -g`
3. Define your pics folder on `config.js` (for instance there is a `1.jpg` in the related pic folder):
	```
	IMG_PATH: "/PATH/TO/pics",
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
