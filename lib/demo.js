(function() {
  var CND, KWIC, LODASH, alert, badge, collection, debug, echo, entries, entry, factors, help, i, infix, info, j, len, len1, log, permutation, permutations, prefix, r_weights, rpr, suffix, text, unique_words_from_text, urge, warn, weights, whisper;

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

  text = "a tram also known as tramcar and in north america known as streetcar trolley or trolley car\nis a rail vehicle which runs on tracks along public urban streets called street running and also\nsometimes on separate rights of way the lines or networks operated by tramcars are called tramways\ntramways powered by electricity which were the most common type historically were once called electric\nstreet railways however trams were widely used in urban areas before the universal adoption of\nelectrification and thus the other methods of powering trams is listed below under history\n\ntram lines may also run between cities and or towns for example interurbans tram train and or partially\ngrade separated even in the cities light rail very occasionally trams also carry freight tram vehicles\nare usually lighter and shorter than conventional trains and rapid transit trains but the size of trams\nparticularly light rail vehicles is rapidly increasing some trams for instance tram trains may also run\non ordinary railway tracks a tramway may be upgraded to a light rail or a rapid transit line two urban\ntramways may be connected to an interurban etc\n\nfor all these reasons the differences between the various modes of rail transportation are often\nindistinct\n\ntoday most trams use electrical power usually fed by an overhead pantograph in some cases by a sliding\nshoe on a third rail trolley pole or bow collector if necessary they may have dual power systems\nelectricity in city streets and diesel in more rural environments\n\nin the united states the term tram has sometimes been used for rubber tired trackless trains which are not\nrelated to the other vehicles covered in this article\na b c d e f g h i j k l m n o p q r s t u v w x y z\ncall";

  text = "abcd\nabdc\nacbd\nacdb\nadbc\nadcb\nbacd\nbadc\nbcad\nbcda\nbdac\nbdca\ncabd\ncadb\ncbad\ncbda\ncdab\ncdba\ndabc\ndacb\ndbac\ndbca\ndcab\ndcba\na b c ab ac ba bc ca cb abc acb cab cba bac bca cad cabs cabdriver";

  text = "a b c ab ac ba bc ca cb abc acb cab cba bac bca cad cabs cabdriver";

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

  if (module.parent == null) {
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
    KWIC.report(collection);
    debug('©gm2Im', factors);
  }

}).call(this);

//# sourceMappingURL=../sourcemaps/demo.js.map
