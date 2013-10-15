boxd.local
===

this is a localStorage implementation

{describe localStorage}

{describe the benefits of this implementation}

### (add)

the (add) button simply adds new boxes for you to manipulate,

on load boxes a through d will always appear yet as you load new boxes your local store will automatically fill in any previously used boxes,

to see a list of all boxes used click the (print) button

### (rem)

the (rem) button removes the most recently focused box from the flow, but the contents of the box will remain in the local store if and only if the store was updated before you removed the box,

to remove the box and its contents completely from the store you will have to add the box you wish to remove, manually delete its contents, and then finally update the store

i decided that this would be the limit of editing capabilities for this act in an attempt at curbing my desire to make it even more feature rich,

i wanted this act to be fundamentally simple,

perhaps i will convince myself that some more superficial editing is in fact fundamentally simple

### (store)


the (store) button stores the current contents of all boxes to your browser's localStorage

### (print)

the (print) button takes the contents of the local store and places it in plaintext into a word wrapped div in a seperate html in a json format for ease in further storage andor manipulation


### cont wishlist
[] rule adder... perhaps just more basic building blocks, an if statement rule will go a long way, then if more than a certain number of games use the rule it gets hardcded for speed
[] backword :: a better way to determine word split
[] a security guaranteed way to sandbox rules to avoid foul play
