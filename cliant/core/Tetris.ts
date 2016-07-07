import {BlockFactory} from "../model/BlockFactory";
import {BlockType} from "../../server/model/BlockType";
import {Board} from "../model/Board";
import {Block} from "../model/Block";
import {Point} from "../../server/model/Point";
import {TetrisController} from "./TetrisController";

/**
 * Created by vista on 2016/07/07.
 */

export class Tetris{
    private blockFactory:BlockFactory;
    private blockList:BlockType[];
    private cols = 20;//横
    private rows = 40;//縦
    private result:Board[][];
    private lose;
    private interval;
    private block:Block;//今操作してるブロック
    private tCon:TetrisController;

    constructor(tcon:TetrisController){
        this.tCon = tcon;
    }

    /**
     *  新しいBlockListをセットする
     *  @param blockList {BlockType[]}
     */
    public setBlockList(blockList:BlockType[]){
        this.blockList = blockList;
    }

    /**
     * ゲームをスタートさせる
     */
    public newGame(){
        clearInterval(this.interval);
        this.init();
        //初期のブロックをセット
        this.newBlock();
        this.lose = false;
        this.interval = setInterval(this.tick(),250);
    }

    /**
     * 自動でずらす、ブロックの検証もしている
     */
    private tick(){

        if(this.valid(0,1)){//何もなければ１つ下がる
            this.block.point.x++;
        }else{//何かあったとき
            this.freeze();
            this.clearLine();

            if(this.lose){
                //新しく始めるのかどうするのかを決める
                // this.tCon.finishGame();
                this.newGame();
            }

            this.newBlock();//新しいブロックをセット

        }

    }

    /**
     * 検証
     * @param offsetX {number} 横に動く数
     * @param offsetY {number} 縦に動く数
     * @param newBlock {Block}　
     * @returns {boolean}　OKかダメか
     */
    private valid(offsetX:number=0,offsetY:number=0, newBlock:Block=this.block):boolean{
        offsetX = this.block.point.x + offsetX;
        offsetY = this.block.point.y + offsetY;
        const blocks = newBlock.form[newBlock.angle];
        for(let block of blocks){

            if(this.result[block.x + offsetX][block.y + offsetY].type != 0 &&
                    this.result[block.x + offsetX][block.y + offsetY].type == undefined){
                if( (newBlock.point.y + block.y) <=  0  ){
                    this.lose = true;
                }
                return false;
            }

        }

        return true;

    }

    /**
     * ブロックタイプの配列から次の要素を取得してBlockインスタンスを返す
     */
    private newBlock(){
        const block =  this.blockFactory.getBlock(this.blockList.pop());
        block.point.x = this.cols / 2;
        block.point.y = this.rows / 2;
        this.block = block;
    }

    /**
     * 配列をきれいに戻す
     */
    private init(){
        for(let x = 0;x < this.cols; x++){
            for(let y = 0;y < this.rows;y++){
                if(x == 0 || (x == this.cols-1)){
                    this.result[x][y] = {type:-1,color:"black"};
                }else if(y == this.rows -1){
                    this.result[x][y] = {type:-1,color:"black"};
                }else {
                    this.result[x][y] = {type:0,color:"white"};
                }
            }
        }

    }

    /**
     * ブロックを固定させる
     */
    public freeze(){
        const blocks:Point[] = this.block.form[this.block.angle];
        for(let block of blocks){
            this.result[block.x][block.y] = {type:1,color:this.block.color};
        }
        
    }

    /**
     * 一列に並んでいるラインがあれば消す
     */
    public clearLine(){
        for(let y = 0; y < this.rows; y++){
            let rowLine = true;
            for(let x = 0; x < this.cols; x++){
                if(this.result[x][y].type == 0){
                    rowLine = false;
                    break;
                }
            }

            if(rowLine){
                for(let yy = y; yy > 0; yy--){
                    for(let x = 1; x < this.cols -1; x++){
                        this.result[x][yy] = this.result[x][yy - 1 ];
                    }
                }

                y++;
            }

        }
    }




}