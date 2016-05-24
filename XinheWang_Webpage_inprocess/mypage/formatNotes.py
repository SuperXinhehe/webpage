import sys

string = ""
for line in sys.stdin:
	string = string + line

string = string.replace("<","&lt;").replace(">","&gt")
print(string)

## echo inputString | python formatNotes.py
