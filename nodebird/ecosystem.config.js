module.exports = {
    apps: [{
    name: 'app',
    script: './startscript.js',
    instances: 4,
    exec_mode: 'cluster'
    }]
}  