import {BlockType} from "./BlockType";
import {Block} from "./Block";
import {LBlock} from "./LBlock";
import {ReverseLBlock} from "./ReverseLBlock";
import {Rectangle} from "./Rectangle";
import {ZBlock} from "./ZBlock";
import {ReverseZBlock} from "./ReverseZBlock";
import {Square} from "./Square";
/**
 * Created by vista on 2016/07/07.
 */

export class BlockFactory{

    //すでに作ったインスタンスを管理
    private pool:Block[];

    //Singletonパターン
    private static  singleton:BlockFactory ;

    /**
     * コンストラクタ
     */
    constructor(){
        this.pool  = [];
        const sq = new Square();
        this.pool[sq.blockType] = sq;
        const lb = new LBlock();
        this.pool[lb.blockType] = lb;
        const rlb = new ReverseLBlock();
        this.pool[rlb.blockType] = rlb;
        const rec = new Rectangle();
        this.pool[rec.blockType] = rec;
        const zb = new ZBlock();
        this.pool[zb.blockType] = zb;
        const rzb = new ReverseZBlock();
        this.pool[rzb.blockType] = rzb;
        

    }

    /**
     * 唯一のインスタンスを得る
     * @returns {BlockFactory}
     */
    public static getInstance():BlockFactory {
        if(this.singleton === undefined){
            this.singleton = new BlockFactory();
        }
        return this.singleton;
    }

    /**
     * インスタンスを得る
     * @param blockType
     * @returns {any}
     */
    public getBlock(blockType:BlockType):Block{
        return this.pool[blockType];
        
    }

}