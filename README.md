

- [KWIC](#kwic)
	- [Key Words In Context and Concordances](#key-words-in-context-and-concordances)
	- [Objective of the `kwic` module](#objective-of-the-kwic-module)
	- [Usage](#usage)
		- [Three Steps](#three-steps)
		- [Single Step](#single-step)
		- [Unicode Normalization](#unicode-normalization)
	- [Relationship to Hollerith, the Binary Phrase DB](#relationship-to-hollerith-the-binary-phrase-db)
	- [Related Software](#related-software)

> **Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*


# KWIC

## Key Words In Context and Concordances

Keywords In Context (KWIC) is a technique to produce indexes based on rotary permutations
of the index linguistic material. According to *Wikipedia*:

> **KWIC** is an acronym for **Key Word In Context**, the most common format for
> [concordance](https://en.wikipedia.org/wiki/Concordance_(publishing)) lines.
> The term KWIC was first coined by [Hans Peter
> Luhn](https://en.wikipedia.org/wiki/Hans_Peter_Luhn).[<sup>[1]</sup>](https://en.wikipedia.org/wiki/Key_Word_in_Context#cite_note-1)
> The system was based on a concept called *keyword in titles* which was first
> proposed for Manchester libraries in 1864 by [Andrea
> Crestadoro](https://en.wikipedia.org/wiki/Andrea_Crestadoro).[<sup>[2]</sup>](https://en.wikipedia.org/wiki/Key_Word_in_Context#cite_note-index-2)

The best way to understand what the KWIC technique is all about is to skim
through the pages of a classical KWIC index, of which [*Computer Literature
Bibliography: 1946 to 1963*](https://books.google.de/books?id=Ig6tEGv6CTAC&dq=computer%20language&pg=PA129#v=onepage&q=computer%20language&f=false)
is one example. Here's page 129 from that 1965 book:

![*Computer Literature Bibliography: 1946 to 1963*, page 129](https://github.com/loveencounterflow/kwic/raw/master/art/kwic.png)

This title word index goes on for over 300 pages. In the center of each page is
the current keyword, from `A.C.E.` and `ABACUS` over `COMPUTER` to `ZURICH`,
followed by numbers representing years and machine models. Each line represents
the title of a book or article, and each keyword is surrounded by those words as
appear in the referenced title, in the order they appear there. At the end of
each line, we find an abbreviation that identifies the publication and the page
number where each title is to be found.

> (by contrast, other indexing methods are known to shuffle words around, as in
> `Man and the Sea, The Old`, in order to make *the* relevant item appear in the
> right place in the catalog. For the sake of space efficiency, long titles are
> wrapped around here, too; however, this does not affect the sorting order).

The benefits of the KWIC approach to indexing are immediately obvious: instead
of having to guess where the librarian chose to place the index card for that
edition of `The Old Man and the Sea` you're looking for (`Sea`? `Old`? `Man`?),
you can look it up under each 'content' word. Also, you'll likely have an easier
time to find works about related subjects where those share title words with
your particular search.

What's more, you get a collocational analysis of sorts for free, that is, given
a comprehensive KWIC index covering titles (and maybe full texts) of a given
field, you can gain an idea of what words go with which ones. The index as shown
above is admittedly much better at showing occurrences of type `I+S` (where `I`
is what you searched for, call it the *infix*, and `S` is what follows, call it
the *suffix*) than for those of type `P+I` (where `P` is what precedes the
infix, call it the *prefix*); this becomes clear when you compare the entries
near `COMPUTER LANGUAGE` from the picture above with [the entries of pages
225f.](https://books.google.de/books?id=Ig6tEGv6CTAC&dq=computer%20language&pg=PA225#v=onepage&q=language&f=false)
of the same work: To the naked eye, the prefixes you might be interested in
(say, `COMPUTER`, `PROGRAMMING` or `ALGORITHMIC` on the above page) are rather
haphazardly strewn across the place, although some clusters do seem to occur
(this, by the way, is a weakness of this particular index that we will address
and try to remedy a little further down).

The main downside of KWIC indexes is also apparent from the *Bibliography*:
Whereas the register (where all the abbreviations of cited publications are
listed) takes up roughly 70 and the author index roughly 80 pages, the KWIC
index as such weighs in with 307 pages, meaning each title appears around 4.5
times on average. This can hardly be otherwise given that the very objective of
the KWIC index is exactly to file each title under each relevant term; however,
it also helps to explain why printed KWIC indexes had, for the most part, to
wait for computers to arrive and went out of fashion as soon as computers became
capable of delivering documents online as well. Similarly,
[concordances](https://de.wikipedia.org/wiki/Konkordanz) were only done for
subjects and keywords deemed worthy the tremendous effort in terms of time and
paper.

## Objective of the `kwic` module

`kwic` is a [NodeJS](http://nodejs.org) module; as such, you can install it
with `npm install kwic`. When you then do `node lib/demo.js`, you
will be greeted with the following output:

```
                    |a         a                #  1
                   b|a         ba               #  2
                  cb|a         cba              #  3
                   c|a         ca               #  4
                  bc|a         bca              #  5
                    |ab        ab               #  6
                   c|ab        cab              #  7
                    |abc       abc              #  8
                   c|abdriver  cabdriver        #  9
                   c|abs       cabs             # 10
                    |ac        ac               # 11
                   b|ac        bac              # 12
                    |acb       acb              # 13
                   c|ad        cad              # 14
                    |b         b                # 15
                   a|b         ab               # 16
                  ca|b         cab              # 17
                   c|b         cb               # 18
                  ac|b         acb              # 19
                    |ba        ba               # 20
                   c|ba        cba              # 21
                    |bac       bac              # 22
                    |bc        bc               # 23
                   a|bc        abc              # 24
                    |bca       bca              # 25
                  ca|bdriver   cabdriver        # 26
                  ca|bs        cabs             # 27
                    |c         c                # 28
                   a|c         ac               # 29
                  ba|c         bac              # 30
                   b|c         bc               # 31
                  ab|c         abc              # 32
                    |ca        ca               # 33
                   b|ca        bca              # 34
                    |cab       cab              # 35
                    |cabdriver cabdriver        # 36
                    |cabs      cabs             # 37
                    |cad       cad              # 38
                    |cb        cb               # 39
                   a|cb        acb              # 40
                    |cba       cba              # 41
                  ca|d         cad              # 42
                 cab|driver    cabdriver        # 43
             cabdriv|er        cabdriver        # 44
               cabdr|iver      cabdriver        # 45
            cabdrive|r         cabdriver        # 46
                cabd|river     cabdriver        # 47
                 cab|s         cabs             # 48
              cabdri|ver       cabdriver        # 49
```

The above is a KWIC-style permuted index of these (artificial and real) 'words',
chosen to highlight some characteristics of the implemented algorithm:

```
a           ba          cab
ab          bac         cabdriver
abc         bc          cabs
ac          bca         cad
acb         c           cb
b           ca          cba
```
First of all, the demo shows how to index *words* by their constituent *letters*
(and not phrases by their constituent words, as the classical exemplar does);
this is related to the particular intended use case, but configurable.

Next, there's a vertical line in the output shown: this line indicates the
separation between what was called above the *prefix* and the *infix*, with the
*suffix* starting at the next position after the infix. Now when you read from
top to bottom along said line, you will observe that

**(1)**—all the infixes are listed in alphabetical order (actually, in a simplified
    version of that, Unicode lexicographical order);

**(2)**—all the suffixes, likewise, are in alphabetical order, so that

**(3)**—all the co-occurrances of a given infix with all subsequent suffixes (trailing
    letters in this case) are always neatly clustered. For example, all occurrances
    of `|ca...` (infix `a` plus all the suffixes starting with an `a`) are
    found on lines #33 thru #38 in the above output and nowhere else. The
    inverse also holds: wherever the sequence `c`, 'a' occurs in the listing, it is
    always a duplicate of one entry in said range, indexed by another letter.

**(4)**—Wherever a new group of a given infix (index letter) starts, the sole
    letter always comes first, *followed by all those entries that* **end** *in
    that letter*; this is a corollary of the previous points (and happens to be
    [in agreement with how the *Bibliography* treats
    this case](https://books.google.de/books?id=Ig6tEGv6CTAC&dq=computer%20language&pg=PA126#v=onepage&q=computer%20language&f=false)).

**(5)**—After the words that end with the index letter come the ones that *start*
    with that letter, short ones with letters early in the alphabet (`a`, `b`, ...)
    occurring first.

**(6)**—These in turn—and now it gets interesting—are interspersed by those words
    that contain the infix and are *preceded* by one or more letters, and here
    the rule is again that short words and early letters sort first, *but in the
    prefix, power of ordering counts* **backwards** *from the infix at the right
    down to the start of the prefix on the left*. The effect is that for any
    given run of a common infix and suffix, same letters to the left of the
    vertical line have a tendency to form secondary clusters.

> Prefixes cannot possibly all cluster together as long as we stick to
> granting the suffix priority in sorting; after all, a list of items still
> has only a single dimension and, hence, neighborhood has only two
> positions. This is why you see `c|b` and `ac|b` right next to each other,
> but `c|ba`, which also has the sequence `c|b`, is separated by `|ba` (and
> had we included, say, `bank` and `bar`, those would likewise intervene).

## Usage

### Three Steps

You can use KWIC doing three small steps or doing a single step; the first way
is probably better when making yourself comfortable with KWIC, to find out where
things went wrong or to modify intermediate data. The single-step API is more
convenient for production and discards unneeded intermediate data. in both
cases, the objective is to input some entries and get out a number of
datastructures—called the 'permutations'—that can be readily used in conjunction
with the [Hollerith CoDec](https://github.com/loveencounterflow/hollerith-codec)
and a LevelDB instance to produce a properly sorted KWIC index.

Let's start with the 'slow' API. The first thing you do is to compile a list of
entries (e.g. words) and prepare an empty list (call it `collection`) to hold
the permuted keys. Assuming you start with a (somewhat normalized) text and use
the `unique_words_from_text` function as found in `src/demo.coffee`, the steps
from raw data to output look like this:

```coffee
entries     = unique_words_from_text text                       # 1
collection  = []                                                # 2
for entry in entries                                            # 3
  factors       = KWIC.get_factors      entry                   # 4
  weights       = KWIC.get_weights      factors                 # 5
  permutations  = KWIC.get_permutations factors, weights        # 6
  collection.push [ permutations, entry, ]                      # 7
  # does nothing, just in case you want to know                 # 8
  for permutation in permutations                               # 9
    [ r_weights, infix, suffix, prefix, ] = permutation         # 10
KWIC.report collection                                          # 11
```

In the first step, each `entry` that you iterate over gets split into a list of
'factors'. Each factor represents what is essentially treated as a unit by the
algorithm; that could be Unicode characters (codepoints), or stretches of
letters representing syllables, morphemes, or orthographic words; this will
depend on your use case.

For ease of presentation, the default of `KWIC.get_factors` is to split each
given string into characters. If you want something different, you may specify a
factorizer as second argument which should be a function (or the name of a
registered factorizer method) that accepts an entry string and returns a list of
strings derived from that input. For commonly occurring cases, a number of named
factorizers is included as `KWIC.factorizers`.

In the second step, each list of factors gets turned into a list of weights.
Weights are what will be used for sorting; typically, these are non-negative
integer numbers, but you could use anything that can be sorted, such as rational
numbers, negative numbers, lists of numbers or, in fact, strings. As with
`get_factors`, `get_weights` accepts a second argument, called `alphabet` in
this case, which may be the name of one of the standard alphabets registered in
`KWIC.alphabets`, a function that returns a weight when called with a factor, or
a list that enumerates all possible factors (and whose indices will become
weights). The general rule is that wherever a given weight is smaller that
another one, the first will sort before the second, and vice versa.

The essential part happens with the third call, `permutations  =
KWIC.get_permutations factors, weights`. You can treat the return value as a
black box; the idea is to push a list with the `permutations` as the the first
and whatever identifies your `entry` as the second element to your `collection`
in order to prepare for sorting and output. When you're done with collecting the
entries, you can pass the `collection` to `KWIC.report`, which will then sort
and print the result. If you need any kind of further data to point from each
index row back into, say, page and line numbers where those entries originated,
you'll have to organize that part yourself (you could make each `entry´ an
object with the pertinent data attached to it and use a custom factorization
method).

In case you're interested, the `permutations` list will contain as many
sub-lists as there were factors, one for each occurrence of the entry in the
index. Each sub-list starts with an item internally called the `r-weights`, that
is, a rotated list of weights. Let's look at the permutations for the entry
`cabs`:

```coffee
factors = [ 'c', 'a', 'b', `s`, ]                           # 4
weights = [  99,  97,  98, 115, ]                           # 5

permutations = [                                            # 6
  [ [  99,    97,    98,   115,  null, ], 'c', [ 'a', 'b', 's', ], [                ], ]
  [ [  97,    98,   115,  null,    99, ], 'a', [ 'b', 's',      ], [ 'c',           ], ]
  [ [  98,   115,  null,    97,    99, ], 'b', [ 's',           ], [ 'c', 'a',      ], ]
  [ [ 115,  null,    98,    97,    99, ], 's', [                ], [ 'c', 'a', 'b', ], ]
  ]
```
Lines marked `#4` show the factors of the word `cabs`, which are simply its
letters or characters. The `#5` points to the weights list, which, again is just
each character's Unicode codepoint expressed as a decimal number (in this simple
example, we could obviously just sort using Unicode strings, but on the other
hand, that simplicity immediately breaks down as soon when a more
locale-specific sorting is needed, such as treating German `ä` either as 'a kind
of `a`' or as 'a kind of `ae`').

Now the first item in each of the three sub-lists of the permutations (lines marked `#6`)
contains the 'rotated weights' mentioned above. In fact, those weights are not only rotated,
they

* are extended with an 'null' value (which, being (almost) the smallest possible value
  when [Hollerith CoDec](https://github.com/loveencounterflow/hollerith-codec)-encoded,
  will sort before anything else);

* contain the weights for the suffixes in *reversed* order; replacing the
  numbers with letters (using `_` to replace `null`), the r-weight entries
  are `cabs_`, `abs_c`, `bs_ac`, and `s_bac`, respectively.

The second point is what causes a slightly more meaningful ordering of the
entries with a slightly better and more interesting aub-clustering when sorted.

The remaining three entries in each permutation sub-list contain, in terms of
factors, the infix `I`, the suffix `S` and the (non-reversed) prefix `P` that
the r-weights represent in terms of weights. These data are made part of the
information that goes into the LevelDB key for the simple reason that a
reconstruction of these pieces from the rotated weights would be awkward, and
retrieval from separate keys or external data sources cumbersome.

> In case you should be wondering: yes, this extra data, being put into a DB
> key, does potentially affect the overall sorting of entries, but the Hollerith
> CoDec being constructed the way it is, the factors can only ever have a
> bearing on the sorting if two identical r-weight lists (same lengths, same
> contents) happen to occur with differing factors. In that case, Unicode
> lexicographic ordering comes into effect. With a properly implemented scheme
> of factorizations and weightings, that should never happen.

### Single Step

The exact same result as above may be obtained by a slightly simpler procedure
that hides the intermediate results:

```coffee
entries     = unique_words_from_text text
collection  = []
for entry in entries
  collection.push [ ( KWIC.permute entry ), entry, ]
KWIC.report collection
```
Here, we call `KWIC.permute` on each entry. This method will most of the time be called
with an additional settings object such as:

```coffee
my_factorizer = ( entry  ) -> return words of entry
my_weighter   = ( factor ) -> return fancy localized weight for factor

...

for entry in entries
  permutations = KWIC.permute entry, factorizer: my_factorizer, alphabet: my_weighter
  collection.push [ permutations, entry, ]
```
<!--
### Unicode Normalization
[JavaScript Unicode 6.3 Normalization `https://github.com/walling/unorm`](https://github.com/walling/unorm)
```
coffee> ('ä'.normalize d ).split '' for d in ['NFC','NFD','NFKC','NFKD']
[ [ 'ä' ], [ 'a', '̈' ], [ 'ä' ], [ 'a', '̈' ] ]
```
 -->

## Relationship to Hollerith, the Binary Phrase DB

The keys generated by `KWIC.permute` may be used as keys in a [Hollerith Phrase
DB](https://github.com/loveencounterflow/hollerith2), as they are [Hollerith
CoDec](https://github.com/loveencounterflow/hollerith-codec)-compliant. In fact,
the KWIC demo converts encodes all generated keys to NodeJS buffers which are
then sorted using `buffer.compare`; thus, consistency with LevelDB's
lexicographical sorting is ensured even without using a DB instance for the
purpose.

## Related Software

There is a rather obscure UNIX utility by the name of
[`ptx`](https://en.wikipedia.org/wiki/Ptx_%28Unix%29) and an even more obscure
GNU version of the same,
[`gptx`](http://www.math.utah.edu/docs/info/gptx_1.html).





