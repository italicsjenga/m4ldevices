inlets = 1;
outlets = 2;

var current = 0;
var last = 0;

function msg_int(note) {
	last = current;
	current = note;
	outlet(0, current);
	outlet(1, last);
	if (current == last) { current = 0; }
}