import EventEmitter from 'events';
import { Realm } from 'prismarine-realms';
import { ServerDeviceCodeResponse } from 'prismarine-auth';

declare module 'bedrock-protocol' {
  type ProtocolVersion = 786 | 776 | 766 | 748 | 729 | 712 | 686 | 685 | 671 | 662 | 649 | 630 | 622 | 618 | 594 | 589 | 582 | 575 | 568 | 567 | 560 | 557 | 554 | 545 | 544 | 534 | 527 | 503 | 486 | 475 | 471 | 465 | 448 | 440 | 431 | 428 | 422 | 100 | 82 | 70;
  
  type Version = '1.21.71' | '1.21.70' | '1.21.60' | '1.21.50' | '1.21.42' | '1.21.30' | '1.21.2' | '1.21.0' | '1.20.80' | '1.20.71' | '1.20.61' | '1.20.50' | '1.20.40' | '1.20.30' | '1.20.10' | '1.20.0' | '1.19.80' | '1.19.70' | '1.19.63' | '1.19.62' | '1.19.60' | '1.19.51' | '1.19.50' | '1.19.41' | '1.19.40' | '1.19.31' | '1.19.30' | '1.19.22' | '1.19.21' | '1.19.20' | '1.19.11' | '1.19.10' | '1.19.2' | '1.19.1' | '1.18.31' | '1.18.30' | '1.18.12' | '1.18.11' | '1.18.10' | '1.18.2' | '1.18.1' | '1.18.0' | '1.17.41' | '1.17.40' | '1.17.34' | '1.17.30' | '1.17.11' | '1.17.10' | '1.17.0' | '1.16.220' | '1.16.210' | '1.16.201';

  type Language = 'en_US' | 'fr_FR' | 'de_DE' | 'es_ES' | 'it_IT' | 'pt_PT' | 'pt_BR' | 'zh_CN' | 'zh_TW' | 'ja_JP' | 'ko_KR' | 'ru_RU' | 'ar_SA' | 'hi_IN' | 'nl_NL' | 'sv_SE' | 'no_NO' | 'da_DK' | 'fi_FI' | 'pl_PL' | 'tr_TR' | 'cs_CZ' | 'el_GR' | 'he_IL' | 'th_TH' | 'vi_VN' | 'id_ID';

  export interface Options {
    version?: Version;
    host: string;
    port: number;
    offline?: boolean;
    raknetBackend?: 'jsp-raknet' | 'raknet-native' | 'raknet-node';
    useRaknetWorker?: boolean;
    compressionLevel?: number;
    batchingInterval?: number;
  }

  export interface ClientOptions extends Options {
    protocolVersion: ProtocolVersion;
    skinData: skinDataOptions;
    username: string;
    viewDistance?: number;
    platform?: 'bedrock' | 'java';
    flow?: 'live' | 'msal' | 'sisu';
    authTitle?: string;
    connectTimeout?: number;
    skipPing?: boolean;
    followPort?: boolean;
    conLog?: any;
    realms?: RealmsOptions;
    profilesFolder?: string | false;
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
    maxPlayers?: number;
    motd?: {
      motd: string;
      levelName?: string;
    };
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
    readonly entityId: BigInt;
    close(reason?: string): void;
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
    sendDisconnectStatus(playStatus: PlayStatus): void;
    disconnect(reason: string, hide?: boolean): void;
    close(): void;
    on(event: 'login', cb: () => void): any;
    on(event: 'join', cb: () => void): any;
    on(event: 'close', cb: (reason: string) => void): any;
    on(event: 'packet', cb: (packet: object) => void): any;
    on(event: 'spawn', cb: (reason: string) => void): any;
  }

  export class Server extends EventEmitter {
    clients: Map<string, Player>;
    conLog: Function;
    constructor(options: ServerOptions);
    listen(): Promise<void>;
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
  type ValidateProtocolVersion<P extends ProtocolVersion, V extends Version> = V extends ProtocolVersionToVersionMap[P] ? true : false;
}

