function Instructions() {
    return (
        <div>
            <h3>Instructions</h3>
            <h4>Introduction</h4>
            <p>Absreim's Mafia is an implementation of the commonly played 
                party game Mafia in the form of a web application. 
                Mafia tests the ability of players to convince other players 
                of their identity and to detect falsehoods told by others.
            </p>
            <p>See the&nbsp;
                <a href="https://en.wikipedia.org/wiki/Mafia_(party_game)">
                relevant article on Wikipedia</a> for more background 
                information.</p>
            <h4>Rules</h4>
            <p>Many rules variations for Mafia exist. For this particular
                application, the informed minority is labelled as werewolves
                and uninformed majority is labelled as villagers. 
                The objective of villagers is to kill all werewolves while 
                the objective of werewolves kill enough villagers so that 
                the living werewolves constitute at least half of the 
                remaining population.
            </p>
            <p>The number of werewolves is known to all players at the
                beginning of a game, but villagers are unaware of the
                number of werewolves still alive until the end of the game.
            </p>
            <p>Each game begins at night, where the werewolves decide on a
                villager to kill. Any werewolf may suggest a villager to
                kill, at which point the remaining werewolves vote either
                yes or no to kill the villager. A simple majority is needed
                for the vote to pass. If the vote fails, the werewolves
                must choose a new target.
            </p>
            <p>The werewolves must kill one
                villager before the game progresses to the daytime.
            </p>
            <p>During the day, the entire population must decide on a
                person to execute under the suspicion of being a werewolf.
                The manner of selection and voting is similar to that of
                werewolves during the night, except that the entire
                population participates in the accusation of a person and
                in voting.
            </p>
            <p>Similarly, one person must be killed before the game
                progresses to the nighttime.
            </p>
            <p>The game progresses between day and night until the
                werwewolf or villager factions achieve their respective
                objectives.
            </p>
            <h4>User Interface</h4>
            <h5>Account Management</h5>
            <p>An account is required to play the game. All account-related
                functions: creation, deletion, log in, log out, and 
                change password can found as buttons in the Main Menu or 
                Welcome page or in the account management drop down menu 
                on the upper left area of the page, right below the title.
            </p>
            <h5>Entering the Game</h5>
            <p>Enter the game itself by clicking the <em>Enter Game</em> link
                on the navigation bar on the button in the Main Menu once you
                are logged in. Unless you were previously in a game, you will
                be taken to the lobby.
            </p>
            <h5>Lobby</h5>
            <p>In the lobby interface, you can either create a new game or
                join an existing game that is still waiting for players. When
                creating a game, you must specify the number of total players 
                and number of werewolves. The interface will inform you of the
                constraints recommended values for these parameters.
            </p>
            <h5>Games in Lobby</h5>
            <p>After joining a game in the lobby, you must wait for enough
                players to join before the game starts. In this interface,
                there is also a chat room to chat with other players in the
                same game.
            </p>
            <h5>Games that have Started</h5>
            <p>A game in the lobby automatically starts once enough players 
                have joined. Here, there are instructions for each step in
                the progression of the game.
            </p>
            <p>All players can communicate via a general chat room, while
                werewolves have access to a werewolf-only chat to communicate
                amongst themselves. Dead players can continue to participate
                in the chat rooms they had access to while they were alive,
                but cannot vote or suggest targets.
            </p>
            <p>After a game ends, all players in that game will be returned 
                to the lobby.
            </p>
        </div>
    )
}

export default Instructions