import {Point} from "./Point";
import {BlockType} from "./BlockType";

export interface ReceiveBlock {
    point : Point,
    angle : number,
    blockType : BlockType
    form : Point[][],
    color : string,
    date : Date,
    stop : boolean
}