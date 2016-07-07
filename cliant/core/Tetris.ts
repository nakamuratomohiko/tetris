import {BlockFactory} from "../model/BlockFactory";
import {BlockType} from "../../server/model/BlockType";
import {Board} from "../model/Board";
import {Block} from "../model/Block";
import {Point} from "../../server/model/Point";
import {TetrisController} from "./TetrisController";
import {Render} from "./Render";

/**
 * Created by vista on 2016/07/07.
 */

export class Tetris{
    private blockFactory:BlockFactory;
    private blockList:BlockType[];
    private cols = 10;//横
    private rows = 20;//縦
    private result:Board[][];
    private lose;
    private interval;
    private block:Block;//今操作してるブロック
    private tCon:TetrisController;
    private render:Render;

    constructor(/*tcon:TetrisController*/){
        // this.tCon = tcon;
        this.blockFactory = BlockFactory.getInstance();
        this.result = [];
       for(let x = 0; x < this.cols; x++){
           this.result[x] = [];
       }

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
        this.render = new Render(this.result,this.block);
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
        const blocks:Point[] = newBlock.form[newBlock.angle];
        for(let i in blocks){

            if(this.result[blocks[i].x + offsetX][blocks[i].y + offsetY].type != 0 &&
                    this.result[blocks[i].x + offsetX][blocks[i].y + offsetY].type == undefined){
                if( (newBlock.point.y + blocks[i].y) <=  0  ){
                    this.lose = true;
                }
                return false;
            }

        }

        this.render.render();
        return true;

    }

    /**
     * ブロックタイプの配列から次の要素を取得してBlockインスタンスを返す
     */
    private newBlock(){
        console.log(this.blockList);
        const block =  this.blockFactory.getBlock(this.blockList.pop());
        this.block = block;
    }

    /**
     * 配列をきれいに戻す
     */
    private init(){
        for(let x = 0;x < this.cols; x++){
            for(let y = 0;y < this.rows;y++){
                if(x == 0 || x == this.cols-1){
                    this.result[x][y] = {type:-1,color:"black"};
                }else if(y == (this.rows -1) || y == 0 ){
                    this.result[x][y] = {type:-1,color:"red"};
                }else {
                    this.result[x][y] = {type:0,color:"green"};
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