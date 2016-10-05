
var fs = require('fs');
var path = require('path');
var tmp = require('tmp');

module.exports = function resolver (bower) {
        return {
    match: function (source) {
        console.log('A');
        return source.indexOf('bdr:') === 0;
    },
    fetch: function (endpoint, cached) {
        console.log('B');
        var source = endpoint.source;
        var source_array = source.split(':');
        if (source_array.length !== 2)
            throw new Error('Wrong `bdr` format: ' + source);

        var bdr_path = source_array[1];
        if (!fs.existsSync(bdr_path))
            throw new Error('`bdr` path does not exist: ' + bdr_path);

        var bower_json_paths = [ path.join(bdr_path, 'bower.json') ];
        var final_bower_json = {
            name: endpoint.name,
            dependencies: {},
            devDependencies: {}
        };

        for (var i = 0; i < bower_json_paths.length; i++) {
            var bower_json_path = bower_json_paths[i];
            if (!fs.existsSync(bower_json_path))
                return;

            var bower_json = JSON.parse(fs.readFileSync(bower_json_path, 'utf8'));
            var dependency_name;

            if ('dependencies' in bower_json) {
                for (dependency_name in bower_json.dependencies) {
                    final_bower_json.dependencies[dependency_name] =
                            bower_json.dependencies[dependency_name];
                }
            }

            if ('devDependencies' in bower_json) {
                for (dependency_name in bower_json.devDependencies) {
                    final_bower_json.devDependencies[dependency_name] =
                            bower_json.devDependencies[dependency_name];
                }
            }
        }

        var tmp_dir = tmp.dirSync();

        console.log(final_bower_json);

        fs.writeFileSync(path.join(tmp_dir.name, 'bower.json'),
                JSON.stringify(final_bower_json));

        return {
            tempPath: tmp_dir.name,
            removeIgnores: true
        }
    }
  }
}
