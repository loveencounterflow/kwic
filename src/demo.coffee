



############################################################################################################
# njs_util                  = require 'util'
# njs_path                  = require 'path'
# njs_fs                    = require 'fs'
#...........................................................................................................
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'KWIC/demo'
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
# TEXT                      = require 'coffeenode-text'
LODASH                    = CND.LODASH
#...........................................................................................................
KWIC                      = require './main'
CODEC                     = require 'hollerith-codec'


# text = """a tram also known as tramcar and in north america known as streetcar trolley or trolley car
# is a rail vehicle which runs on tracks along public urban streets called street running and also
# sometimes on separate rights of way the lines or networks operated by tramcars are called tramways
# tramways powered by electricity which were the most common type historically were once called electric
# street railways however trams were widely used in urban areas before the universal adoption of
# electrification and thus the other methods of powering trams is listed below under history

# tram lines may also run between cities and or towns for example interurbans tram train and or partially
# grade separated even in the cities light rail very occasionally trams also carry freight tram vehicles
# are usually lighter and shorter than conventional trains and rapid transit trains but the size of trams
# particularly light rail vehicles is rapidly increasing some trams for instance tram trains may also run
# on ordinary railway tracks a tramway may be upgraded to a light rail or a rapid transit line two urban
# tramways may be connected to an interurban etc

# for all these reasons the differences between the various modes of rail transportation are often
# indistinct

# today most trams use electrical power usually fed by an overhead pantograph in some cases by a sliding
# shoe on a third rail trolley pole or bow collector if necessary they may have dual power systems
# electricity in city streets and diesel in more rural environments

# in the united states the term tram has sometimes been used for rubber tired trackless trains which are not
# related to the other vehicles covered in this article
# a b c d e f g h i j k l m n o p q r s t u v w x y z
# call
# """

# # text = """a e costarica america abcde acute ab ac ad"""
# text = """
# abcd
# abdc
# acbd
# acdb
# adbc
# adcb
# bacd
# badc
# bcad
# bcda
# bdac
# bdca
# cabd
# cadb
# cbad
# cbda
# cdab
# cdba
# dabc
# dacb
# dbac
# dbca
# dcab
# dcba
# a b c ab ac ba bc ca cb abc acb cab cba bac bca cad cabs cabdriver"""



# text = ( require 'fs' ).readFileSync '/Volumes/Storage/io/wordlists/top10000de.txt', 'utf-8'
# text = text.replace /^#.*/, ''
# text = text.toLowerCase()
# lines = text.split '\n'
# lines = ( line for line in lines when not ( /^\s*#/ ).test line )
# text = lines.join ' '

# text = """a b c ab ac"""

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

texts =
  trains: """
    gleis-drei-eck
    ei-sen-bahn
    mo-dell-bahn
    bahn-mo-dell
    gleis-bau
    drei-eck
    bahn-gleis
    gleis
    bahn-schran-ke
    bahn-hof
    neben-bahn
    klein-bahn
    auto-bahn
    auto-fahrt
    auto-fahr-er
    bahn-fahr-kar-te
    bahn-fahrt
    zug-fahrt
    bahn-fahr-er
    auto-zug
    """

#-----------------------------------------------------------------------------------------------------------
unique_words_from_text = ( text ) ->
  words = text.split /\s+/
  words = ( word for word in words when word.length > 0 )
  words.sort()
  return LODASH.uniq words, true

#-----------------------------------------------------------------------------------------------------------
demo_1 = ->
  # text        = """a b c ab ac ba bc ca cb abc acb cab cba bac bca cad cabs cabdriver"""
  text        = texts[ 'trains' ]
  text        = text.replace /-/g, ''
  entries     = unique_words_from_text text
  collection  = []
  for entry in entries
    factors       = KWIC.get_factors      entry
    weights       = KWIC.get_weights      factors
    permutations  = KWIC.get_permutations factors, weights
    collection.push [ permutations, entry, ]
    for permutation in permutations
      # debug '©uhwuc', permutation, entry
      [ r_weights, infix, suffix, prefix, ] = permutation
  KWIC.report collection

#-----------------------------------------------------------------------------------------------------------
demo_2 = ->
  text        = texts[ 'trains' ]
  entries     = unique_words_from_text text
  collection  = []
  for entry in entries
    factors       = KWIC.get_factors entry, ( text ) ->
      return ( "(#{part})" for part in text.split '-' )
    weights       = KWIC.get_weights factors, ( factor ) ->
      chrs = Array.from factor
      chrs = chrs[ 1 ... chrs.length - 1 ]
      return ( chr.codePointAt 0 for chr in chrs )
    # debug '©GFNKC', weights
    permutations  = KWIC.get_permutations factors, weights
    display       = entry.replace /-/g, ''
    collection.push [ permutations, display, ]
    # for permutation in permutations
    #   [ r_weights, infix, suffix, prefix, ] = permutation
  KWIC.report collection


############################################################################################################
unless module.parent?
  demo_1()
  demo_2()


  # echo()
  # entries     = unique_words_from_text text
  # collection  = []
  # for entry in entries
  #   collection.push [ ( KWIC.permute entry ), entry, ]
  # KWIC.report collection
  # debug '©BX7Tw', CODEC[ 'keys' ][ 'lo' ]

  # demo_permute = ->
  #   d   = [ 'a', 'b', 'c', 'd', ]
  #   nr  = 0
  #   loop
  #     nr += +1
  #     help nr, d.join ''
  #     break unless CND.ez_permute d
  # demo_permute()








