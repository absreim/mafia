Contributions of all kinds are welcome. Raise issues by using the Issues
inteface on Github.

API Documentation
-----------------

The shared.js and Shared.js files most contain indentical code and is meant to
be a sort of "living" API documentation. Code in both the back end and front
end directly access enumerated strings when encoding and decoding AJAX
requests.

Scaling and Concurrency
-----------------------

There are efforts underway to make the back end scalable across multiple nodes
while coordinating around a Redis instance. The progress so far can be found
in the *scalable* branch.

Sticky sessions are required to allow socket.io to function properly across
multiple nodes. The alternative that can be used without sticky sessions is to
have Redis act as a central store for session data and to use websockets only
instead of socket.io.

Besides using Redis to coordinate socket.io channel broadcasts, the nodes must
coordinate socket.io or websocket messages that go to specific users. In
addition, the code the manipulates game state and lobby state must be modified
to store those states in Redis along with proper locking to avoid race
conditions.

Fortunately, the race conditions possible with regards to manipulating user
account data in the database are minor and can be mitigated by simply adjusting
some logic used to read the output from the DBMS. Those adjustments have
already been implemented in the *scalable* branch. There is no need to
explicit locking or transactions.