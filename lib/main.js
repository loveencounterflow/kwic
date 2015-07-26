(function() {
  var CND, CODEC, LODASH, TEXT, alert, badge, debug, echo, help, info, log, rpr, urge, warn, whisper;

  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'kwic';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  TEXT = require('coffeenode-text');

  CODEC = require('hollerith-codec');

  LODASH = CND.LODASH;

  this.new_kwic = function(settings) {
    var R, alphabet, entries, entry, factorizer, i, len, ref, ref1;
    factorizer = (ref = settings != null ? settings['factorizer'] : void 0) != null ? ref : null;
    alphabet = (ref1 = settings != null ? settings['alphabet'] : void 0) != null ? ref1 : null;
    R = {
      '~isa': 'KWIC/base',
      'entries': null,
      'factors': null,
      'factorizer': factorizer,
      'alphabet': alphabet,
      'weights': null,
      'permutations': null,
      'facets': null
    };
    if ((entries = settings != null ? settings['entries'] : void 0) != null) {
      for (i = 0, len = entries.length; i < len; i++) {
        entry = entries[i];
        this.add(R, entry);
      }
      if (alphabet != null) {
        this.factorize;
      }
    }
    return R;
  };

  this.filler = Symbol('-');

  this.add = function(me, entry) {

    /* TAINT consider to update or delete factors instead */
    if (me['factors'] != null) {
      throw new Error("unable to add entries after factorization");
    }
    (me['entries'] != null ? me['entries'] : me['entries'] = []).push(entry);
    return me;
  };

  this.factorize = function(me, factorizer) {
    var entry, factor_list, i, len, ref;
    if (factorizer == null) {
      factorizer = null;
    }

    /* TAINT consider to update or delete factors instead */
    if (me['factors'] != null) {
      throw new Error("unable to factorize another time");
    }
    me['factors'] = [];
    if (factorizer == null) {
      factorizer = this._get_factorizer(me, factorizer);
    }
    ref = me['entries'];
    for (i = 0, len = ref.length; i < len; i++) {
      entry = ref[i];
      me['factors'].push(factor_list = factorizer(entry));
    }
    return me;
  };

  this._get_factorizer = function(me, factorizer) {
    var R, ref, type;
    if (factorizer == null) {
      factorizer = null;
    }
    if (factorizer == null) {
      factorizer = (ref = me['factorizer']) != null ? ref : 'characters';
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

  this.add_weights = function(me, alphabet) {
    var factor, factor_list, i, len, ref, weighter;
    if (alphabet == null) {
      alphabet = null;
    }

    /* TAINT consider to factorize transparently */
    if (me['factors'] == null) {
      throw new Error("unable to add weights before factorization");
    }

    /* TAINT consider to update or delete weights instead */
    if (me['weights'] != null) {
      throw new Error("unable to factorize another time");
    }
    weighter = this._get_weighter(me, alphabet);
    me['weights'] = [];
    ref = me['factors'];
    for (i = 0, len = ref.length; i < len; i++) {
      factor_list = ref[i];
      me['weights'].push((function() {
        var j, len1, results;
        results = [];
        for (j = 0, len1 = factor_list.length; j < len1; j++) {
          factor = factor_list[j];
          results.push(weighter(factor));
        }
        return results;
      })());
    }
    return me;
  };

  this._get_weighter = function(me, alphabet) {
    var R, alphabet_pod, ref, type;
    if (alphabet == null) {
      alphabet = null;
    }
    if (alphabet == null) {
      alphabet = (ref = me['alphabet']) != null ? ref : 'unicode';
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

        /* TAINT consider to throw error for unknown symbols */
        R = function(factor) {
          var ref1;
          return (ref1 = alphabet[factor]) != null ? ref1 : Infinity;
        };
        break;
      default:
        throw new Error("illegal alphabet type " + (rpr(type)));
    }
    return R;
  };

  this.permute = function(me) {

    /* TAINT consider to update or delete factors instead */
    var factors, i, idx, idx_X, infix, j, len, permutation_count, permutations, prefix, ref, ref1, suffix, target, weight_idx, weights, weights_X;
    if (me['weights'] == null) {
      throw new Error("unable to permute before adding weights");
    }
    if (me['permutations'] != null) {
      throw new Error("unable to permute another time");
    }
    permutations = me['permutations'] = [];
    ref = me['weights'];
    for (weight_idx = i = 0, len = ref.length; i < len; weight_idx = ++i) {
      weights = ref[weight_idx];
      weights = weights.slice(0);
      factors = me['factors'][weight_idx];
      target = [];
      permutation_count = weights.length;
      permutations.push(target);
      weights.push(-Infinity);
      for (idx = j = 0, ref1 = permutation_count; 0 <= ref1 ? j < ref1 : j > ref1; idx = 0 <= ref1 ? ++j : --j) {
        prefix = factors.slice(0, idx);
        infix = factors[idx];
        suffix = factors.slice(idx + 1);

        /* !!!!!!!!!!!!!!!!!! */
        idx_X = weights.indexOf(-Infinity);
        weights_X = weights.slice(0, +idx_X + 1 || 9e9).concat(weights.slice(idx_X + 1).reverse());
        target.push([weights_X, [prefix, infix, suffix]]);

        /* !!!!!!!!!!!!!!!!!! */
        weights = weights.slice(0);
        this._rotate_left(weights);
      }
    }
    return me;
  };

  this.sort = function(me) {

    /* TAINT consider to update or delete factors instead */
    var entry, entry_idx, facets, i, j, key, len, len1, lineup, permutation_list, ref, ref1, weight_idx, weights;
    if (me['permutations'] == null) {
      throw new Error("unable to sort before permuting");
    }
    if (me['facets'] != null) {
      throw new Error("unable to sort another time");
    }
    facets = me['facets'] = [];
    ref = me['entries'];
    for (entry_idx = i = 0, len = ref.length; i < len; entry_idx = ++i) {
      entry = ref[entry_idx];
      permutation_list = me['permutations'][entry_idx];
      for (weight_idx = j = 0, len1 = permutation_list.length; j < len1; weight_idx = ++j) {
        ref1 = permutation_list[weight_idx], weights = ref1[0], lineup = ref1[1];
        key = CODEC.encode(weights);
        facets.push([key, weight_idx, weights, lineup, entry]);
      }
    }
    facets.sort(function(a, b) {
      var R;
      if ((R = a[0].compare(b[0])) !== 0) {
        return R;
      }
      if (a[1] > b[1]) {
        return +1;
      }
      if (a[1] < b[1]) {
        return -1;
      }
      return 0;
    });
    return me;
  };

  this.factorizers = {
    'characters': TEXT.split.bind(TEXT)
  };

  this.alphabets = {
    'unicode': function(factor) {
      return factor.codePointAt(0);
    }
  };

  this._rotate_right = function(list) {
    if (list.length < 2) {
      return list;
    }
    list.unshift(list.pop());
    return list;
  };

  this._rotate_left = function(list) {
    if (list.length < 2) {
      return list;
    }
    list.push(list.shift());
    return list;
  };


  /*
  entries
  entries (what is being indexed)
  alphabet (what is used to index)
   */

}).call(this);

//# sourceMappingURL=../sourcemaps/main.js.map