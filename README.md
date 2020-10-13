# replace-ts-alias

A simple CLI to replace modules aliases defined in `tsconfig.json` by the correct relative path in the transpiled `.js` files.

## Getting started

Run the following command :

```bash
yarn add -D replace-ts-alias
```

## How to use

Run the following command :

```bash
yarn replace-ts-alias -p ./path/to/project/root/with/tsconfig.json
```

If you're already at the project root `yarn replace-ts-alias -p .`

And then it's done.
