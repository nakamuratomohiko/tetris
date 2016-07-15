import {Block} from "../model/Block";
import {BlockType} from "../model/BlockType";
import {Point} from "../model/Point";
/**
 * Created by vista on 2016/07/15.
 */

export class Triangle extends Block{

    constructor(){
        super();
    }

    public reset(){
        super.reset();
        this.point.y = 2;
    }

    protected createColor():string{
        return "purple";
    }

    protected setBlockType():BlockType{
        return BlockType.Triangle;
    }

    protected createForm():Point[][]{
        return [
            [{x:1,y:0},{x:0,y:-1},{x:-1,y:0}],
            [{x:0,y:-1},{x:1,y:0},{x:0,y:1}],
            [{x:-1,y:0},{x:0,y:1},{x:1,y:0}],
            [{x:0,y:1},{x:-1,y:0},{x:0,y:-1}]
        ];
    }
}