# NEXT JS w. VEDA UI

This is a test NEXT JS instance to understand the requirement for [VEDA-UI](https://github.com/nasa-IMPACT/veda-ui) to be used with a NEXT JS instance.

This repo is based on Portfolio Blog starter from NEXT JS: <https://portfolio-blog-starter.vercel.app>

## Installation and Usage

### Install Project Dependencies

Ensure the following are installed on your system:

- [Node.js](http://nodejs.org/) (version is specified in the [.nvmrc](.nvmrc) file)
- [Yarn](https://yarnpkg.com/)

If you’re using [`nvm`](https://github.com/creationix/nvm), activate the required Node.js version by running:

```sh
nvm install
```

### Register the VEDA-UI Package

The `VEDA-UI` package is hosted on a Verdaccio instance during its experimental phase. To successfully install it, you must scope `@developmentseed/veda-ui` to the Verdaccio instance.

Run the following command before installing other dependencies:

```sh
yarn config set @developmentseed:veda-ui http://verdaccio.ds.io:4873/
```

### Install Dependencies

Install the project dependencies by running:

```sh
yarn install
```

### Start the Development Server

To start the development server, run:

```sh
yarn dev
```

The website will then be accessible at <http://localhost:3000>.

## License

[MIT](LICENSE)
