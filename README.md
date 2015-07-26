

- [KWIC](#kwic)

> **Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*


# KWIC
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
appear in the referenced title, in the order they appear there (by contrast,
other indexing methods are known to shuffle words around, as in `Man and the
Sea, The Old`, in order to make *the* relevant item appear in the right place in
the catalog; for the sake of space efficiency, long titles are wrapped around
here, too, which, however, does not affect the sorting order).

There is a rather obscure UNIX utility by the name of
[`ptx`](https://en.wikipedia.org/wiki/Ptx_%28Unix%29) and an even more obscure
GNU version of the same,
[`gptx`](http://www.math.utah.edu/docs/info/gptx_1.html). I

```
a           ba          cab
ab          bac         cabdriver
abc         bc          cabs
ac          bca         cad
acb         c           cb
b           ca          cba
```

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












