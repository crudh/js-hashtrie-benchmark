/**
 * @fileOverview Cost to removed all entries from a hashtrie of size `n`.
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
var range = require('./words').range;
var api = require('./shared');

var hashtrieRemoveAll = function(keys, order) {
    var h = api.hashtrieFrom(keys);
    return function() {
        var c = h;
        for (var i = 0, len = order.length; i < len; ++i)
            c = ht.remove(keys[order[i]], c);
    };
};

var hamtRemoveAll = function(keys, order) {
    var h = api.hamtFrom(keys);
    return function() {
        var c = h;
        for (var i = 0, len = order.length; i < len; ++i)
            c = hamt.remove(keys[order[i]], c);
    };
};

var hamtPlusRemoveAll = function(keys, order) {
    var h = api.hamtPlusFrom(keys);
    return function() {
        var c = h;
        for (var i = 0, len = order.length; i < len; ++i)
            c = hamt_plus.remove(keys[order[i]], c);
    };
};

var pHashtrieRemoveAll = function(keys, order) {
    var h = api.pHashtrieFrom(keys);
    return function() {
        var c = h;
        for (var i = 0, len = order.length; i < len; ++i)
           c = p.dissoc(c, keys[order[i]]);
    };
};

var moriRemoveAll = function(keys, order) {
    var h = api.moriFrom(keys);
    return function() {
        var c = h;
        for (var i = 0, len = order.length; i < len; ++i)
           c = mori.dissoc(c, keys[order[i]]);
    };
};

var immutableRemoveAll = function(keys, order) {
    var h = api.immutableFrom(keys);
    return function() {
        var c = h;
        for (var i = 0, len = order.length; i < len; ++i)
           c = c.delete(keys[order[i]]);
    };
};

var seamlessImmutableRemoveAll = function(keys, order) {
    var h = api.seamlessImmutableFrom(keys);
    return function() {
        var c = h;
        for (var i = 0, len = order.length; i < len; ++i)
           c = c.without(keys[order[i]]);
    };
};

var seamlessImmutableRemoveAllBatch = function(keys, order) {
    var h = api.seamlessImmutableFrom(keys);
    return function() {
        var c = h;
        var batch = [];
        for (var i = 0, len = order.length; i < len; ++i)
            batch.push(keys[order[i]]);

        c = c.without(batch);
    };
};


module.exports = function(sizes) {
    return sizes.reduce(function(b,size) {
        var keys = words(size, 10),
            order = range(0, size);
        return b
            .add('hashtrie(' + size + ')',
                hashtrieRemoveAll(keys, order))
            
            .add('hamt(' + size + ')',
                hamtRemoveAll(keys, order))
            
            .add('hamt_plus(' + size + ')',
                hamtPlusRemoveAll(keys, order))
                
            .add('persistent-hash-trie(' + size + ')',
                pHashtrieRemoveAll(keys, order))
                
            .add('mori hash_map(' + size + ')',
                moriRemoveAll(keys, order))
            
            .add('immutable(' + size + ')',
                immutableRemoveAll(keys, order))

            .add('seamlessImmutable(' + size + ')',
                seamlessImmutableRemoveAll(keys, order))

            .add('seamlessImmutableBatch(' + size + ')',
                seamlessImmutableRemoveAllBatch(keys, order));

    }, new Benchmark.Suite('Remove All'));
};
