



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


#-----------------------------------------------------------------------------------------------------------
@new_kwic = ( settings ) ->
  factorizer  = settings?[ 'factorizer' ] ? null
  alphabet    = settings?[ 'alphabet'   ] ? null
  #.........................................................................................................
  R =
    '~isa':         'KWIC/base'
    'entries':      null
    'length':       0
    'entries':      []
    'factors':      null
    'factorizer':   factorizer
    'alphabet':     alphabet
    'weights':      null
  #.........................................................................................................
  if ( entries = settings?[ 'entries' ] )?
    @add R, entry for entry in entries
    if alphabet?
      @factorize
  #.........................................................................................................
  return R

#-----------------------------------------------------------------------------------------------------------
@add = ( me, entry ) ->
  ### TAINT consider to update or delete factors instead ###
  throw new Error "unable to add entries after factorization" if me[ 'factors' ]?
  ( me[ 'entries' ]?= [] ).push entry
  me[ 'length' ] += +1
  return me

#-----------------------------------------------------------------------------------------------------------
@factorize = ( me, factorizer = null ) ->
  ### TAINT consider to update or delete factors instead ###
  throw new Error "unable to factorize another time" if me[ 'factors' ]?
  me[ 'factors' ]   = []
  factorizer       ?= @_get_factorizer me, factorizer
  me[ 'factors' ].push factorizer entry for entry in me[ 'entries' ]
  return me

#-----------------------------------------------------------------------------------------------------------
@_get_factorizer = ( me, factorizer = null ) ->
  factorizer ?= me[ 'factorizer' ] ? 'characters'
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
@add_weights = ( me, alphabet = null ) ->
  ### TAINT consider to factorize transparently ###
  throw new Error "unable to add weights before factorization" unless me[ 'factors' ]?
  ### TAINT consider to update or delete weights instead ###
  throw new Error "unable to factorize another time" if me[ 'weights' ]?
  weighter          = @_get_weighter me, alphabet
  me[ 'weights' ]   = []
  for factor_list in me[ 'factors' ]
    me[ 'weights' ].push ( weighter factor for factor in factor_list )
  return me


#-----------------------------------------------------------------------------------------------------------
@_get_weighter = ( me, alphabet = null ) ->
  alphabet ?= me[ 'alphabet' ] ? 'unicode'
  switch type = CND.type_of alphabet
    when 'function'
      R = alphabet
    when 'text'
      R = @alphabets[ alphabet ]
      throw new Error "unknown alphabet name #{rpr alphabet}" unless R?
    when 'list'
      alphabet_pod = {}
      do -> alphabet_pod[ factor ] = idx for factor, idx in alphabet
      ### TAINT consider to throw error for unknown symbols ###
      R = ( factor ) -> alphabet[ factor ] ? Infinity
    else
      throw new Error "illegal alphabet type #{rpr type}"
  return R


#===========================================================================================================
# FACTORIZERS AND ALPHABETS
#-----------------------------------------------------------------------------------------------------------
@factorizers = {
  'characters':       TEXT.split.bind TEXT
  }

#-----------------------------------------------------------------------------------------------------------
@alphabets = {
  'unicode':          ( factor ) -> factor.codePointAt 0
  }


###
entries
entries (what is being indexed)
alphabet (what is used to index)
###

