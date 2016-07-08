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
        this.render = new Render(this.result);
        this.newBlock();
        this.lose = false;
        this.interval = setInterval(()=>this.tick(),250);
    }

    /**
     * 自動でずらす、ブロックの検証もしている
     */
    public tick(){
        this.render.render();
        if(this.valid(0,1)){//何もなければ１つ下がる
            this.block.point.y += 1;
            console.log("point+y"+this.block.point.y);
            this.render.render();

        }else{//何かあったとき
            this.freeze();
            if(this.valid()){
                this.newBlock();
                console.log("true");
            }else{
                console.log("false");
                if(this.lose){
                    //新しく始めるのかどうするのかを決める
                    // this.tCon.finishGame();
                    // this.newGame();
                    clearInterval(this.interval);
                    console.log("end");
                    return;
                }

            }
            this.render.render();
            // this.clearLine();
            // if(this.lose){
            //     //新しく始めるのかどうするのかを決める
            //     // this.tCon.finishGame();
            //     // this.newGame();
            //     clearInterval(this.interval);
            //     console.log("end");
            //     return;
            // }


        }

    }

    /**
     * 検証
     * @param offsetX {number} 横に動く数
     * @param offsetY {number} 縦に動く数
     * @param newBlock {Block}　
     * @returns {boolean}　OKかダメか
     */
    private valid(offsetX:number=0,offsetY:number=0):boolean{
        const block = this.block;
        offsetX = block.point.x + offsetX;
        offsetY = block.point.y + offsetY;

        const blocks:Point[] = block.form[block.angle];

        for(let i in blocks){
            let type  = this.result[blocks[i].x + offsetX][blocks[i].y + offsetY].type;

            if(offsetX == block.point.x &&
                offsetY == block.point.y &&
                this.result[block.point.x + blocks[i].x] [block.point.y + blocks[i].y ].type == -2){
                console.log("lose");
                this.lose = true;
                return false;
            }else if( (offsetX != block.point.x || offsetY != block.point.y ) &&
                type == 1 || type === undefined || type == -1 ){
                console.log("miss");
                console.log(type);
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
        block.reset();
        block.point.x = this.cols / 2;
        this.block = block;
        this.render.setBlock(block);
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
                    this.result[x][y] = {type:-1,color:"black"};

                }else if( y == 1 || y == 2 || y == 3 || y == 4){
                    this.result[x][y] = {type:-2,color:"red"}

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
        const point = {x:this.block.point.x,y:this.block.point.y};

        const board = {type:1,color:this.block.color};
        this.result[point.x][point.y] = board;
        for(let block of blocks){
            if(this.result[block.x + point.x][block.y + point.y].type == -2){

            }else{
                this.result[block.x + point.x][block.y + point.y] = board;

            }
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