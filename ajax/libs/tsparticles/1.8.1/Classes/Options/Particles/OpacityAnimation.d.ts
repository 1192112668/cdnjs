import { IOpacityAnimation } from "../../../Interfaces/Options/Particles/IOpacityAnimation";
export declare class OpacityAnimation implements IOpacityAnimation {
    /**
     *
     * @deprecated this property is obsolete, please use the new minimumValue
     */
    get opacity_min(): number;
    /**
     *
     * @deprecated this property is obsolete, please use the new minimumValue
     * @param value
     */
    set opacity_min(value: number);
    enable: boolean;
    minimumValue: number;
    speed: number;
    sync: boolean;
    constructor();
}
