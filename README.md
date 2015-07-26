

- [KWIC](#kwic)
	- [Key Words In Context and Concordances](#key-words-in-context-and-concordances)
	- [Objective of the `kwic` module](#objective-of-the-kwic-module)
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

This title word index goes on for over 309 pages. In the center of each page is
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
(say, `COMPUTER`, `PROGRAMMING` or `ALGORITHMIC`) are rather haphazardly strewn
across the place, although some clusters do seem to occur (this, by the way, is
a weakness of this particular index that we will address and try to remedy a
little further down).

The main downside of KWIC indexes is also apparent from the *Bibliography*:
Whereas the register (where all the abbreviations of cited publications are
listed) takes up roughly 70 and the author index roughly 80 pages, the KWIC
index as such has no less than 305 pages, meaning each title appears around 4.5
times on average. This can hardly be otherwise given that the objective of the
KWIC index is exactly to file each title under each relevant term; however, it
also helps to explain why printed KWIC indexes had, for the most part, to wait
for computers to arrive and went out of fashion as soon as computers became
capable of delivering documents online as well. Similarly,
[concordances](https://de.wikipedia.org/wiki/Konkordanz) were only done for
subjects and keywords deemed worthy the tremendous effort in terms of time and
paper.

## Objective of the `kwic` module

`kwic` is a [NodeJS](http://nodejs.org) module; as such, you can install it
with `npm install kwic`. When you then do `node --harmony lib/demo.js`, you
will be greeted with the following output:

```
                    |a         a
                   b|a         ba
                  cb|a         cba
                   c|a         ca
                  bc|a         bca
                    |ab        ab
                   c|ab        cab
                    |abc       abc
                   c|abdriver  cabdriver
                   c|abs       cabs
                    |ac        ac
                   b|ac        bac
                    |acb       acb
                   c|ad        cad
                    |b         b
                   a|b         ab
                  ca|b         cab
                   c|b         cb
                  ac|b         acb
                    |ba        ba
                   c|ba        cba
                    |bac       bac
                    |bc        bc
                   a|bc        abc
                    |bca       bca
                  ca|bdriver   cabdriver
                  ca|bs        cabs
                    |c         c
                   a|c         ac
                  ba|c         bac
                   b|c         bc
                  ab|c         abc
                    |ca        ca
                   b|ca        bca
                    |cab       cab
                    |cabdriver cabdriver
                    |cabs      cabs
                    |cad       cad
                    |cb        cb
                   a|cb        acb
                    |cba       cba
                  ca|d         cad
                 cab|driver    cabdriver
             cabdriv|er        cabdriver
               cabdr|iver      cabdriver
            cabdrive|r         cabdriver
                cabd|river     cabdriver
                 cab|s         cabs
              cabdri|ver       cabdriver
```

The above is a KWIC-style permuted index of these 'words', chosen
to display some charcteristics of the implemented algorithm:

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
    version of that, namely, Unicode lexicographic order);

**(2)**—all the suffixes, likewise, are in alphabetical order, so that

**(3)**—all the co-occurrances of a given infix with all subsequent suffixes (trailing
    letters in this case) are always neatly clustered.

**(4)**—wherever a new group of a given infix (index letter) starts, the sole
    letter always comes first, *followed by all those entries that* **end** *in
    that letter*; this is a corrollary of the previous points (and happens to be
    [in agreement with how the shown *Bibliography* is
    sorted](https://books.google.de/books?id=Ig6tEGv6CTAC&dq=computer%20language&pg=PA126#v=onepage&q=computer%20language&f=false)).



## Related Software

There is a rather obscure UNIX utility by the name of
[`ptx`](https://en.wikipedia.org/wiki/Ptx_%28Unix%29) and an even more obscure
GNU version of the same,
[`gptx`](http://www.math.utah.edu/docs/info/gptx_1.html).





