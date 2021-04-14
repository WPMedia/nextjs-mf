# Next.js with Module Federation Example

This is inspired by [an example from the `@module-federation/module-federation-examples` repo](https://github.com/module-federation/module-federation-examples/tree/master/nextjs).

## Getting Started

1. run `yarn` to install from this directory, a `postinstall` script will perform the install in each next directory
2. To test it in dev mode, `yarn start` and visit `http://localhost:3001`.
3. To test prod builds, run `yarn build` then `yarn serve` and browse to the above URLs.

## Context

We have two next.js applications

- `next1` - port 3000
- `next2` - port 3001

The "main" application that is federating code (the host) is `next2`, visiting http://localhost:3001 should show you a page rendered in that application with a component from `next1`.

Within each folder, there are a few different server methods:
- `yarn dev` will start a development server (from `next dev`)
- `yarn prod` will compile the webpack assets into `.next/` and run a production Next.js server
- `yarn ssg` will compile a static site into the `out/` directory and start a simple webserver

## Notes

-  Try playing around with different lodash versions in each `package.json` file, to see how module federation resolves dependencies to avoid conflicts as much as possible. (If there is a version mismatch, it will download two copies.)

- Try playing around with different combinations of `yarn dev`, `yarn build && yarn start`, and `yarn ssg` to understand how different server setups affect module federation.