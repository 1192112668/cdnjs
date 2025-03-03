import { Master } from '../../master/master';
import { Transport, TransportOpts } from './transport';
import { CredentialedActionShape, Game, LogEntry, PlayerID, State, SyncInfo } from '../../types';
/**
 * Returns null if it is not a bot's turn.
 * Otherwise, returns a playerID of a bot that may play now.
 */
export declare function GetBotPlayer(state: State, bots: Record<PlayerID, any>): string;
interface LocalMasterOpts {
    game: Game;
    bots: Record<PlayerID, any>;
}
/**
 * Creates a local version of the master that the client
 * can interact with.
 */
export declare class LocalMaster extends Master {
    connect: (gameID: string, playerID: PlayerID, callback: (...args: any[]) => void) => void;
    constructor({ game, bots }: LocalMasterOpts);
}
declare type LocalTransportOpts = TransportOpts & {
    master?: LocalMaster;
};
/**
 * Local
 *
 * Transport interface that embeds a GameMaster within it
 * that you can connect multiple clients to.
 */
export declare class LocalTransport extends Transport {
    master: LocalMaster;
    isConnected: boolean;
    /**
     * Creates a new Mutiplayer instance.
     * @param {string} gameID - The game ID to connect to.
     * @param {string} playerID - The player ID associated with this client.
     * @param {string} gameName - The game type (the `name` field in `Game`).
     * @param {string} numPlayers - The number of players.
     */
    constructor({ master, store, gameID, playerID, gameName, numPlayers, }: LocalTransportOpts);
    /**
     * Called when another player makes a move and the
     * master broadcasts the update to other clients (including
     * this one).
     */
    onUpdate(gameID: string, state: State, deltalog: LogEntry[]): Promise<void>;
    /**
     * Called when the client first connects to the master
     * and requests the current game state.
     */
    onSync(gameID: string, syncInfo: SyncInfo): void;
    /**
     * Called when an action that has to be relayed to the
     * game master is made.
     */
    onAction(state: State, action: CredentialedActionShape.Any): void;
    /**
     * Connect to the master.
     */
    connect(): void;
    /**
     * Disconnect from the master.
     */
    disconnect(): void;
    /**
     * Subscribe to connection state changes.
     */
    subscribe(): void;
    subscribeGameMetadata(): void;
    /**
     * Updates the game id.
     * @param {string} id - The new game id.
     */
    updateGameID(id: string): void;
    /**
     * Updates the player associated with this client.
     * @param {string} id - The new player id.
     */
    updatePlayerID(id: PlayerID): void;
}
export declare function Local(opts?: Pick<LocalMasterOpts, 'bots'>): (transportOpts: Pick<LocalMasterOpts, "game"> & TransportOpts & {
    master?: LocalMaster;
} & {
    gameKey: Game<any, import("../../types").Ctx>;
}) => LocalTransport;
export {};
