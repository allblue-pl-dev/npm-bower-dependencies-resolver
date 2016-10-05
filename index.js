
var fs = require('fs');
var path = require('path');
var tmp = require('tmp');

module.exports = function resolver (bower) {
        return {
    match: function (source) {
        return source.indexOf('bdr:') === 0;
    },
    fetch: function (endpoint, cached) {
        var source = endpoint.source;
        var source_array = source.split(':');
        if (source_array.length !== 2)
            throw new Error('Wrong `bdr` format: ' + source);

        var uses_subpaths = false;

        var bdr_path = source_array[1];
        if (bdr_path[bdr_path.length - 1] === '*') {
            uses_subpaths = true;
            bdr_path = bdr_path.substring(0, bdr_path.length - 1);
        }

        if (!fs.existsSync(bdr_path))
            throw new Error('`bdr` path does not exist: ' + bdr_path);

        var bower_json_paths = [];
        if (uses_subpaths) {
            var bdr_subpaths = fs.readdirSync(bdr_path).filter(function(file) {
                return fs.statSync(path.join(bdr_path, file)).isDirectory();
            });

            for (var i = 0; i < bdr_subpaths.length; i++) {
                bower_json_paths.push(path.join(bdr_path, bdr_subpaths[i],
                        'bower.json'));
            }
        } else
            bower_json_paths.push(path.join(bdr_path, 'bower.json'));

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

            if ('dependencies' in bower_json) {
                for (var dependency_name in bower_json.dependencies) {
                    final_bower_json.dependencies[dependency_name] =
                            bower_json.dependencies[dependency_name];
                }
            }

            if ('devDependencies' in bower_json) {
                for (var dependency_name in bower_json.devDependencies) {
                    final_bower_json.devDependencies[dependency_name] =
                            bower_json.devDependencies[dependency_name];
                }
            }
        }

        var tmp_dir = tmp.dirSync();

        fs.writeFileSync(path.join(tmp_dir.name, 'bower.json'),
                JSON.stringify(final_bower_json));

        return {
            tempPath: tmp_dir.name,
            removeIgnores: true
        }
    }
  }
}
