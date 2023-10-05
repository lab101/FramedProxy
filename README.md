# FramedProxy
OSC to websocket proxy for the Framed project


Used with the framed software.\
Install the latest node.js version.\
\
run the following command in the console\
\
first time\
**npm install**\
\
When succesfull run\
**node index.js**





settings if you want to setup your own nginx proxy through port 80 with forwarding the original ip
server {
    listen 80;
    server_name framedproxy.lab101.be;

    location / {
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass_request_headers on;

        proxy_cache_bypass $http_upgrade;

        proxy_pass http://localhost:6006;
    }
}