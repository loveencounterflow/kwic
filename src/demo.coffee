



############################################################################################################
# njs_util                  = require 'util'
# njs_path                  = require 'path'
# njs_fs                    = require 'fs'
#...........................................................................................................
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'kwic'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
# suspend                   = require 'coffeenode-suspend'
# step                      = suspend.step
# after                     = suspend.after
# eventually                = suspend.eventually
# immediately               = suspend.immediately
# every                     = suspend.every
TEXT                      = require 'coffeenode-text'
LODASH                    = CND.LODASH
#...........................................................................................................
KWIC                      = require './main'
CODEC                     = require 'hollerith-codec'


text = """a tram also known as tramcar and in north america known as streetcar trolley or trolley car
is a rail vehicle which runs on tracks along public urban streets called street running and also
sometimes on separate rights of way the lines or networks operated by tramcars are called tramways
tramways powered by electricity which were the most common type historically were once called electric
street railways however trams were widely used in urban areas before the universal adoption of
electrification and thus the other methods of powering trams is listed below under history

tram lines may also run between cities and or towns for example interurbans tram train and or partially
grade separated even in the cities light rail very occasionally trams also carry freight tram vehicles
are usually lighter and shorter than conventional trains and rapid transit trains but the size of trams
particularly light rail vehicles is rapidly increasing some trams for instance tram trains may also run
on ordinary railway tracks a tramway may be upgraded to a light rail or a rapid transit line two urban
tramways may be connected to an interurban etc

for all these reasons the differences between the various modes of rail transportation are often
indistinct

today most trams use electrical power usually fed by an overhead pantograph in some cases by a sliding
shoe on a third rail trolley pole or bow collector if necessary they may have dual power systems
electricity in city streets and diesel in more rural environments

in the united states the term tram has sometimes been used for rubber tired trackless trains which are not
related to the other vehicles covered in this article
a b c d e f g h i j k l m n o p q r s t u v w x y z
call
"""

# text = """a e costarica america abcde acute ab ac ad"""
# text = """a b c ab ac ba bc ca cb abc acb cab cba bac bca cad"""

# text = """
# all
# call
# called
# usually
# partially
# partiallys
# historically
# xxxxxxxcally
# xxxxxxxcallx
# xxxxxxcallx
# occasionally
# along
# also
# """

#-----------------------------------------------------------------------------------------------------------
exclude_long_words = ( words, max_length = Infinity ) ->
  return words[ .. ] if max_length is Infinity
  ### TAINT uses code units, not character count ###
  return words.filter ( word ) => word.length <= max_length

#-----------------------------------------------------------------------------------------------------------
unique_words_from_text = ( text, max_length = Infinity ) ->
  words = text.split /\s+/
  words = ( word for word in words when word.length > 0 )
  words.sort()
  words = LODASH.uniq words, true
  return exclude_long_words words, max_length

#-----------------------------------------------------------------------------------------------------------
# factors_from_word = ( word ) -> TEXT.split word

#-----------------------------------------------------------------------------------------------------------
factorize = ( entries, factorizer = null ) ->
  factorizer ?= TEXT.split.bind TEXT
  return ( [ ( factorizer entry ), entry, ] for entry in entries )

#-----------------------------------------------------------------------------------------------------------
find_longest_word = ( words ) ->
  R = -Infinity
  R = Math.max R, chrs.length for [ _, chrs, ] in words
  return R

#-----------------------------------------------------------------------------------------------------------
_reverse = ( text ) -> ( TEXT.split text ).reverse().join ''

#-----------------------------------------------------------------------------------------------------------
add_lineups = ( factors_and_entries, max_lc, width ) ->
  # padding_width       = max_lc - 1
  padding_width       = ( width - 1 ) / 2
  right_padding_width = width               + padding_width
  left_padding_width  = right_padding_width + padding_width
  help 'padding_width:       ', padding_width
  help 'right_padding_width: ', right_padding_width
  help 'left_padding_width:  ', left_padding_width
  #.........................................................................................................
  for [ factors, word, ], word_idx in factors_and_entries
    last_idx = factors.length - 1 + padding_width
    factors.push     ' ' while factors.length < right_padding_width
    factors.unshift  ' ' while factors.length <  left_padding_width
    permutations = []
    for idx in [ padding_width .. last_idx ]
      infix     = factors[ idx ]
      suffix    = factors[ idx + 1 .. idx + padding_width ].join ''
      prefix_A  = factors[ idx - padding_width .. idx - 1 ].join ''
      ### TAINT to be replaced by principled implementation ###
      prefix_B  = _reverse prefix_A
      # permutations.push [ infix, prefix_B, suffix, prefix_A, ].join ','
      permutations.push [ infix, suffix, prefix_B, prefix_A, ].join ','
    factors_and_entries[ word_idx ][ 1 ] = permutations
  #.........................................................................................................
  return factors_and_entries

#-----------------------------------------------------------------------------------------------------------
permute = ( words ) ->
  R = []
  #.........................................................................................................
  for [ word, lineups, ] in words
    for lineup in lineups
      R.push [ lineup, word, ]
  #.........................................................................................................
  R.sort ( a, b ) ->
    return +1 if a[ 0 ] > b[ 0 ]
    return -1 if a[ 0 ] < b[ 0 ]
    return  0
  #.........................................................................................................
  return R

#-----------------------------------------------------------------------------------------------------------
report = ( permutations ) ->
  for [ lineup, word, ] in permutations
    # [ infix, prefix_B, suffix, prefix_A, ]  = lineup.split ','
    # lineup                                  = prefix_A + '' + infix + '|' + suffix
    [ infix, suffix, prefix_B, prefix_A, ]  = lineup.split ','
    lineup                                  = prefix_A + '|' + infix + '' + suffix
    help lineup, ' ', word
  return null

###
resolve_letters words
# words         = exclude_long_words words
###


############################################################################################################
unless module.parent?
  kwic    = KWIC.new_kwic()
  entries = unique_words_from_text text
  KWIC.add kwic, entry for entry in entries
  alphabet = [
    'a', 'b', 'c', 'd',
    'e', 'f', 'g', 'h',
    'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z',
    ]
  KWIC.factorize kwic
  KWIC.add_weights kwic
  KWIC.permute kwic
  KWIC.sort kwic

  for [ key, weight_idx, weights, lineup, entry, ] in kwic[ 'facets' ]
    [ prefix, infix, suffix, ] = lineup
    prefix.unshift ' ' until prefix.length >= 10
    suffix.push    ' ' until suffix.length >= 10
    prefix    = prefix.join ''
    suffix    = suffix.join ''
    weights   = weights.join '-'
    help prefix + '|' + infix + suffix, entry, weights

  # factors_and_entries = factorize entries
  # max_lc              = find_longest_word factors_and_entries
  # width               = 2 * ( max_lc - 1 ) + 1
  # entries_and_lineups = add_lineups factors_and_entries, max_lc, width
  # permutations        = permute entries_and_lineups
  # report permutations















