/**
 * @fileOverview Cost to get the `nth` entry in a hash of size `n`.
 */
var Benchmark = require('benchmark');

var ht = require('hashtrie');
var hamt = require('hamt');
var hamt_plus = require('hamt_plus');
var p = require('persistent-hash-trie');
var mori = require('mori');
var immutable = require('immutable');
var seamlessImmutable = require('seamless-immutable');

var words = require('./words').words;
var api = require('./shared');



var hashtrieGet = function(keys) {
    var h = api.hashtrieFrom(keys);
    return function() {
        var key = keys[Math.floor(Math.random() * keys.length)];
        ht.get(key, h);
    };
};

var hamtGet = function(keys) {
    var h = api.hamtFrom(keys);
    return function() {
        var key = keys[Math.floor(Math.random() * keys.length)];
        hamt.get(key, h);
    };
};

var hamtPlusGet = function(keys) {
    var h = api.hamtPlusFrom(keys);
    return function() {
        var key = keys[Math.floor(Math.random() * keys.length)];
        hamt_plus.get(key, h);
    };
};


var pHashtrieGet = function(keys) {
    var h = api.pHashtrieFrom(keys);
    return function() {
        var key = keys[Math.floor(Math.random() * keys.length)];
        p.get(h, key);
    };
};

var moriGet = function(keys) {
    var h = api.moriFrom(keys);
    return function() {
        var key = keys[Math.floor(Math.random() * keys.length)];
        mori.get(h, key);
    };
};

var immutableGet = function(keys) {
    var h = api.immutableFrom(keys);
    return function() {
        var key = keys[Math.floor(Math.random() * keys.length)];
        h.get(key);
    };
};

var seamlessImmutableGet = function(keys) {
    var h = api.seamlessImmutableFrom(keys);
    return function() {
        var key = keys[Math.floor(Math.random() * keys.length)];
        h[key];
    };
};

module.exports = function(sizes) {
    return sizes.reduce(function(b, size) {
        var keys = words(size, 10);
        return b
            .add('hashtrie(' + size + ')',
                hashtrieGet(keys))
            
            .add('hamt(' + size + ')',
                hamtGet(keys))
            
           .add('hamt_plus(' + size + ')',
                hamtPlusGet(keys))
                
            .add('persistent-hash-trie(' + size + ')',
                pHashtrieGet(keys))
            
            .add('mori hash_map(' + size + ')',
                moriGet(keys))

            .add('immutable(' + size + ')',
                immutableGet(keys))

            .add('seamlessImmutable(' + size + ')',
                seamlessImmutableGet(keys));

            
    }, new Benchmark.Suite('Get nth'));
};
