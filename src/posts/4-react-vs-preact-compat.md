_04-04-2022_

[#bundle](tags/bundle) [#react](tags/react) [#preact](tags/preact)

# React vs Preact-Compat

After my researches of the bundle size in my project I discovered that React could be much thinner.

Lets say you want to reduce the size of your React application bundle but are unable to do so by rewriting it from scratch. In that case, we could make use of Preact.

From Preact docs:

> "preact/compat is our compatibility layer that allows you to leverage the many libraries of the React ecosystem and use them with Preact. This is the recommended way to try out Preact if you have an existing React app."
>
> This lets you continue writing React/ReactDOM code without any changes to your workflow or codebase. preact/compat adds somewhere around 2kb to your bundle size, but has the advantage of supporting the vast majority of existing React modules you might find on npm. The preact/compat package provides all the necessary tweaks on top of Preact's core to make it work just like react and react-dom, in a single module.

## Prerequisites

Two applications with similar dependencies and structure:

### Tree

<pre ><code class="language-treeview">./
├── babel.config.json
├── build/
│   ├── index.html
│   ├── main.4c94aceb27c29959a169.js
│   ├── runtime.d5b2777fc3d7bae93dd6.js
│   └── vendors.1f63b7513a29442d44a2.js
├── package.json
├── pnpm-lock.yaml
├── public/
│   └── index.html
├── src/
│   ├── App.jsx
│   └── index.jsx
└── webpack.config.js
</code></pre>

### Dependencies

```json
{
  "scripts": {
    "build": "rimraf build && webpack --config webpack.config.js"
  },
  "dependencies": {
    // ...skip for now...
  },
  "devDependencies": {
    "@babel/core": "^7.17.8",
    "@babel/preset-env": "^7.16.11",
    "@babel/preset-react": "^7.16.7",
    "babel-loader": "^8.2.4",
    "html-webpack-plugin": "^5.5.0",
    "rimraf": "^3.0.2",
    "terser-webpack-plugin": "^5.3.1",
    "webpack": "^5.71.0",
    "webpack-cli": "^4.9.2"
  }
}
```

## React

Assume you're working with react, react-dom, and react-router v6:

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "6"
  }
}
```

Also we need `index.jsx` and `App.jsx` files:

### index.jsx

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App.jsx';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
);
```

### App.jsx

```jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';

export const App = () => (
  <>
    React
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </>
);

const Home = () => <>Home page</>;
```

## Preact

We'll use the same setup as above, but we'll replace react with preact:

1. Move react, react-dom to the devDependencies
2. Install preact and preact-compat

```json
{
  "dependencies": {
    "preact": "^10.7.0",
    "preact-compat": "^3.19.0",
    "react-router-dom": "6"
  }
}
```

3. Add preact [aliases](https://preactjs.com/guide/v8/switching-to-preact/#aliasing-via-webpack) to the webpack config

```js
module.exports = () => {
  return {
    // ...config...
    resolve: {
      extensions: ['.js', 'jsx'],
      alias: {
        react: 'preact/compat',
        'react-dom': 'preact/compat',
      },
    },
  };
};
```

During build webpack will replace react with preact/compat.

## Bundle size

We could measure `build` folder size via `disk usage` util.

```bash
du -sh build
```

I measured the size with and without router.

Keep in mind that average size of the index.html ~ 4K.

|  Options   | React | Preact |      Diff       |
| :--------: | :---: | :----: | :-------------: |
| w/o router | 144K  |  24K   | 144 - 24 = 120K |
| w/ router  | 152K  |  36K   | 152 - 36 = 116K |

## Conclusion

As you can see, adding preact/compat to your project can save you over 100K. There may be a build time benefit because we need to process less code.
Webpack logs can be found in the `build.log` file in the source code repository.

Check out the links listed below.

## Links

- [Source code](https://github.com/old-skull/react-vs-preact-compat)
- [React + Preact Compat starter kit](https://github.com/old-skull/react-webpack-starter-kit)
- [Preact Docs](https://preactjs.com/)
