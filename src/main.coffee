



############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'KWIC'
<<<<<<< HEAD
# log                       = CND.get_logger 'plain',     badge
# info                      = CND.get_logger 'info',      badge
# whisper                   = CND.get_logger 'whisper',   badge
# alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
# warn                      = CND.get_logger 'warn',      badge
=======
>>>>>>> 6af784ec3127a9807d2ea4ccc4ecad1d924f3ef2
help                      = CND.get_logger 'help',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
CODEC                     = require 'hollerith-codec'


#-----------------------------------------------------------------------------------------------------------
@get_factors = ( entry, factorizer = null ) ->
  factorizer = @_get_factorizer factorizer
  return factorizer entry

#-----------------------------------------------------------------------------------------------------------
@_get_factorizer = ( factorizer = 'characters' ) ->
  switch type = CND.type_of factorizer
    when 'function'
      R = factorizer
    when 'text'
      R = @factorizers[ factorizer ]
      throw new Error "unknown factorizer name #{rpr factorizer}" unless R?
    else
      throw new Error "illegal factorizer type #{rpr type}"
  return R

#-----------------------------------------------------------------------------------------------------------
@get_weights = ( factors, alphabet = 'unicode' ) ->
  weighter  = @_get_weighter alphabet
  R         = []
  for factor in factors
    R.push weight = weighter factor
    throw new Error "factor not in alphabet: #{rpr factor}" if weight is undefined
  return R

#-----------------------------------------------------------------------------------------------------------
@_get_weighter = ( alphabet = 'unicode' ) ->
  switch type = CND.type_of alphabet
    #.......................................................................................................
    when 'function'
      R = alphabet
    #.......................................................................................................
    when 'text'
      R = @alphabets[ alphabet ]
      throw new Error "unknown alphabet name #{rpr alphabet}" unless R?
    #.......................................................................................................
    when 'list'
      alphabet_pod = {}
      do -> alphabet_pod[ factor ] = idx for factor, idx in alphabet
      R = ( factor ) -> alphabet[ factor ]
    #.......................................................................................................
    else
      throw new Error "illegal alphabet type #{rpr type}"
  #.........................................................................................................
  return R

#-----------------------------------------------------------------------------------------------------------
@get_permutations = ( factors, weights, zero = null ) ->
  R = []
  #.........................................................................................................
  weights           = weights[ .. ]
  permutation_count = weights.length
  weights.push zero
  for infix_idx in [ 0 ... permutation_count ]
    prefix    = factors[ ... infix_idx ]
    infix     = factors[ infix_idx ]
    suffix    = factors[ infix_idx + 1 .. ]
    ### Here we reverse the order of weights in the 'suffix' part of the weights (the part that comes
    behind the guard value); this means that both prefix and suffix weights that are closer to the
    infix have a stronger influence on the sorting than those that are further away. ###
    r_idx     = permutation_count - infix_idx
    r_weights = weights[ .. r_idx ].concat weights[ r_idx + 1 .. ].reverse()
    R.push [ r_weights, infix, suffix, prefix, ]
    #.....................................................................................................
    # weights   = weights[ .. ]
    @_rotate_left weights
  #.........................................................................................................
  return R

#-----------------------------------------------------------------------------------------------------------
@permute = ( entry, settings ) ->
  factorizer  = settings?[ 'factorizer' ] ? null
  alphabet    = settings?[ 'alphabet'   ] ? null
  zero        = settings?[ 'zero'       ] ? null
  factors     = @get_factors   entry,   factorizer
  weights     = @get_weights   factors, alphabet
  return @get_permutations factors, weights, zero

#-----------------------------------------------------------------------------------------------------------
@sort = ( collection ) ->
  facets = []
  #.........................................................................................................
  for [ permutations, entry, ] in collection
    for key in permutations
      bkey = CODEC.encode key
      facets.push [ bkey, key, entry, ]
  facets.sort ( a, b ) -> a[ 0 ].compare b[ 0 ]
  #.........................................................................................................
  return ( [ prefix, infix, suffix, entry, ] for [ _, [ _, infix, suffix, prefix, ], entry, ] in facets )

#-----------------------------------------------------------------------------------------------------------
@report = ( collection, settings ) ->
  padder    = settings?[ 'padder'    ] ? ' '
  separator = settings?[ 'separator' ] ? '|'
  joiner    = settings?[ 'joiner'    ] ? ''
  show      = if process.stdout.isTTY then help else echo
  #.........................................................................................................
  lineups_and_entries = @sort collection
  #.........................................................................................................
  max_length = -Infinity
  for [ prefix, infix, suffix, entry, ] in lineups_and_entries
    length      = infix.length
    length     += part.length for part in prefix
    max_length  = Math.max max_length, length
  #.........................................................................................................
  for [ prefix, infix, suffix, entry, ] in lineups_and_entries
    prefix        = prefix[ ... ]
    suffix        = suffix[ ... ]
    prefix_length = 0; prefix_length += part.length for part in prefix
    suffix_length = 0; suffix_length += part.length for part in suffix
    prefix.unshift padder for _ in [ 0 ... max_length - prefix_length ] by +1
    # debug '©L9201', entry, infix, suffix
    suffix.push    padder for _ in [ 0 ... max_length - ( suffix_length + infix.length ) ] by +1
    prefix    = prefix.join joiner
    suffix    = suffix.join joiner
    entry     = if CND.isa_text entry then entry else rpr entry
    show prefix + separator + infix + suffix + padder + entry
  #.........................................................................................................
  return null


#===========================================================================================================
# FACTORIZERS AND ALPHABETS
#-----------------------------------------------------------------------------------------------------------
@factorizers = {
  'characters':       ( text ) -> Array.from text
  'syllables':        ( text ) -> text.split '-'
  }

#-----------------------------------------------------------------------------------------------------------
@alphabets = {
  'unicode':          ( factor ) -> factor.codePointAt 0
  }


#===========================================================================================================
# HELPERS
#-----------------------------------------------------------------------------------------------------------
@_rotate_left = ( list ) ->
  return list if list.length < 2
  list.push list.shift()
  return list

# #-----------------------------------------------------------------------------------------------------------
# @_rotate_right = ( list ) ->
#   return list if list.length < 2
#   list.unshift list.pop()
#   return list

