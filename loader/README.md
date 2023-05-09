# Anchor Loader

## Overview

- `Anchor Loader` is an application which can load target `Anchor Application` on `Anchor Network` . More details about `Anchor Application`, you can get the details here : [https://github.com/ff13dfly/EasyPolka](https://github.com/ff13dfly/EasyPolka).

## Implements

- The program language is not limited.

### Javascript

#### How To Run

- `Anchor Loader` can be run both local or on web server.

- Parameters for `Anchor Loader`. Hash is used to sent parameters to Loader.

    ```JAVASCRIPT
        #[anchor name]@[anchor node]
        //#anchor_name@ws://127.0.0.1:9944
    ```

#### How To Build Your Own Loader

- If you want to customize your `Anchor Loader`, such as modify the default Anchor or default node, please follow this instructment. The tools is needed. The target `Anchor Application` should be `React` project.
    1. Node.js
    2. Esbuild

- `Node.js` is needed to create the entry file, default is `loader.html`.

- `Esbuild` is the default package application, please install it first of all. More details about Esbuild, you can check [https://esbuild.github.io/api/](https://esbuild.github.io/api/).

    ```SHELL
        # install esbuild
        yarn add esbuild
    ```

- Minify the Loader code.

    ```SHELL
        # minify the loader JS
        ../node_modules/.bin/esbuild react_loader.js --bundle --minify --outfile=loader.min.js
    ```

- Combine the JS code and HTML.

    ```SHELL
        # minify the loader JS
        node react_to_single.js
    ```
