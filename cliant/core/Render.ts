import {Board} from "../model/Board";
import {Block} from "../model/Block";
/**
 * Created by vista on 2016/07/06.
 */


export class Render{
    //壁はblack,whiteはカラ,配列はnumberではなく色配列とする
    private canvas = document.getElementsByTagName('canvas')[0];
    private ctx = this.canvas.getContext('2d');
    private w:number =400;//キャンパスのサイズ
    private h:number = 800;//キャンパスのサイズ
    private cols:number = 10;//横分割個数
    private rows:number = 20;//縦分割個数
    private blockW = this.w / this.cols;//横を１０個のブロックに分ける
    private blockH = this.h / this.rows;//縦を２０個のブロックにわける
    private result:Board[][];
    private block:Block;//操作しているBlock

    constructor(result:Board[][],block:Block){
        this.result = result;
        this.block = block;
    }

    /**
     * キャンバスに書き込む
     */
    public render(){
        //キャンバスをリセット
        this.ctx.clearRect(0,0,this.w,this.h);
        this.ctx.strokeStyle = 'black';
        const blocks = this.block.form[this.block.angle];

        for(let x = 0; x < this.cols; x++){
            for(let y = 0; y < this.rows; y++){

                // if(this.result[x][y].type != 0){

                    this.ctx.fillStyle = this.result[x][y].color;
                    this.drawBlock(x,y);

                // }

            }
        }
        for(let b in blocks){
            this.drawBlock(blocks[b].x,blocks[b].y);
        }
    }

    /**
     *  １ブロックを書く
     * @param x {number}
     * @param y {number}
     */
    private drawBlock(x:number,y:number){
        this.ctx.fillRect(this.blockW * x, this.blockH * y,this.blockW,this.blockH);
        this.ctx.strokeRect(this.blockW * x, this.blockH * y,this.blockW, this.blockH);
    }

}
