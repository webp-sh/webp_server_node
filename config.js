const config = {
    IMG_PATH: "/PATH/TO/pics",
    SECRET: '123456',
    PORT: '3333',
    HOST: '0.0.0.0',
    LOCAL: true,
    CMD:"cd /opt/webp_server;git pull;sudo /bin/systemctl restart webp"
};

module.exports = config;