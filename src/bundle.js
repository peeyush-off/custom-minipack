const fs = require('fs');
const babylon = require('babylon');
const path = require('path');
const traverse = require('babel-traverse').default;
const babel = require('babel-core');
let ID = 0;

function createAsset(filename) {
    const content = fs.readFileSync(filename, 'utf-8');
    const ast = babylon.parse(content, {
        sourceType: 'module'
    });

    const dependencies = [];
    traverse(ast, {
        ImportDeclaration: ({
            node
        }) => {
            dependencies.push(node.source.value)
        }
    });

    const id = ID++;

    const {
        code
    } = babel.transformFromAst(ast, null, {
        presets: ['env'],
    })
    return {
        id,
        filename,
        dependencies,
        code,
    }

}

function createGraph(entry) {
    let mainAsset = createAsset(entry);
    const queue = [mainAsset];

    for (const asset of queue) {
        const dirname = path.dirname(asset.filename);
        asset.mapping = {};

        asset.dependencies.forEach(relativePath => {
            const absolutePath = path.join(dirname, relativePath);

            const child = createAsset(absolutePath)
            asset.mapping[relativePath] = child.id;

            queue.push(child);
        })
    }
    return queue;
}

function bundle(graph) {
    let modules = '';

    graph.forEach(mod => {
        modules += `${mod.id}: [
             function(require, module, exports) {
                 ${mod.code}
                },
             ${JSON.stringify(mod.mapping)},
        ],`
    })

    return `(function(modules) {

        function require(id) {
            const [fn, mapping] = modules[id];

            function localRequire(relativePath) {
                return require(mapping[relativePath]);
            }
            const localModule = {exports: {}};
            fn(localRequire, localModule, localModule.exports);
            return localModule.exports;
        }
        require(0);

    })({${modules}})`;
}

function buildFinal(entry, dest) {
    const graph = createGraph(entry);
    const result = bundle(graph);
    ensureDirectoryExistence(dest);
    fs.writeFileSync(dest, result);
}

function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

module.exports = buildFinal;