import {Block} from "./Block";
import {Point} from "./Point";
import {BlockType} from "./BlockType";
/**
 * Created by vista on 2016/07/04.
 */


export class ReverseZBlock extends Block{

    constructor(){
        super();
    }

    protected createColor():string{
        return "red";
    }

    protected setBlockType():BlockType{
        return BlockType.ReverseZBlock;
    }

    protected createForm():Point[][]{
        return [
          [{x:1,y:0},{x:0,y:1},{x:-1,y:1}],
            [{x:0,y:-1},{x:1,y:0},{x:1,y:1}],
              [{x:1,y:0},{x:0,y:1},{x:-1,y:1}],
              [{x:0,y:-1},{x:1,y:0},{x:1,y:1}]
        ];
    }
}