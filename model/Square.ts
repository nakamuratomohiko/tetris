import {Block} from "./Block";
import {Point} from "./Point";
import {BlockType} from "./BlockType";
/**
 * Created by vista on 2016/07/01.
 */
/**
 * 正方形
 */
export class Square extends Block{
    

    constructor(){
        super();
    }
    
    public reset(){
        super.reset();
        this.point.y = 1;

    }
    
    protected createForm():Point[][]{
        return [[{x:0,y:1},{x:1,y:1},{x:1,y:0}],
            [{x:0,y:1},{x:1,y:1},{x:1,y:0}],
            [{x:0,y:1},{x:1,y:1},{x:1,y:0}],
            [{x:0,y:1},{x:1,y:1},{x:1,y:0}]];
    }
    
    protected setBlockType():BlockType{
        return BlockType.Square;
    }

    protected createColor():string{
        return "yellow";
    }
    




}