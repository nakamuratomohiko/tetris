import {BlockType} from "../model/BlockType";

/**
 * Created by vista on 2016/07/04.
 */

/**
 * BlockTypeが入った配列を作るクラス
 */
export class Generator{

    private static instance:Generator;
    
    private _ramBlock = [
        BlockType.Rectangle,
        BlockType.LBlock,
        BlockType.ReverseLBlock,
        BlockType.ReverseZBlock,
        BlockType.Square,
        BlockType.ZBlock,
        BlockType.Triangle
    ];
    
    constructor(){
        
    }

    /**
     * singletonのインスタンスを返す
     * @returns {Generator}
     */
    public  static getInstance():Generator{
        if(this.instance == undefined){
            this.instance = new Generator();
        }
        return this.instance;
    }

    /**
     * BlockTypeが入った配列を返す
     * @returns {BlockType[]}
     */
    public createList():BlockType[]{
        let result:BlockType[] = [];

        for(let i:number = 0; i < 1000;i++){
            let ram:number = Math.floor(Math.random()*100) % 7;
            result[i]= this._ramBlock[ram]
        }
        return result;
    }

}