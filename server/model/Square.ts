import {Block} from "./Block";
import {Point} from "./Point";
import {BlockType} from "./BlockType";
/**
 * Created by vista on 2016/07/01.
 */


export class Square extends Block{

    constructor(){
        super();
    }

    /**
     * 四角形の図形セット
     * @returns {number[][]}
     */
    protected createForm():Point[][]{
        return [[{x:0,y:1},{x:1,y:1},{x:1,y:0}]];
    }
    


    /**
     * 四角形のBlockTypeをセット
     * @returns {BlockType}
     */
    protected setBlockType():BlockType{
        return BlockType.Square;
    }

    protected createColor():string{
        return "yellow";
    }




}