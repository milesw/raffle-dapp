# React Truffle Box

This box comes with everything you need to start using smart contracts from a react app. This is as barebones as it gets, so nothing stands in your way.

## Installation

1. Install Truffle globally.

   ```javascript
   npm install -g truffle
   ```

2. Run the development blockchain.

   ```javascript
   ganache-cli -b 3 --account="0xee4e871def4e297da77f99d57de26000e86077528847341bc637d2543f8db6e2, 1000000000000000000000000" --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501201, 1000000000000000000000000"
   ```

3. Compile and migrate the smart contracts. Note inside the development console we don't preface commands with `truffle`.

   ```javascript
   truffle compile
   truffle migrate
   ```

4. Run the webpack server for front-end hot reloading (outside the development console). Smart contract changes must be manually recompiled and migrated.

   ```javascript
   // Serves the front-end on http://localhost:3000
   npm run start
   ```

5. Truffle can run tests written in Solidity or JavaScript against your smart contracts. Note the command varies slightly if you're in or outside of the development console.

   ```javascript
   // If inside the development console.
   test

   // If outside the development console..
   truffle test
   ```

6. Jest is included for testing React components. Compile your contracts before running Jest, or you may receive some file not found errors.

   ```javascript
   // Run Jest outside of the development console for front-end component tests.
   npm run test
   ```

7. To build the application for production, use the build command. A production build will be in the build_webpack folder.
   ```javascript
   npm run build
   ```

## FAQ

* **How do I use this with the EthereumJS TestRPC?**

  It's as easy as modifying the config file! [Check out our documentation on adding network configurations](http://truffleframework.com/docs/advanced/configuration#networks). Depending on the port you're using, you'll also need to update line 24 of `src/utils/getWeb3.js`.

* **Why is there both a truffle.js file and a truffle-config.js file?**

  `truffle-config.js` is a copy of `truffle.js` for compatibility with Windows development environments. Feel free to it if it's irrelevant to your platform.

* **Where is my production build?**

  The production build will be in the build_webpack folder. This is because Truffle outputs contract compilations to the build folder.

* **Where can I find more documentation?**

  This box is a marriage of [Truffle](http://truffleframework.com/) and a React setup created with [create-react-app](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md). Either one would be a great place to start!
