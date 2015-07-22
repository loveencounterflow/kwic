



############################################################################################################
njs_util                  = require 'util'
njs_path                  = require 'path'
njs_fs                    = require 'fs'
#...........................................................................................................
# BAP                       = require 'coffeenode-bitsnpieces'
# BNP                       = require 'coffeenode-bitsnpieces'
# TYPES                     = require 'coffeenode-types'
# TRM                       = require 'coffeenode-trm'
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'scratch'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
rainbow                   = CND.rainbow.bind CND
suspend                   = require 'coffeenode-suspend'
step                      = suspend.step
after                     = suspend.after
eventually                = suspend.eventually
immediately               = suspend.immediately
every                     = suspend.every
TEXT                      = require 'coffeenode-text'
LODASH                    = CND.LODASH

words = """a tram also known as tramcar and in north america known as streetcar trolley or trolley car
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

# words = """
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
words = words.split /\s+/
words = ( word for word in words when word.length > 0 )
words.sort()
words = LODASH.uniq words, true


#-----------------------------------------------------------------------------------------------------------
resolve_letters = ( words ) ->
  for word, idx in words  
    chrs = TEXT.split word
    words[ idx ] = [ word, chrs, ]
  return words

#-----------------------------------------------------------------------------------------------------------
exclude_long_words = ( words ) ->
  return words.filter ( [ word, chrs, ] ) => chrs.length < 6

#-----------------------------------------------------------------------------------------------------------
find_longest_word = ( words ) ->
  R = -Infinity
  R = Math.max R, chrs.length for [ _, chrs, ] in words
  return R

#-----------------------------------------------------------------------------------------------------------
_reverse = ( text ) -> ( TEXT.split text ).reverse().join ''

#-----------------------------------------------------------------------------------------------------------
add_lineups = ( words, max_lc, width ) ->
  # padding_width       = max_lc - 1
  padding_width       = ( width - 1 ) / 2
  right_padding_width = width               + padding_width
  left_padding_width  = right_padding_width + padding_width
  help 'padding_width:       ', padding_width
  help 'right_padding_width: ', right_padding_width
  help 'left_padding_width:  ', left_padding_width
  for [ word, chrs, ], word_idx in words
    last_idx = chrs.length - 1 + padding_width
    chrs.push     ' ' while chrs.length < right_padding_width
    chrs.unshift  ' ' while chrs.length <  left_padding_width
    permutations = []
    for idx in [ padding_width .. last_idx ]
      infix     = chrs[ idx ]
      suffix    = chrs[ idx + 1 .. idx + padding_width ].join ''
      prefix_A  = chrs[ idx - padding_width .. idx - 1 ].join ''
      ### TAINT to be replaced by principled implementation ###
      prefix_B  = _reverse prefix_A
      # permutations.push [ infix, prefix_B, suffix, prefix_A, ].join ','
      permutations.push [ infix, suffix, prefix_B, prefix_A, ].join ','
    words[ word_idx ][ 1 ] = permutations
  return words

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

#-----------------------------------------------------------------------------------------------------------
resolve_letters words
# words         = exclude_long_words words
max_lc        = find_longest_word words
width         = 2 * ( max_lc - 1 ) + 1
words         = add_lineups words, max_lc, width
permutations  = permute words
report permutations

# # for word in words
# word = 'the'
# find_all_idxs = ( text, word ) ->
#   R         = []
#   position  = -1
#   while ( idx = text.indexOf word, position + 1 ) > -1
#     position = idx
#     R.push idx
#   return R

# joiner  = CND.grey ' # '
# g       = CND.GREEN
# r       = CND.RED
# for word in words
#   for idx in find_all_idxs text, word
#     prefix  = text[ idx - 10 .. idx - 1 ].join ' '
#     infix   = text[ idx ]
#     suffix  = text[ idx + 1 .. idx + 10 ].join ' '
#     prefix  = prefix[ prefix.length - 30  ... prefix.length ]
#     suffix  = suffix[ 0                   ... 30 ]
#     prefix  = TEXT.flush_right prefix, 30
#     suffix  = TEXT.flush_left  suffix, 30
#     help ( g prefix ) + joiner + ( r infix ) + joiner + ( g suffix )

