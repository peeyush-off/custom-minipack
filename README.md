# custom-minipack
#### A small implementation for module bundler.

This is a simple implementation of a small module bundler. The purpose of this project is to understand how most bundlers work under the hood.

#### What is a module bundler?

A module bundler is a tool that takes pieces of JavaScript and their dependencies and bundles them into a single file, usually for use in the browser. Tools such as Browserify, Webpack, Rollup, etc are used as module bundlers.
It starts from an entry file and then bundles all the code that is required by this entry file.

![module bundler](https://cdn-media-1.freecodecamp.org/images/0*WwDTeWwIRxVPg5jK.png "Module bundler")

There are two main stages of a bundler:

1. Dependency resolution
2. Packing

Starting from an entry point (such as app.js above), the goal of dependency resolution is to look for all of the dependencies of your code (other pieces of code that it needs to function) and construct a graph (called a dependency graph).

Once this is done, you can then pack or convert your dependency graph into a single file that the application can use.


#### ES6 Modules

JavaScript has had modules for a long time. However, they were implemented via libraries, not built into the language. ES6 is the first time that JavaScript has built-in modules.

There are many benefits that ES6 modules provide.
- Each module is a piece of code that is executed once it is loaded.
- In that code, there may be declarations (variable declarations, function declarations, etc.).
  - By default, these declarations stay local to the module.
  - You can mark some of them as exports, then other modules can import them.
- A module can import things from other modules. It refers to those modules via module specifiers, strings that are either:
  - Relative paths ('../model/user'): these paths are interpreted relatively to the location of the importing module. The file extension .js can usually be omitted.
  - Absolute paths ('/lib/js/helpers'): point directly to the file of the module to be imported.
  - Names ('util'): What modules names refer to has to be configured.
- Modules are singletons. Even if a module is imported multiple times, only a single “instance” of it exists.

This approach to modules avoids global variables, the only things that are global are module specifiers.

#### Working

Module bundlers have this concept of an entry file. Instead of adding a few
script tags in the browser and letting them run, we let the bundler know
which file is the main file of our application. This is the file that should
bootstrap our entire application.

Our bundler will start from that entry file, and it will try to understand
which files it depends on. Then, it will try to understand which files its
dependencies depend on. It will keep doing that until it figures out about
every module in our application, and how they depend on one another.

We use the 'config.json' file to specify the entry file and the dest file to specify the final bundled file.

We write all the bundled code into the dest file specified in the 'config.json' file.

#### Tools used

1. Babylon: Babylon is a JavaScript parser used in Babel. We use it to create a AST. JavaScript parsers are tools that can read and understand JavaScript code.
They generate a more abstract model called an AST (abstract syntax tree).
2. Babel-traverse: The Babel Traverse module maintains the overall tree state, and is responsible for replacing, removing, and adding nodes. We use it to get the dependency node from the AST.
3. Babel-core: Babel used to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript that can be used in current and older browsers or environments.

#### Run bundler

1. Install dependies
    ```
    npm install
    ```

2. Edit 'config.json'


3. Run the bundler
    ```
    npm run build
    ```
---

 *Inspired by Ronen Amiel's fantanstic talk on 'Build your own Webpack'.*

<a href="http://www.youtube.com/watch?feature=player_embedded&v=Gc9-7PBqOC8
" target="_blank"><img src="http://img.youtube.com/vi/Gc9-7PBqOC8/0.jpg" 
alt="IMAGE ALT TEXT HERE" width="240" height="180" border="10" /></a>

*You can look at his orignal code here*

https://github.com/ronami/minipack
