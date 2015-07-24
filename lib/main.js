(function() {
  var CND, LODASH, TEXT, alert, badge, debug, echo, help, info, log, rpr, urge, warn, whisper;

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

  LODASH = CND.LODASH;

  this.new_kwic = function(settings) {
    var R, alphabet, entries, entry, factorizer, i, len, ref, ref1;
    factorizer = (ref = settings != null ? settings['factorizer'] : void 0) != null ? ref : null;
    alphabet = (ref1 = settings != null ? settings['alphabet'] : void 0) != null ? ref1 : null;
    R = {
      '~isa': 'KWIC/base',
      'entries': null,
      'length': 0,
      'entries': [],
      'factors': null,
      'factorizer': factorizer,
      'alphabet': alphabet,
      'weights': null,
      'normalize-lengths': true,
      'max-length': -Infinity,
      'is-positioned': false
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
    me['length'] += +1;
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
      me['max-length'] = Math.max(me['max-length'], facl);
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

  this.add_positions = function(me, positioner) {
    var i, idx, j, len, len1, ref, weight, weights_list;
    if (positioner == null) {
      positioner = null;
    }

    /* TAINT consider to update or delete factors instead */
    if (me['is-positioned']) {
      throw new Error("unable to position another time");
    }
    if (me['weights'] == null) {
      throw new Error("must first add weights");
    }
    if (positioner == null) {
      positioner = this._get_positioner(me, positioner);
    }
    ref = me['weights'];
    for (i = 0, len = ref.length; i < len; i++) {
      weights_list = ref[i];
      for (idx = j = 0, len1 = weights_list.length; j < len1; idx = ++j) {
        weight = weights_list[idx];
        xxx;
      }
    }
    return me;
  };

  this._get_positioner = function(me, positioner) {
    var R, ref, type;
    if (positioner == null) {
      positioner = null;
    }
    if (positioner == null) {
      positioner = (ref = me['positioner']) != null ? ref : 'characters';
    }
    switch (type = CND.type_of(positioner)) {
      case 'function':
        R = positioner;
        break;
      case 'text':
        R = this.positioners[positioner];
        if (R == null) {
          throw new Error("unknown positioner name " + (rpr(positioner)));
        }
        break;
      default:
        throw new Error("illegal positioner type " + (rpr(type)));
    }
    return R;
  };

  this.factorizers = {
    'characters': TEXT.split.bind(TEXT)
  };

  this.alphabets = {
    'unicode': function(factor) {
      return factor.codePointAt(0);
    }
  };


  /*
  entries
  entries (what is being indexed)
  alphabet (what is used to index)
   */

}).call(this);

//# sourceMappingURL=../sourcemaps/main.js.map