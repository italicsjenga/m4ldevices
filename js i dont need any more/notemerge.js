inlets = 4;
outlets = 2;

var dirty = false;
var note = 0;
var velocity = 0;
var del_dirty = false;
var del_note = 0;
var del_velocity = 0;

var delete_queue = [];

function msg_int(msg) {
    if (inlet == 0) {
        note = msg
        if (dirty) {
            handle_main()
            dirty = false
        } else {
            dirty = true
        }
    } else if (inlet == 1) {
        velocity = msg
        if (dirty) {
            handle_main()
            dirty = false
        } else {
            dirty = true
        }
    } else if (inlet == 2) {
        del_note = msg
        if (del_dirty) {
            handle_delayed()
            del_dirty = false
        } else {
            del_dirty = true
        }
    } else if (inlet == 3) {
        del_velocity = msg
        if (del_dirty) {
            handle_delayed()
            del_dirty = false
        } else {
            del_dirty = true
        }
    }
}

function handle_main() {
    if (velocity != 0) { //note on
        var indx = delete_queue.indexOf(note)
        if (indx > -1) { //if in delete queue, remove but dont send new note on
            delete_queue.splice(indx, 1)
            return
        } else { //if not in delete queue, its a new note!
            send_note(note, velocity)
        }
        return
    } else { //add note off to delete queue
        delete_queue.push(note)
    }
}

function handle_delayed() {
    if (del_velocity > 0) { //dont do anything about the delayed note ons
        return
    }
    var indx = delete_queue.indexOf(del_note)
        // if (indx == -1) { post("we kept: " + del_note + "\n") }
    if (indx > -1) { //if note is still in delete queue, delete it
        send_note(delete_queue[indx], 0)
        post("sent note off for: " + delete_queue[indx] + "\n")
        delete_queue.splice(indx, 1)
    }
    // post("\nkept notes: ")
    // post(delete_queue)
}

function send_note(n, v) {
    outlet(1, v)
    outlet(0, n)
}