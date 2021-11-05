retrievepedia
-------------

This project is a web-based testbed and demo for experimenting with different
techniques for retrieving data from Filecoin, IPFS, and related networks.

It consists of a tiny subset of Wikipedia (around 3GB in size), which has been
stored in a .zip file which has been spit into 5MB chunks (697 files total).

The raw chunked data is uploaded to IPFS here:

https://bafybeidnmh4wgw7dsj55wosa7hnbtm7uscyq4fj72pljbia6zutycwicye.ipfs.dweb.link/

(plus a bogus "padding.bin" file that was used to coax https://estuary.tech/ to
make Filecoin deals right away instead of staging the file)

It should be possible to concatenate all the wiki.zip.* files and then unzip it
to see the data.

(temporary) Demo: http://bafybeicuxqzeml6ws6awfxkpdnzp67oshkic6y7dor35vxx5k57rnfiabi.ipfs.dweb.link/

## Original Project

This project was originally a project called "Datpedia" that ran in Beaker Browser.
It's pretty interesting because it demonstrates how to randomly access data
stored in a zip file.  The zip file was built from the Kiwix project and so
the data is several years old now.

* https://github.com/dcposch/datpedia

LICENSE: ISC (from package.json)

