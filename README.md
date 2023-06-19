# share-and-save
Web application to manage and analyze household accounts

## Installing app
1. Install Node.js and MariaDB / MySQL (and optionally, Apache Server)
2. Clone git repository
3. Import /sql/database.sql into phpMyAdmin / MySQL Workbench. Database is now ready and contains all necessary base data:
* Web user with admin privileges: shareandsave.app@gmail.com / shareandsave
* Default categories and places
4. Both on project root folder (/) and /client, run:
```shell
npm install
```


## Running app

### Starting Node.js express server
To automatically compile Typescript and then start Node.js express server (localhost:3001), on root folder run:
```shell
npm start
```

### React front-end in development mode
To start React development server, on /client folder run:
```shell
npm start
```
In development mode, the app is accessible locally via http://localhost:3000 since React development server has to be used. Fetch calls are automatically forwarded to Node.js server at port 3001.

### Production
To build a production copy of React app, on /client folder run:
```shell
npm run build
```
In production mode, the app is accessible locally via http://localhost:3001

### Optional: Using Apache to reverse proxy the app
Apache Server can be used to listen on port 80 for HTTP requests and redirect them to our express server. A virtual host can be configured accordingly:
```editorconfig
<VirtualHost *:80>
    ServerName www.share-and-save.app
    ProxyRequests Off
    ProxyVia Full
    ProxyPreserveHost On
    ProxyPass / http://localhost:3001
    ProxyPassReverse / http://localhost:3001
    <Proxy *>
        Require all granted
    </Proxy>
    Header set Access-Control-Allow-Origin "*"
</VirtualHost>
```
The following modules have to be enabled:
- LoadModule rewrite_module modules/mod_rewrite.so
- LoadModule proxy_module modules/mod_proxy.so
- LoadModule proxy_http_module modules/mod_proxy_http.so
- LoadModule proxy_connect_module modules/mod_proxy_connect.so

Apply this configuration by restarting Apache.