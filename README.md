# Precious Plastic Network

Building a database of plastic recyclers (https://map.preciousplastic.com)

## Development

Install Node.JS (All OS)

https://nodejs.org/en/download/package-manager/

Check instalation
```sh
$ nodejs -v
v6.9.5 (or higher)
$ npm -v
4.2.0 (or higher)
```

Clone repository
```sh
$ git clone git@github.com:hakkens/precious-plastic-map.git
```

Install gulp-cli
```sh
$ npm install gulp-cli -g
```

Go to the folder and install dependencies
```sh
$ npm install
```

Execute this npm scripts
```sh
$ npm run build-css-libs
```

Run this while you are working
```sh
$ npm run watch-js
```
```sh
$ gulp
```

Use your favorit tool to render the site:

```sh
$ python -m SimpleHTTPServer 8000

# open your web browser to localhost:8000/map.html
```

```sh
$ ruby -run -e httpd . -p 8000

# open your web browser to localhost:8000/map.html
```
