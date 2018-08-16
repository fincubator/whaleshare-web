
# whaleshares-web

A fork of Steemit Condenser for web interface of Whaleshares blockchain.


## Getting started

```bash
export SDC_DATABASE_URL="mysql://root:password@127.0.0.1/steemit_dev"

git clone https://gitlab.com/beyondbitcoin/whaleshares-web.git
cd whaleshares-web
mkdir tmp
```

Edit the file `src/db/config/config.json`

Run `sequelize db:migrate` in `src/db` directory, like this:

```bash
cd src/db
yarn exec sequelize db:migrate
```


Start in dev mode:
```bash
yarn
yarn start
```


## Issues

To report a non-critical issue, please file an issue on this [project issue](https://gitlab.com/beyondbitcoin/whaleshares-web/issues).

If you find a security issue please report details to: mail@whaleshares.net
