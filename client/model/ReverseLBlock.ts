import {Block} from "./Block";
import {BlockType} from "./BlockType";
import {Point} from "./Point";
/**
 * Created by vista on 2016/07/04.
 */

export class ReverseLBlock extends Block{

    constructor(){
        super();
    }

    public reset(){
        super.reset();
        this.point.y = 2;
        
    }
    
    protected createColor():string{
        return "lightsteelblue";

    }

    protected setBlockType():BlockType{
        return BlockType.ReverseLBlock;
    }

    protected createForm():Point[][]{
        return [
          [{x:-1,y:1},{x:0,y:1},{x:0,y:-1}],
            [{x:-1,y:-1},{x:1,y:0},{x:-1,y:0}],
            [{x:1,y:-1},{x:0,y:-1},{x:0,y:1}],
            [{x:1,y:1},{x:-1,y:0},{x:1,y:0}]

        ];
    }

}