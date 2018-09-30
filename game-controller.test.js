const GameController = require("./game-controller.js")
const Shared = require("./shared.js")
const CommonAlgos = require("./common-algos.js")

const totalPlayers = 4
const numWerewolves = 2
const gc = new GameController.GameController(totalPlayers, numWerewolves)

beforeAll(() => {
    gc.joinPlayer("Alice")
    gc.joinPlayer("Bob")
    gc.joinPlayer("Cory")
    gc.joinPlayer("David")
})

test("Alice, Bob, Cory, and David should be in the game.", () => {
    const playerNames = Object.keys(gc.gameState.players)
    expect(playerNames).toContain("Alice")
    expect(playerNames).toContain("Bob")
    expect(playerNames).toContain("Cory")
    expect(playerNames).toContain("David")
})

test("Number of werewolves should be automatically scaled down to 1.", () => {
    const claimedNumWerewolves = gc.numWerewolves
    const actualNumWerewolves = Object.keys(gc.gameState.players).filter(
        player => gc.gameState.players[player].isWerewolf).length
    expect(claimedNumWerewolves).toEqual(1)
    expect(actualNumWerewolves).toEqual(1)
    })

test("Game should be in STARTED phase.", () => {
        const phase = gc.gameState.phase
        expect(phase).toEqual(Shared.Phases.STARTED)
    })

describe("After all players acknowledged STARTED phase.", () => {
    beforeAll(() => {
        gc.handleMessage({type: Shared.ClientMessageType.ACKNOWLEDGE}, "Alice")
        gc.handleMessage({type: Shared.ClientMessageType.ACKNOWLEDGE}, "Bob")
        gc.handleMessage({type: Shared.ClientMessageType.ACKNOWLEDGE}, "Cory")
        gc.handleMessage({type: Shared.ClientMessageType.ACKNOWLEDGE}, "David")
    })
    test("Game should be in NIGHTTIME phase.", () => {
        const phase = gc.gameState.phase
        expect(phase).toEqual(Shared.Phases.NIGHTTIME)
    })
    describe("Werewolf suggests target.", () => {
        beforeAll(() => {
            const theWerewolf = Object.keys(gc.gameState.players).filter(
                player => gc.gameState.players[player].isWerewolf
            )[0]
            const potentialVictims = Object.keys(gc.gameState.players).filter(
                player => !gc.gameState.players[player].isWerewolf && 
                    gc.gameState.players[player].isAlive
            )
            const victimNumber = CommonAlgos.getRandomInt(potentialVictims.length)
            const victim = potentialVictims[victimNumber]
            gc.handleMessage({
                    type: Shared.ClientMessageType.SUGGESTTARGET,
                    target: victim
                },
                theWerewolf)
        })
        test("Game should be in NIGHTTIMEVOTING phase.", () => {
            const phase = gc.gameState.phase
            expect(phase).toEqual(Shared.Phases.NIGHTTIMEVOTING)
        })
        describe("Werewolf casts vote.", () => {
            beforeAll(() => {
                const theWerewolf = Object.keys(gc.gameState.players).filter(
                    player => gc.gameState.players[player].isWerewolf
                )[0]
                gc.handleMessage({
                        type: Shared.ClientMessageType.VOTECAST,
                        choice: true
                    },
                    theWerewolf)
            })
            test("Game should be in ENDOFNIGHT phase.", () => {
                const phase = gc.gameState.phase
                expect(phase).toEqual(Shared.Phases.ENDOFNIGHT)
            })
            test("One player should be dead.", () => {
                const numCachedLiving = gc.livingPlayersCache.size
                const numActualLiving = Object.keys(gc.gameState.players).filter(
                    player => gc.gameState.players[player].isAlive
                ).length
                expect(numCachedLiving).toEqual(3)
                expect(numActualLiving).toEqual(3)
            })
            describe("Players acknowledge results.", () => {
                beforeAll(() => {
                    for(player of gc.livingPlayersCache){
                        gc.handleMessage({type: Shared.ClientMessageType.ACKNOWLEDGE}, player)
                    }
                })
                test("Phase should be DAYTIME.", () => {
                    const phase = gc.gameState.phase
                    expect(phase).toEqual(Shared.Phases.DAYTIME)
                })
                describe("A villager suggests werewolf as target.", () => {
                    beforeAll(() => {
                        const livingVillagers = Object.keys(gc.gameState.players).filter(
                            player => gc.gameState.players[player].isAlive && 
                                !gc.gameState.players[player].isWerewolf
                        )
                        const theWerewolf = Object.keys(gc.gameState.players).filter(
                            player => gc.gameState.players[player].isWerewolf
                        )[0]
                        gc.handleMessage({
                            type: Shared.ClientMessageType.SUGGESTTARGET,
                            target: theWerewolf
                        }, livingVillagers[0])
                    })
                    test("Phase should be DAYTIMEVOTING.", () => {
                        const phase = gc.gameState.phase
                        expect(phase).toEqual(Shared.Phases.DAYTIMEVOTING)
                    })
                    describe("Vote does not reach a majority.", () => {
                        beforeAll(() => {
                            const players = Array.from(gc.livingPlayersCache)
                            gc.handleMessage({
                                type: Shared.ClientMessageType.VOTECAST,
                                choice: true
                            }, players[0])
                            gc.handleMessage({
                                type: Shared.ClientMessageType.VOTECAST,
                                choice: false
                            }, players[1])
                            gc.handleMessage({
                                type: Shared.ClientMessageType.VOTECAST,
                                choice: false
                            }, players[2])
                        })
                        test("Phase should be DAYTIMEVOTEFAILED.", () => {
                            const phase = gc.gameState.phase
                            expect(phase).toEqual(Shared.Phases.DAYTIMEVOTEFAILED)
                        })
                        describe("Players acknowledge results. Werewolf suggests villager.", () => {
                            beforeAll(() => {
                                for(player of gc.livingPlayersCache){
                                    gc.handleMessage({type: Shared.ClientMessageType.ACKNOWLEDGE}, player)
                                }
                                const theWerewolf = Object.keys(gc.gameState.players).filter(
                                    player => gc.gameState.players[player].isWerewolf
                                )[0]
                                const potentialVictims = Object.keys(gc.gameState.players).filter(
                                    player => !gc.gameState.players[player].isWerewolf && 
                                        gc.gameState.players[player].isAlive
                                )
                                const victimNumber = CommonAlgos.getRandomInt(potentialVictims.length)
                                const victim = potentialVictims[victimNumber]
                                gc.handleMessage({
                                        type: Shared.ClientMessageType.SUGGESTTARGET,
                                        target: victim
                                    },
                                    theWerewolf)
                            })
                            test("Phase should be DAYTIMEVOTING.", () => {
                                const phase = gc.gameState.phase
                                expect(phase).toEqual(Shared.Phases.DAYTIMEVOTING)
                            })
                            describe("Majority is reached.", () => {
                                beforeAll(() => {
                                    for(player of gc.livingPlayersCache){
                                        var choice = true
                                        if(player == gc.gameState.target){
                                            choice = false
                                        }
                                        gc.handleMessage({
                                            type: Shared.ClientMessageType.VOTECAST,
                                            choice: choice
                                        }, player)
                                    }
                                })
                                test("Game should be over. Werewolves win.", () => {
                                    const phase = gc.gameState.phase
                                    expect(phase).toEqual(Shared.Phases.OVER)
                                })
                            })
                        })
                    })
                })
            })
        })
    })
})