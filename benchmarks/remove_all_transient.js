/**
 * @fileOverview Cost to removed all entries from a hashtrie of size `n`.
 * 
 * Uses transient mutation if supported.
 */
var Benchmark = require('benchmark');

var hamt = require('hamt');
var hamt_plus = require('hamt_plus');
var mori = require('mori');
var immutable = require('immutable');
var seamlessImmutable = require('seamless-immutable');

var words = require('./words').words;
var range = require('./words').range;
var api = require('./shared');


var hamtRemoveAll = function(keys, order) {
    var h = api.hamtFrom(keys);
    return function() {
        var c = h;
        for (var i = 0, len = order.length; i < len; ++i)
            c = hamt.remove(keys[order[i]], c);
    };
};

var hamtPlusRemoveAll = function(keys, order) {
    var mutate = function(h) {
        for (var i = 0, len = order.length; i < len; ++i)
            h = hamt_plus.remove(keys[order[i]], h);
    };
    
    var h = api.hamtPlusFrom(keys);
    return function() {
        hamt_plus.mutate(mutate, h);
    };
};

var moriRemoveAll = function(keys, order) {
    var h = api.moriFrom(keys);
    return function() {
        var c = mori.mutable.thaw(h);
        for (var i = 0, len = order.length; i < len; ++i)
           c = mori.mutable.dissoc(c, keys[order[i]]);
        c = mori.mutable.freeze(c);
    };
};

var immutableRemoveAll = function(keys, order) {
    var h = api.immutableFrom(keys);
    return function() {
        var c = h.asMutable();
        for (var i = 0, len = order.length; i < len; ++i)
           c = c.delete(keys[order[i]]);
        c = c.asImmutable();
    };
};

var seamlessImmutableRemoveAll = function(keys, order) {
    var h = api.seamlessImmutableFrom(keys);
    return function() {
        var c = h.asMutable();
        for (var i = 0, len = order.length; i < len; ++i)
           delete c[keys[order[i]]];
        c = seamlessImmutable(c);
    };
};



module.exports = function(sizes) {
    return sizes.reduce(function(b,size) {
        var keys = words(size, 10),
            order = range(0, size);
        return b
            .add('hamt(' + size + ')',
                hamtRemoveAll(keys, order))
            
           .add('hamt_plus(' + size + ')',
                hamtPlusRemoveAll(keys, order))
            
            .add('mori hash_map(' + size + ')',
                moriRemoveAll(keys, order))
            
            .add('immutable(' + size + ')',
                immutableRemoveAll(keys, order))

            .add('seamlessImmutable(' + size + ')',
                seamlessImmutableRemoveAll(keys, order));

    }, new Benchmark.Suite('Remove All (transient)'));
};
