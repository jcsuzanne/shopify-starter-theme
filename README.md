
# Starter dev theme for Shopify 2.0 store


Using modern tools like Vite.js, TailwindCSS and Pieces.js, this starter will help you to build more efficient theme with local environment and Github integration




## Features

- [Shopify Vite](https://github.com/barrel/shopify-vite/tree/main)
- Tailwind.css
- Pieces.js
- Prettier Liquid
- [Tailwind Raw Reorder](https://marketplace.visualstudio.com/items?itemName=Trapfether.tailwind-raw-reorder)
- [Github Theme integration](https://shopify.dev/docs/storefronts/themes/tools/github)


## Run Locally


Clone the repository and go to the project directory

```bash
  cd my-project
```

Create `shopify.theme.toml` file

```bash
    [environments.development]
    store = "your-store"
    theme = "XXX"

    [environments.production]
    store = "your-store"
    theme = "XXX"
    ignore = ["templates/*", "config/*"]

```


Install dependencies

```bash
  yarn install
```

Start the server

```bash
  yarn dev
```


## Deployment

To deploy this project run, just push the modified files (assuming the theme is connected with [Github Integration](https://shopify.dev/docs/storefronts/themes/tools/github))

```bash
  git push
```


## FAQ

#### if authentication problem (eg: 422 API Request)

Log out of shopify and shopify partners. Check owner status (if dev store). Connect to the store with your own account to shopify partners and finally relaunch the start server command

```bash
shopify auth logout

yarn shop:start
```


## Features

- [Shopify Vite](https://github.com/barrel/shopify-vite/tree/main)
- Tailwind.css
- Pieces.js
- Prettier Liquid
- [Tailwind Raw Reorder](https://marketplace.visualstudio.com/items?itemName=Trapfether.tailwind-raw-reorder)
- [Github Theme integration](https://shopify.dev/docs/storefronts/themes/tools/github)


## Run Locally


Clone the repository and go to the project directory

```bash
  cd my-project
```

Create `shopify.theme.toml` file

```bash
    [environments.development]
    store = "your-store"
    theme = "XXX"

    [environments.production]
    store = "your-store"
    theme = "XXX"
    ignore = ["templates/*", "config/*"]

```


Install dependencies

```bash
  yarn install
```

Start the server

```bash
  yarn dev
```


## Deployment

To deploy this project run, just push the modified files (assuming the theme is connected with [Github Integration](https://shopify.dev/docs/storefronts/themes/tools/github))

```bash
  yarn build
  git push
```


## FAQ

#### if authentication problem (eg: 422 API Request)

Log out of shopify and shopify partners. Check owner status (if dev store). Connect to the store with your own account to shopify partners and finally relaunch the start server command

```bash
shopify auth logout

yarn shop:start
```

#### Problem with assets loading when starting the project

If your assets aren't loading due to ssl errors, visit https://127.0.0.1:3000, click Advanced and proceed, then navigate back to your Shopify CLI dev server at http://127.0.0.1:9292 and you should see your assets loaded properly.


## Thanks to

- Code reference https://github.com/james0r/slayed


## Features

- [Shopify Vite](https://github.com/barrel/shopify-vite/tree/main)
- Tailwind.css
- Pieces.js
- Prettier Liquid
- [Tailwind Raw Reorder](https://marketplace.visualstudio.com/items?itemName=Trapfether.tailwind-raw-reorder)
- [Github Theme integration](https://shopify.dev/docs/storefronts/themes/tools/github)


## Run Locally


Clone the repository and go to the project directory

```bash
  cd my-project
```

Create `shopify.theme.toml` file

```bash
    [environments.development]
    store = "your-store"
    theme = "XXX"

    [environments.production]
    store = "your-store"
    theme = "XXX"
    ignore = ["templates/*", "config/*"]

```


Install dependencies

```bash
  yarn install
```

Start the server

```bash
  yarn dev
```


## Deployment

To deploy this project run, just push the modified files (assuming the theme is connected with [Github Integration](https://shopify.dev/docs/storefronts/themes/tools/github))

```bash
  yarn build
  git push
```


## FAQ

#### if authentication problem (eg: 422 API Request)

Log out of shopify and shopify partners. Check owner status (if dev store). Connect to the store with your own account to shopify partners and finally relaunch the start server command

```bash
shopify auth logout

yarn shop:start
```

#### Problem with assets loading when starting the project

If your assets aren't loading due to ssl errors, visit https://127.0.0.1:3000, click Advanced and proceed, then navigate back to your Shopify CLI dev server at http://127.0.0.1:9292 and you should see your assets loaded properly.


## Thanks to

- Code reference https://github.com/james0r/slayed

