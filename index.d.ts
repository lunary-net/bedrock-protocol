import EventEmitter from 'events';
import { Realm } from 'prismarine-realms';
import { ServerDeviceCodeResponse } from 'prismarine-auth';

declare module 'bedrock-protocol' {
  type ProtocolVersion = 786 | 776 | 766 | 748 | 729 | 712 | 686 | 685 | 671 | 662 | 649 | 630 | 622 | 618 | 594 | 589 | 582 | 575 | 568 | 567 | 560 | 557 | 554 | 545 | 544 | 534 | 527 | 503 | 486 | 475 | 471 | 465 | 448 | 440 | 431 | 428 | 422 | 100 | 82 | 70;
  
  type Version = '1.21.71' | '1.21.70' | '1.21.60' | '1.21.50' | '1.21.42' | '1.21.30' | '1.21.2' | '1.21.0' | '1.20.80' | '1.20.71' | '1.20.61' | '1.20.50' | '1.20.40' | '1.20.30' | '1.20.10' | '1.20.0' | '1.19.80' | '1.19.70' | '1.19.63' | '1.19.62' | '1.19.60' | '1.19.51' | '1.19.50' | '1.19.41' | '1.19.40' | '1.19.31' | '1.19.30' | '1.19.22' | '1.19.21' | '1.19.20' | '1.19.11' | '1.19.10' | '1.19.2' | '1.19.1' | '1.18.31' | '1.18.30' | '1.18.12' | '1.18.11' | '1.18.10' | '1.18.2' | '1.18.1' | '1.18.0' | '1.17.41' | '1.17.40' | '1.17.34' | '1.17.30' | '1.17.11' | '1.17.10' | '1.17.0' | '1.16.220' | '1.16.210' | '1.16.201';

  type Language = 'en_US' | 'fr_FR' | 'de_DE' | 'es_ES' | 'it_IT' | 'pt_PT' | 'pt_BR' | 'zh_CN' | 'zh_TW' | 'ja_JP' | 'ko_KR' | 'ru_RU' | 'ar_SA' | 'hi_IN' | 'nl_NL' | 'sv_SE' | 'no_NO' | 'da_DK' | 'fi_FI' | 'pl_PL' | 'tr_TR' | 'cs_CZ' | 'el_GR' | 'he_IL' | 'th_TH' | 'vi_VN' | 'id_ID';

  export interface Options {
    /**
     * The Minecraft version to connect to.
     * If provided, it will ensure that the protocol version matches the provided version.
     * Example versions include '1.21.71', '1.21.60', etc.
     */
    version?: Version;

    /**
     * The server's host IP address or domain name.
     */
    host: string;

    /**
     * The server's port number.
     */
    port: number;

    /**
     * If true, the connection will be treated as offline, meaning authentication will be bypassed.
     */
    offline?: boolean;

    /**
     * The backend for RakNet protocol to use (either JavaScript or native implementations).
     */
    raknetBackend?: 'jsp-raknet' | 'raknet-native' | 'raknet-node';

    /**
     * If true, the RakNet protocol will use a web worker for performance.
     */
    useRaknetWorker?: boolean;

    /**
     * The level of compression to use for data sent to the server.
     */
    compressionLevel?: number;

    /**
     * The time interval for batching multiple messages together (in milliseconds).
     */
    batchingInterval?: number;
  }

  export interface ClientOptions extends Options {
    /**
     * The protocol version to use for the connection.
     * This must match the version provided by the server.
     */
    protocolVersion: ProtocolVersion;

    /**
     * Skin data configuration for the player.
     */
    skinData: skinDataOptions;

    /**
     * The username to use for authentication and identification.
     */
    username: string;

    /**
     * The distance around the player in chunks that should be loaded for the world.
     */
    viewDistance?: number;

    /**
     * The platform to connect from. Can be 'bedrock' or 'java'.
     */
    platform?: 'bedrock' | 'java';

    /**
     * The authentication flow type. Can be 'live', 'msal', or 'sisu'.
     */
    flow?: 'live' | 'msal' | 'sisu';

    /**
     * The title for the authentication request (optional).
     */
    authTitle?: string;

    /**
     * The timeout duration for the connection attempt, in milliseconds.
     */
    connectTimeout?: number;

    /**
     * If true, the initial ping to the server will be skipped.
     */
    skipPing?: boolean;

    /**
     * If true, will attempt to follow a connected port in case of port changes.
     */
    followPort?: boolean;

    /**
     * Custom logging function for connection logs.
     */
    conLog?: any;

    /**
     * Realms options for connecting to a Minecraft Realms server.
     */
    realms?: RealmsOptions;

    /**
     * Path or setting for profiles folder (or false to disable).
     */
    profilesFolder?: string | false;

    /**
     * Callback to handle the device code response for MSA authentication.
     */
    onMsaCode?: (data: ServerDeviceCodeResponse) => void;
  }

  export interface skinDataOptions {
    SkinGeometryDataEngineVersion: string;
    ClientRandomId: Date.now;
    CurrentInputMode: number | 1;
    DefaultInputMode: number | 1;
    DeviceId: string;
    DeviceModel: string | 'PrismarineJS';
    DeviceOS: number | 7;
    GameVersion: Version;
    GuiScale: number | -1;
    LanguageCode: Language | 'en_GB';
    PlatformOfflineId: string;
    PlatformOnlineId: string;
    PlayFabId: string;
    SelfSignedId: string;
    ServerAddress: string;
    ThirdPartyName: string;
    ThirdPartyNameOnly: boolean;
    UIProfile: number;
    IsEditorMode: boolean;
    TrustedSkin: boolean;
    OverrideSkin: boolean;
    CompatibleWithClientSideChunkGen: boolean;
    MaxViewDistance: number;
    MemoryTier: number;
    PlatformType: number;
  }

