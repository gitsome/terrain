# Perlin Noise Terrain Interactive Demo

A responsive progressive Perlin noise playground for 3D terrain generation.

This application can be pulled down and run locally. You can also pull it down, tweak it, build it, and host the build contents on a static server.

View the [LIVE DEMO HERE](https://johndavidfive.com/sites/terrain/index.html).

Read the article that goes along with this demo [HERE](https://medium.com/p/76f93da23601).

![screenshot of app](app.png)

## Dependencies

You will need NodeJS installed which ships with NPM.

## Startup

Once you have NodeJS and NPM run the following command within the `terrain-react-app` directory:
```bash
cd terrain-react-app
npm install
npm run start
```

That will install dependencies, start watches on files, and serve the application locally ( typically localhost:3000 ).

## Build for Deployment

To run a build which will generate the production `build` directory that can then be dropped into a static server, you will need to do two things:

1. Modify package.json and update the "hostname" property to point to the root of the host where the app will live.
2. Run the following command in your terminal:

```bash
cd terrain-react-app
npm install
npm run build
```

## Create React App Info

This app was bootstrapped using create-react-app. See the README.md file within terrain-react-app for more details.
