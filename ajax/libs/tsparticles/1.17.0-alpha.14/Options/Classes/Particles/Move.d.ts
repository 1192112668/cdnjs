import type { IMove } from "../../Interfaces/Particles/IMove";
import { Attract } from "./Attract";
import { MoveDirection, MoveDirectionAlt, OutMode, OutModeAlt } from "../../../Enums";
import { Trail } from "./Trail";
import type { RecursivePartial } from "../../../Types/RecursivePartial";
import { Noise } from "./Noise/Noise";
import type { IOptionLoader } from "../../Interfaces/IOptionLoader";
export declare class Move implements IMove, IOptionLoader<IMove> {
    get collisions(): boolean;
    set collisions(value: boolean);
    get bounce(): boolean;
    set bounce(value: boolean);
    get out_mode(): OutMode | keyof typeof OutMode | OutModeAlt;
    set out_mode(value: OutMode | keyof typeof OutMode | OutModeAlt);
    angle: number;
    attract: Attract;
    direction: MoveDirection | keyof typeof MoveDirection | MoveDirectionAlt;
    enable: boolean;
    noise: Noise;
    outMode: OutMode | keyof typeof OutMode | OutModeAlt;
    random: boolean;
    speed: number;
    straight: boolean;
    trail: Trail;
    vibrate: boolean;
    warp: boolean;
    constructor();
    load(data?: RecursivePartial<IMove>): void;
}
