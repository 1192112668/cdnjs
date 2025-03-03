import type { IAttract } from "./IAttract";
import type { MoveDirection, MoveDirectionAlt, OutMode, OutModeAlt } from "../../../Enums";
import type { ITrail } from "./ITrail";
import type { INoise } from "./Noise/INoise";
export interface IMove {
    angle: number;
    attract: IAttract;
    bounce: boolean;
    collisions: boolean;
    direction: MoveDirection | keyof typeof MoveDirection | MoveDirectionAlt;
    enable: boolean;
    noise: INoise;
    out_mode: OutMode | keyof typeof OutMode | OutModeAlt;
    outMode: OutMode | keyof typeof OutMode | OutModeAlt;
    warp: boolean;
    random: boolean;
    speed: number;
    straight: boolean;
    trail: ITrail;
    vibrate: boolean;
}
