(function() {
  var CND, CODEC, KWIC, LODASH, alert, badge, debug, demo_1, demo_2, echo, help, info, log, rpr, texts, unique_words_from_text, urge, warn, whisper;

  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'KWIC/demo';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  LODASH = CND.LODASH;

  KWIC = require('./main');

  CODEC = require('hollerith-codec');

  texts = {
    trains: "gleis-drei-eck\nei-sen-bahn\nmo-dell-bahn\nbahn-mo-dell\ngleis-bau\ndrei-eck\nbahn-gleis\ngleis\nbahn-schran-ke\nbahn-hof\nneben-bahn\nklein-bahn\nauto-bahn\nauto-fahrt\nauto-fahr-er\nbahn-fahr-kar-te\nbahn-fahrt\nzug-fahrt\nbahn-fahr-er\nauto-zug"
  };

  unique_words_from_text = function(text) {
    var word, words;
    words = text.split(/\s+/);
    words = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = words.length; i < len; i++) {
        word = words[i];
        if (word.length > 0) {
          results.push(word);
        }
      }
      return results;
    })();
    words.sort();
    return LODASH.uniq(words, true);
  };

  demo_1 = function() {
    var collection, entries, entry, factors, i, infix, j, len, len1, permutation, permutations, prefix, r_weights, suffix, text, weights;
    text = texts['trains'];
    text = text.replace(/-/g, '');
    entries = unique_words_from_text(text);
    collection = [];
    for (i = 0, len = entries.length; i < len; i++) {
      entry = entries[i];
      factors = KWIC.get_factors(entry);
      weights = KWIC.get_weights(factors);
      permutations = KWIC.get_permutations(factors, weights);
      collection.push([permutations, entry]);
      for (j = 0, len1 = permutations.length; j < len1; j++) {
        permutation = permutations[j];
        r_weights = permutation[0], infix = permutation[1], suffix = permutation[2], prefix = permutation[3];
      }
    }
    return KWIC.report(collection);
  };

  demo_2 = function() {
    var collection, display, entries, entry, factors, i, len, permutations, text, weights;
    text = texts['trains'];
    entries = unique_words_from_text(text);
    collection = [];
    for (i = 0, len = entries.length; i < len; i++) {
      entry = entries[i];
      factors = KWIC.get_factors(entry, function(text) {
        var part;
        return (function() {
          var j, len1, ref, results;
          ref = text.split('-');
          results = [];
          for (j = 0, len1 = ref.length; j < len1; j++) {
            part = ref[j];
            results.push("(" + part + ")");
          }
          return results;
        })();
      });
      weights = KWIC.get_weights(factors, function(factor) {
        var chr, chrs;
        chrs = Array.from(factor);
        chrs = chrs.slice(1, chrs.length - 1);
        return (function() {
          var j, len1, results;
          results = [];
          for (j = 0, len1 = chrs.length; j < len1; j++) {
            chr = chrs[j];
            results.push(chr.codePointAt(0));
          }
          return results;
        })();
      });
      permutations = KWIC.get_permutations(factors, weights);
      display = entry.replace(/-/g, '');
      collection.push([permutations, display]);
    }
    return KWIC.report(collection);
  };

  if (module.parent == null) {
    demo_1();
    demo_2();
  }

}).call(this);

//# sourceMappingURL=../sourcemaps/demo.js.map