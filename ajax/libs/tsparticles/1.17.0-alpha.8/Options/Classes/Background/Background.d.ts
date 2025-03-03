import type { IBackground } from "../../Interfaces/Background/IBackground";
import type { RecursivePartial } from "../../../Types/RecursivePartial";
import { OptionsColor } from "../OptionsColor";
export declare class Background implements IBackground {
    color: OptionsColor;
    image: string;
    position: string;
    repeat: string;
    size: string;
    opacity: number;
    constructor();
    load(data?: RecursivePartial<IBackground>): void;
}
