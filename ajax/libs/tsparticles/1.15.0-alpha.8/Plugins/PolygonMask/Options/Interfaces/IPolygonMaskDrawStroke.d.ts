import type { IOptionLoader } from "../../../../Options/Interfaces/IOptionLoader";
import type { IColor } from "../../../../Core/Interfaces/IColor";
export interface IPolygonMaskDrawStroke extends IOptionLoader<IPolygonMaskDrawStroke> {
    color: string | IColor;
    width: number;
    opacity: number;
}
