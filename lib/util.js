/*───────────────────────────────────────────────────────────────────────────*\
 │  Copyright (C) 2014 eBay Software Foundation                                │
 │                                                                             │
 │hh ,'""`.                                                                    │
 │  / _  _ \  Licensed under the Apache License, Version 2.0 (the "License");  │
 │  |(@)(@)|  you may not use this file except in compliance with the License. │
 │  )  __  (  You may obtain a copy of the License at                          │
 │ /,'))((`.\                                                                  │
 │(( ((  )) ))    http://www.apache.org/licenses/LICENSE-2.0                   │
 │ `\ `)(' /'                                                                  │
 │                                                                             │
 │   Unless required by applicable law or agreed to in writing, software       │
 │   distributed under the License is distributed on an "AS IS" BASIS,         │
 │   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  │
 │   See the License for the specific language governing permissions and       │
 │   limitations under the License.                                            │
 \*───────────────────────────────────────────────────────────────────────────*/
'use strict';

var fs = require('graceful-fs'),
    path = require('path'),
    assert = require('assert');

var debug = require('debuglog')('file-resolver');


/**
 * Converts a lang tag (en-US, en, fr-CA) into an object with properties `country` and `locale`
 * @param str String a language tag in the format `en-US`, `en_US`, `en`, etc.
 * @returns {{language: string, country: string}}
 */
exports.parseLangTag = function (str) {
    var pair, tuple;

    if (typeof str === 'object') {
        debug('language tag is already an object: %j', str);
        return str;
    }

    pair = {
        language: '',
        country: ''
    };

    if (str) {
        tuple = str.split(/[-_]/);
        pair.language = tuple[0].toLowerCase();
        pair.country = (tuple[1] || pair.country).toUpperCase();
    }

    debug("parsed language tag '%s' as %j", str, pair);
    return pair;
};


/**
 * Walks up a directory tree to find a particular file, stopping at the specified root.
 * @param name The name of the file to locate. May include parent directories (e.g. inc/foo.bar)
 * @param root The root directory at which to stop searching.
 * @param start The starting directory (must be descendent of root)
 * @returns {{file: *, name: string, dirs: array}}
 */
exports.locate = function locate(name, root, start) {
    var removed, file, parent;

    start = path.normalize(start);
    root = path.normalize(root);
    assert(~start.indexOf(root), 'Provided start directory is not within root or one of its subdirectories.');

    file = path.join(start, name);
    debug('trying to resolve %s %s %s', start, name, file);
    if (fs.existsSync(file)) {
        return {
            root : file.replace(path.normalize(name), ''),
            file: file,
            ext: path.extname(name).substr(1),
            name: name.replace(path.extname(name), '')
        };
    } else {
        return {
            root : undefined,
            file: undefined,
            ext: path.extname(name).substr(1),
            name: name.replace(path.extname(name), '')
        };
    }

};
