(function() {
  var CND, LODASH, TEXT, _reverse, add_lineups, alert, badge, debug, echo, exclude_long_words, find_longest_word, help, info, log, max_lc, permutations, permute, report, resolve_letters, rpr, urge, warn, whisper, width, word, words;

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

  words = "a tram also known as tramcar and in north america known as streetcar trolley or trolley car\nis a rail vehicle which runs on tracks along public urban streets called street running and also\nsometimes on separate rights of way the lines or networks operated by tramcars are called tramways\ntramways powered by electricity which were the most common type historically were once called electric\nstreet railways however trams were widely used in urban areas before the universal adoption of\nelectrification and thus the other methods of powering trams is listed below under history\n\ntram lines may also run between cities and or towns for example interurbans tram train and or partially\ngrade separated even in the cities light rail very occasionally trams also carry freight tram vehicles\nare usually lighter and shorter than conventional trains and rapid transit trains but the size of trams\nparticularly light rail vehicles is rapidly increasing some trams for instance tram trains may also run\non ordinary railway tracks a tramway may be upgraded to a light rail or a rapid transit line two urban\ntramways may be connected to an interurban etc\n\nfor all these reasons the differences between the various modes of rail transportation are often\nindistinct\n\ntoday most trams use electrical power usually fed by an overhead pantograph in some cases by a sliding\nshoe on a third rail trolley pole or bow collector if necessary they may have dual power systems\nelectricity in city streets and diesel in more rural environments\n\nin the united states the term tram has sometimes been used for rubber tired trackless trains which are not\nrelated to the other vehicles covered in this article\na b c d e f g h i j k l m n o p q r s t u v w x y z\ncall";

  words = words.split(/\s+/);

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

  resolve_letters = function(words) {
    var chrs, i, idx, len;
    for (idx = i = 0, len = words.length; i < len; idx = ++i) {
      word = words[idx];
      chrs = TEXT.split(word);
      words[idx] = [word, chrs];
    }
    return words;
  };

  exclude_long_words = function(words) {
    return words.filter((function(_this) {
      return function(arg) {
        var chrs, word;
        word = arg[0], chrs = arg[1];
        return chrs.length < 6;
      };
    })(this));
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

  add_lineups = function(words, max_lc, width) {
    var chrs, i, idx, infix, j, last_idx, left_padding_width, len, padding_width, permutations, prefix_A, prefix_B, ref, ref1, ref2, right_padding_width, suffix, word_idx;
    padding_width = (width - 1) / 2;
    right_padding_width = width + padding_width;
    left_padding_width = right_padding_width + padding_width;
    help('padding_width:       ', padding_width);
    help('right_padding_width: ', right_padding_width);
    help('left_padding_width:  ', left_padding_width);
    for (word_idx = i = 0, len = words.length; i < len; word_idx = ++i) {
      ref = words[word_idx], word = ref[0], chrs = ref[1];
      last_idx = chrs.length - 1 + padding_width;
      while (chrs.length < right_padding_width) {
        chrs.push(' ');
      }
      while (chrs.length < left_padding_width) {
        chrs.unshift(' ');
      }
      permutations = [];
      for (idx = j = ref1 = padding_width, ref2 = last_idx; ref1 <= ref2 ? j <= ref2 : j >= ref2; idx = ref1 <= ref2 ? ++j : --j) {
        infix = chrs[idx];
        suffix = chrs.slice(idx + 1, +(idx + padding_width) + 1 || 9e9).join('');
        prefix_A = chrs.slice(idx - padding_width, +(idx - 1) + 1 || 9e9).join('');

        /* TAINT to be replaced by principled implementation */
        prefix_B = _reverse(prefix_A);
        permutations.push([infix, suffix, prefix_B, prefix_A].join(','));
      }
      words[word_idx][1] = permutations;
    }
    return words;
  };

  permute = function(words) {
    var R, i, j, len, len1, lineup, lineups, ref;
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
    var i, infix, len, lineup, prefix_A, prefix_B, ref, ref1, suffix;
    for (i = 0, len = permutations.length; i < len; i++) {
      ref = permutations[i], lineup = ref[0], word = ref[1];
      ref1 = lineup.split(','), infix = ref1[0], suffix = ref1[1], prefix_B = ref1[2], prefix_A = ref1[3];
      lineup = prefix_A + '|' + infix + '' + suffix;
      help(lineup, ' ', word);
    }
    return null;
  };

  resolve_letters(words);

  max_lc = find_longest_word(words);

  width = 2 * (max_lc - 1) + 1;

  words = add_lineups(words, max_lc, width);

  permutations = permute(words);

  report(permutations);

}).call(this);

//# sourceMappingURL=../sourcemaps/main.js.map