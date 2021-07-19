# Ant Dashboard

[![](https://img.shields.io/badge/made%20by-Swarm-blue.svg?style=flat-square)](https://swarm.ethereum.org/)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)
![](https://img.shields.io/badge/npm-%3E%3D6.0.0-orange.svg?style=flat-square)
![](https://img.shields.io/badge/Node.js-%3E%3D10.0.0-orange.svg?style=flat-square)

> An app which helps users to setup their Bee node and do actions like cash out cheques, upload and download files or manage your postage stamps.

**Warning: This project is in alpha state. There might (and most probably will) be changes in the future to its API and working. Also, no guarantees can be made about its stability, efficiency, and security at this stage.**

![Status page](/ui_samples/status.png)

| Node Setup | Browse & Upload Files | Accounting | Peers | Settings |
|-------|---------|-------|----------|------|
| ![Setup](/ui_samples/node_setup.png) | ![Files](/ui_samples/file_upload.png) | ![Accounting](/ui_samples/accounting.png) | ![Peers](/ui_samples/peers.png) | ![Settings](/ui_samples/settings.png) |


## Usage

:warning: To successfully connect to the ant node, you will need to enable the Debug API and CORS. You can do so by setting `cors-allowed-origins: ['*']` and `debug-api-enable: true` in the Bee config file and then restart the Bee node. 


### Development

```sh
git clone git@github.com:ethsana/ant-dashboard.git

cd  ant-dashboard

npm i

npm start
```

The Ant Dashboard runs in development mode on [http://localhost:3031/](http://localhost:3031/)


## License

[BSD-3-Clause](./LICENSE)
