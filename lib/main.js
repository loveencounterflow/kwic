(function() {
  var CND, CODEC, badge, echo, help, rpr;

  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'KWIC';

  help = CND.get_logger('help', badge);

  echo = CND.echo.bind(CND);

  CODEC = require('hollerith-codec');

  CND.shim();

  this.get_factors = function(entry, factorizer) {
    if (factorizer == null) {
      factorizer = null;
    }
    if (factorizer == null) {
      factorizer = this._get_factorizer(factorizer);
    }
    return factorizer(entry);
  };

  this._get_factorizer = function(factorizer) {
    var R, type;
    if (factorizer == null) {
      factorizer = 'characters';
    }
    switch (type = CND.type_of(factorizer)) {
      case 'function':
        R = factorizer;
        break;
      case 'text':
        R = this.factorizers[factorizer];
        if (R == null) {
          throw new Error("unknown factorizer name " + (rpr(factorizer)));
        }
        break;
      default:
        throw new Error("illegal factorizer type " + (rpr(type)));
    }
    return R;
  };

  this.get_weights = function(factors, alphabet) {
    var R, factor, i, len, weight, weighter;
    if (alphabet == null) {
      alphabet = 'unicode';
    }
    weighter = this._get_weighter(alphabet);
    R = [];
    for (i = 0, len = factors.length; i < len; i++) {
      factor = factors[i];
      R.push(weight = weighter(factor));
      if (weight === void 0) {
        throw new Error("factor not in alphabet: " + (rpr(factor)));
      }
    }
    return R;
  };

  this._get_weighter = function(alphabet) {
    var R, alphabet_pod, type;
    if (alphabet == null) {
      alphabet = 'unicode';
    }
    switch (type = CND.type_of(alphabet)) {
      case 'function':
        R = alphabet;
        break;
      case 'text':
        R = this.alphabets[alphabet];
        if (R == null) {
          throw new Error("unknown alphabet name " + (rpr(alphabet)));
        }
        break;
      case 'list':
        alphabet_pod = {};
        (function() {
          var factor, i, idx, len, results;
          results = [];
          for (idx = i = 0, len = alphabet.length; i < len; idx = ++i) {
            factor = alphabet[idx];
            results.push(alphabet_pod[factor] = idx);
          }
          return results;
        })();
        R = function(factor) {
          return alphabet[factor];
        };
        break;
      default:
        throw new Error("illegal alphabet type " + (rpr(type)));
    }
    return R;
  };

  this.get_permutations = function(factors, weights, zero) {
    var R, i, infix, infix_idx, permutation_count, prefix, r_idx, r_weights, ref, suffix;
    if (zero == null) {
      zero = null;
    }
    R = [];
    weights = weights.slice(0);
    permutation_count = weights.length;
    weights.push(zero);
    for (infix_idx = i = 0, ref = permutation_count; 0 <= ref ? i < ref : i > ref; infix_idx = 0 <= ref ? ++i : --i) {
      prefix = factors.slice(0, infix_idx);
      infix = factors[infix_idx];
      suffix = factors.slice(infix_idx + 1);

      /* Here we reverse the order of weights in the 'suffix' part of the weights (the part that comes
      behind the guard value); this means that both prefix and suffix weights that are closer to the
      infix have a stronger influence on the sorting than those that are further away.
       */
      r_idx = permutation_count - infix_idx;
      r_weights = weights.slice(0, +r_idx + 1 || 9e9).concat(weights.slice(r_idx + 1).reverse());
      R.push([r_weights, infix, suffix, prefix]);
      this._rotate_left(weights);
    }
    return R;
  };

  this.permute = function(entry, settings) {
    var alphabet, factorizer, factors, ref, ref1, ref2, weights, zero;
    factorizer = (ref = settings != null ? settings['factorizer'] : void 0) != null ? ref : null;
    alphabet = (ref1 = settings != null ? settings['alphabet'] : void 0) != null ? ref1 : null;
    zero = (ref2 = settings != null ? settings['zero'] : void 0) != null ? ref2 : null;
    factors = this.get_factors(entry, factorizer);
    weights = this.get_weights(factors, alphabet);
    return this.get_permutations(factors, weights, zero);
  };

  this.sort = function(collection) {
    var _, bkey, entry, facets, i, infix, j, key, len, len1, permutations, prefix, ref, suffix;
    facets = [];
    for (i = 0, len = collection.length; i < len; i++) {
      ref = collection[i], permutations = ref[0], entry = ref[1];
      for (j = 0, len1 = permutations.length; j < len1; j++) {
        key = permutations[j];
        bkey = CODEC.encode(key);
        facets.push([bkey, key, entry]);
      }
    }
    facets.sort(function(a, b) {
      return a[0].compare(b[0]);
    });
    return (function() {
      var k, len2, ref1, ref2, results;
      results = [];
      for (k = 0, len2 = facets.length; k < len2; k++) {
        ref1 = facets[k], _ = ref1[0], (ref2 = ref1[1], _ = ref2[0], infix = ref2[1], suffix = ref2[2], prefix = ref2[3]), entry = ref1[2];
        results.push([prefix, infix, suffix, entry]);
      }
      return results;
    })();
  };

  this.report = function(collection, settings) {
    var entry, i, infix, j, joiner, len, len1, lineups_and_entries, max_length, padder, prefix, ref, ref1, ref2, ref3, ref4, separator, show, suffix;
    padder = (ref = settings != null ? settings['padder'] : void 0) != null ? ref : ' ';
    separator = (ref1 = settings != null ? settings['separator'] : void 0) != null ? ref1 : '|';
    joiner = (ref2 = settings != null ? settings['joiner'] : void 0) != null ? ref2 : '';
    show = process.stdout.isTTY ? help : echo;
    lineups_and_entries = this.sort(collection);
    max_length = -Infinity;
    for (i = 0, len = lineups_and_entries.length; i < len; i++) {
      ref3 = lineups_and_entries[i], prefix = ref3[0], infix = ref3[1], suffix = ref3[2], entry = ref3[3];
      max_length = Math.max(max_length, prefix.length);
    }
    for (j = 0, len1 = lineups_and_entries.length; j < len1; j++) {
      ref4 = lineups_and_entries[j], prefix = ref4[0], infix = ref4[1], suffix = ref4[2], entry = ref4[3];
      prefix = prefix.slice(0);
      suffix = suffix.slice(0);
      while (prefix.length !== max_length) {
        prefix.unshift(padder);
      }
      while (suffix.length !== max_length) {
        suffix.push(padder);
      }
      prefix = prefix.join(joiner);
      suffix = suffix.join(joiner);
      entry = CND.isa_text(entry) ? entry : rpr(entry);
      show(prefix + separator + infix + suffix + padder + entry);
    }
    return null;
  };

  this.factorizers = {
    'characters': function(text) {
      return Array.from(text);
    }
  };

  this.alphabets = {
    'unicode': function(factor) {
      return factor.codePointAt(0);
    }
  };

  this._rotate_left = function(list) {
    if (list.length < 2) {
      return list;
    }
    list.push(list.shift());
    return list;
  };

}).call(this);

//# sourceMappingURL=../sourcemaps/main.js.map