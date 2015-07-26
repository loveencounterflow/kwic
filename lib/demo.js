(function() {
  var CND, CODEC, KWIC, LODASH, TEXT, _reverse, add_lineups, alert, alphabet, badge, debug, echo, entries, entry, exclude_long_words, factorize, find_longest_word, help, i, infix, info, j, key, kwic, len, len1, lineup, log, permute, prefix, ref, ref1, report, rpr, suffix, text, unique_words_from_text, urge, warn, weight_idx, weights, whisper;

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

  KWIC = require('./main');

  CODEC = require('hollerith-codec');

  text = "a tram also known as tramcar and in north america known as streetcar trolley or trolley car\nis a rail vehicle which runs on tracks along public urban streets called street running and also\nsometimes on separate rights of way the lines or networks operated by tramcars are called tramways\ntramways powered by electricity which were the most common type historically were once called electric\nstreet railways however trams were widely used in urban areas before the universal adoption of\nelectrification and thus the other methods of powering trams is listed below under history\n\ntram lines may also run between cities and or towns for example interurbans tram train and or partially\ngrade separated even in the cities light rail very occasionally trams also carry freight tram vehicles\nare usually lighter and shorter than conventional trains and rapid transit trains but the size of trams\nparticularly light rail vehicles is rapidly increasing some trams for instance tram trains may also run\non ordinary railway tracks a tramway may be upgraded to a light rail or a rapid transit line two urban\ntramways may be connected to an interurban etc\n\nfor all these reasons the differences between the various modes of rail transportation are often\nindistinct\n\ntoday most trams use electrical power usually fed by an overhead pantograph in some cases by a sliding\nshoe on a third rail trolley pole or bow collector if necessary they may have dual power systems\nelectricity in city streets and diesel in more rural environments\n\nin the united states the term tram has sometimes been used for rubber tired trackless trains which are not\nrelated to the other vehicles covered in this article\na b c d e f g h i j k l m n o p q r s t u v w x y z\ncall";

  exclude_long_words = function(words, max_length) {
    if (max_length == null) {
      max_length = Infinity;
    }
    if (max_length === Infinity) {
      return words.slice(0);
    }

    /* TAINT uses code units, not character count */
    return words.filter((function(_this) {
      return function(word) {
        return word.length <= max_length;
      };
    })(this));
  };

  unique_words_from_text = function(text, max_length) {
    var word, words;
    if (max_length == null) {
      max_length = Infinity;
    }
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
    words = LODASH.uniq(words, true);
    return exclude_long_words(words, max_length);
  };

  factorize = function(entries, factorizer) {
    var entry;
    if (factorizer == null) {
      factorizer = null;
    }
    if (factorizer == null) {
      factorizer = TEXT.split.bind(TEXT);
    }
    return (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = entries.length; i < len; i++) {
        entry = entries[i];
        results.push([factorizer(entry), entry]);
      }
      return results;
    })();
  };

  find_longest_word = function(words) {
    var R, _, chrs, i, len, ref;
    R = -Infinity;
    for (i = 0, len = words.length; i < len; i++) {
      ref = words[i], _ = ref[0], chrs = ref[1];
      R = Math.max(R, chrs.length);
    }
    return R;
  };

  _reverse = function(text) {
    return (TEXT.split(text)).reverse().join('');
  };

  add_lineups = function(factors_and_entries, max_lc, width) {
    var factors, i, idx, infix, j, last_idx, left_padding_width, len, padding_width, permutations, prefix_A, prefix_B, ref, ref1, ref2, right_padding_width, suffix, word, word_idx;
    padding_width = (width - 1) / 2;
    right_padding_width = width + padding_width;
    left_padding_width = right_padding_width + padding_width;
    help('padding_width:       ', padding_width);
    help('right_padding_width: ', right_padding_width);
    help('left_padding_width:  ', left_padding_width);
    for (word_idx = i = 0, len = factors_and_entries.length; i < len; word_idx = ++i) {
      ref = factors_and_entries[word_idx], factors = ref[0], word = ref[1];
      last_idx = factors.length - 1 + padding_width;
      while (factors.length < right_padding_width) {
        factors.push(' ');
      }
      while (factors.length < left_padding_width) {
        factors.unshift(' ');
      }
      permutations = [];
      for (idx = j = ref1 = padding_width, ref2 = last_idx; ref1 <= ref2 ? j <= ref2 : j >= ref2; idx = ref1 <= ref2 ? ++j : --j) {
        infix = factors[idx];
        suffix = factors.slice(idx + 1, +(idx + padding_width) + 1 || 9e9).join('');
        prefix_A = factors.slice(idx - padding_width, +(idx - 1) + 1 || 9e9).join('');

        /* TAINT to be replaced by principled implementation */
        prefix_B = _reverse(prefix_A);
        permutations.push([infix, suffix, prefix_B, prefix_A].join(','));
      }
      factors_and_entries[word_idx][1] = permutations;
    }
    return factors_and_entries;
  };

  permute = function(words) {
    var R, i, j, len, len1, lineup, lineups, ref, word;
    R = [];
    for (i = 0, len = words.length; i < len; i++) {
      ref = words[i], word = ref[0], lineups = ref[1];
      for (j = 0, len1 = lineups.length; j < len1; j++) {
        lineup = lineups[j];
        R.push([lineup, word]);
      }
    }
    R.sort(function(a, b) {
      if (a[0] > b[0]) {
        return +1;
      }
      if (a[0] < b[0]) {
        return -1;
      }
      return 0;
    });
    return R;
  };

  report = function(permutations) {
    var i, infix, len, lineup, prefix_A, prefix_B, ref, ref1, suffix, word;
    for (i = 0, len = permutations.length; i < len; i++) {
      ref = permutations[i], lineup = ref[0], word = ref[1];
      ref1 = lineup.split(','), infix = ref1[0], suffix = ref1[1], prefix_B = ref1[2], prefix_A = ref1[3];
      lineup = prefix_A + '|' + infix + '' + suffix;
      help(lineup, ' ', word);
    }
    return null;
  };


  /*
  resolve_letters words
   * words         = exclude_long_words words
   */

  if (module.parent == null) {
    kwic = KWIC.new_kwic();
    entries = unique_words_from_text(text);
    for (i = 0, len = entries.length; i < len; i++) {
      entry = entries[i];
      KWIC.add(kwic, entry);
    }
    alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    KWIC.factorize(kwic);
    KWIC.add_weights(kwic);
    KWIC.permute(kwic);
    KWIC.sort(kwic);
    ref = kwic['facets'];
    for (j = 0, len1 = ref.length; j < len1; j++) {
      ref1 = ref[j], key = ref1[0], weight_idx = ref1[1], weights = ref1[2], lineup = ref1[3], entry = ref1[4];
      prefix = lineup[0], infix = lineup[1], suffix = lineup[2];
      while (!(prefix.length >= 10)) {
        prefix.unshift(' ');
      }
      while (!(suffix.length >= 10)) {
        suffix.push(' ');
      }
      prefix = prefix.join('');
      suffix = suffix.join('');
      weights = weights.join('-');
      help(prefix + '|' + infix + suffix, entry, weights);
    }
  }

}).call(this);

//# sourceMappingURL=../sourcemaps/demo.js.map