  export interface ServerOptions extends Options {
    /**
     * The maximum number of players allowed to connect to the server.
     */
    maxPlayers?: number;

    /**
     * The message of the day (MOTD) to display on the server list.
     */
    motd?: {
      motd: string;
      levelName?: string;
    };

    /**
     * A function to get the server advertisement details.
     * Used for server listing and displaying server information.
     */
    advertisementFn?: () => ServerAdvertisement;
  }

  enum ClientStatus {
    Disconnected,
    Authenticating,
    Initializing,
    Initialized,
  }

  export class Connection extends EventEmitter {
    readonly status: ClientStatus;
    versionLessThan(version: string | number): boolean;
    versionGreaterThan(version: string | number): boolean;
    versionGreaterThanOrEqualTo(version: string | number): boolean;
    write(name: string, params: object): void;
    queue(name: string, params: object): void;
    sendBuffer(buffer: Buffer, immediate?: boolean): void;
  }

  type PlayStatus =
    | 'login_success'
    | 'failed_client'
    | 'failed_spawn'
    | 'failed_invalid_tenant'
    | 'failed_vanilla_edu'
    | 'failed_edu_vanilla'
    | 'failed_server_full';

  export class Client extends Connection {
    constructor(options: ClientOptions);

    /**
     * The unique entity ID for the client.
     */
    readonly entityId: BigInt;

    /**
     * Close the client connection gracefully.
     * Optionally provide a reason for disconnecting.
     */
    close(reason?: string): void;

    /**
     * Disconnect the client from the server.
     */
    disconnect(): void;
  }

  export class Player extends Connection {
    profile?: {
      xuid: string;
      uuid: string;
      name: string;
    };
    version: string;
    getUserData(): object;

    /**
     * Send a disconnect status message to the player.
     */
    sendDisconnectStatus(playStatus: PlayStatus): void;

    /**
     * Disconnect the player from the server.
     */
    disconnect(reason: string, hide?: boolean): void;

    /**
     * Close the player connection.
     */
    close(): void;

    on(event: 'login', cb: () => void): any;
    on(event: 'join', cb: () => void): any;
    on(event: 'close', cb: (reason: string) => void): any;
    on(event: 'packet', cb: (packet: object) => void): any;
    on(event: 'spawn', cb: (reason: string) => void): any;
  }

  export class Server extends EventEmitter {
    clients: Map<string, Player>;

    /**
     * Custom logging function for server logs.
     */
    conLog: Function;

    constructor(options: ServerOptions);

    /**
     * Start the server and begin listening for connections.
     */
    listen(): Promise<void>;

    /**
     * Close the server and disconnect all clients.
     */
    close(disconnectReason?: string): Promise<void>;

    on(event: 'connect', cb: (client: Player) => void): any;
  }

  export class Relay extends Server {
    constructor(options: RelayOptions);
  }

  export class ServerAdvertisement {
    motd: string;
    name: string;
    protocol: number;
    version: string;
    playersOnline: number;
    playersMax: number;
    serverId: string;
    levelName: string;
    gamemodeId: number;
    portV4: number;
    portV6: number;

    constructor(obj: object, port: number, version: string);
  }

  export interface RealmsOptions {
    realmId?: string;
    realmInvite?: string;
    pickRealm?: (realms: Realm[]) => Realm;
  }

  export function createClient(options: ClientOptions): Client;
  export function createServer(options: ServerOptions): Server;

  export function ping({
    host,
    port,
  }: {
    host: string;
    port: number;
  }): Promise<ServerAdvertisement>;

  // Validate ProtocolVersion and Version Relationship
  type ProtocolVersionToVersionMap = {
    786: '1.21.71',
    776: '1.21.60',
    766: '1.21.50',
    748: '1.21.42',
    729: '1.21.30',
    712: '1.21.20',
    686: '1.21.2',
    685: '1.21.0',
    671: '1.20.80',
    662: '1.20.71',
    649: '1.20.61',
    630: '1.20.50',
    622: '1.20.40',
    618: '1.20.30',
    594: '1.20.15',
    589: '1.20.0',
    582: '1.19.80',
    575: '1.19.70',
    568: '1.19.63',
    567: '1.19.60',
    560: '1.19.50',
    557: '1.19.40',
    554: '1.19.30',
    545: '1.19.21',
    544: '1.19.20',
    534: '1.19.10',
    527: '1.19.1',
    503: '1.18.30',
    486: '1.18.11',
    475: '1.18.0',
    471: '1.17.40',
    465: '1.17.30',
    448: '1.17.10',
    440: '1.17.0',
    431: '1.16.220',
    428: '1.16.210',
    422: '1.16.201',
    100: '1.0.0',
    82: '0.15.6',
    70: '0.14.3',
  };

  // Enforce that the selected version must match the protocol version
  type ValidateProtocolVersion<P extends ProtocolVersion, V extends Version> = V extends ProtocolVersionToVersionMap[P] ? true : false;
}


  export function ping({
    host,
    port
  }: {
    host: string
    port: number
  }): Promise<ServerAdvertisement>
}
