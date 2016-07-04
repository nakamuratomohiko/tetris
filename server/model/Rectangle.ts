import {Block} from "./Block";
import {BlockType} from "./BlockType";
import {Point} from "./Point";
/**
 * Created by vista on 2016/07/01.
 */

export class Rectangle extends Block{

    constructor(){
        super();
    }

    protected createColor():string{
        return "blue";
    }

    protected setBlockType():BlockType{
        return BlockType.Rectangle;
    }

    protected createForm():Point[][]{
        return [
            [{x:0,y:1},{x:0,y:2},{x:0,y:3}],
            [{x:1,y:0},{x:2,y:0},{x:3,y:0}],
            [{x:0,y:1},{x:0,y:2},{x:0,y:3}],
            [{x:1,y:0},{x:2,y:0},{x:3,y:0}]
        ];
    }
    
   




}