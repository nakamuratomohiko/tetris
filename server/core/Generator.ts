import {BlockType} from "../model/BlockType";

/**
 * Created by vista on 2016/07/04.
 */

/**
 * BlockTypeが入った配列を作るクラス
 */
export class Generator{

    private _ramBlock = [
        BlockType.Rectangle,
        BlockType.LBlock,
        BlockType.ReverseLBlock,
        BlockType.ReverseZBlock,
        BlockType.Square,
        BlockType.ZBlock
    ];

    /**
     * BlockTypeが入った配列を返す
     * @returns {BlockType[]}
     */
    public createList():BlockType[]{
        let result:BlockType[] = [];

        for(let i:number = 0; i < 100;i++){
            let ram:number = Math.random()*100 % 6;
            result[i]= this._ramBlock[ram]

        }
        return result;
    }
/*
    private getBlock(ram:number):Block{

        let result:Block;
        if(ram == 0){
            result = new Rectangle();
        }else if(ram == 1) {
            result = new LBlock();
        }else if(ram == 2){
            result = new ReverseLBlock();
        }else if(ram == 3){
            result = new ReverseZBlock();
        }else if(ram == 4){
            result = new Square();
        }else if(ram == 5){
            result = new ZBlock();
        }

        return result;
    }
    */
}