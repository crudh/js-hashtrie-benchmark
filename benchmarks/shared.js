var ht = require('hashtrie');
var hamt = require('hamt');
var hamt_plus = require('hamt_plus');
var p = require('persistent-hash-trie');
var mori = require('mori');
var immutable = require('immutable');
var seamlessImmutable = require('seamless-immutable');


exports.hamtFrom = function(keys) {
    var h = hamt.empty;
    for (var i = keys.length - 1; i >= 0; --i)
        h = hamt.set(keys[i], i, h);
    return h;
};

exports.hamtPlusFrom = function(keys) {
    var h = hamt_plus.make();
    for (var i = keys.length - 1; i >= 0; --i)
        h = hamt_plus.set(keys[i], i, h);
    return h;
};

exports.hashtrieFrom = function(keys) {
    var h = ht.empty;
    for (var i = keys.length - 1; i >= 0; --i)
        h = ht.set(keys[i], i, h);
    return h;
};

exports.pHashtrieFrom = function(keys) {
    var h = p.Trie();
    for (var i = keys.length - 1; i >= 0; --i)
        h = p.assoc(h, keys[i], i);
    return h;
};

exports.moriFrom = function(keys) {
    var h = mori.hashMap();
    for (var i = keys.length - 1; i >= 0; --i)
        h = mori.assoc(h, keys[i], i);
    return h;
};

exports.immutableFrom = function(keys) {
    var h = immutable.Map();
    for (var i = keys.length - 1; i >= 0; --i)
        h = h.set(keys[i], i);
    return h;
};

exports.seamlessImmutableFrom = function(keys) {
    var h = seamlessImmutable({});
    for (var i = keys.length - 1; i >= 0; --i) {
        var obj = {};
        obj[keys[i]] = i;
        h = h.merge(obj);
    }
    return h;
};
