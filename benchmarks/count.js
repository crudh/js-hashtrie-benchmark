/**
 * @fileOverview Cost to count map of size `n`.
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

var hashtrieCount = function(keys) {
    var h = api.hashtrieFrom(keys);
    return function() {
        ht.count(h);
    };
};

var hamtCount = function(keys) {
    var h = api.hamtFrom(keys);
    return function() {
        hamt.count(h);
    };
};

var hamtPlusCount = function(keys) {
    var h = api.hamtPlusFrom(keys);
    return function() {
        hamt_plus.count(h);
    };
};

var pHashtrieCount = function(keys) {
    var h = api.pHashtrieFrom(keys);
    return function() {
        p.keys(h).length;
    };
};

var moriCount = function(keys) {
    var h = api.moriFrom(keys);
    return function() {
        mori.count(h);
    };
};

var immutableCount = function(keys) {
    var h = api.immutableFrom(keys);
    return function() {
        h.count();
    };
};

var seamlessImmutableCount = function(keys) {
    var h = api.seamlessImmutableFrom(keys);
    return function() {
        h.length;
    };
};


module.exports = function(sizes) {
    return sizes.reduce(function(b,size) {
        var keys = words(size, 10);
        return b
            .add('hashtrie(' + size+ ')',
                hashtrieCount(keys))
            
            .add('hamt(' + size+ ')',
                hamtCount(keys))
            
            .add('hamt_plus(' + size+ ')',
                hamtPlusCount(keys))
            
            .add('persistent-hash-trie(' + size+ ')',
                pHashtrieCount(keys))
        
            .add('mori hash_map(' + size+ ')',
                moriCount(keys))
        
            .add('immutable(' + size+ ')',
                immutableCount(keys))

            .add('seamlessImmutable(' + size+ ')',
                seamlessImmutableCount(keys));

    }, new Benchmark.Suite('Count'));
};
