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
    private BlockW = this.w / this.cols;//横を１０個のブロックに分ける
    private BlockH = this.h / this.rows;//縦を２０個のブロックにわける
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

        for(let i = 0; i < this.cols; i++){
            for(let j = 0; j < this.rows; j++){

                if(this.result[j][i].type != 0){

                    this.ctx.fillStyle = this.result[j][i].color;

                    this.drawBlock(i,j);

                }

            }
        }
    //ここでいくら動いたかを管理する変数をどうやって参照するかなやむ
        for(let b of this.block.form[this.block.angle]){
            this.drawBlock(b.x,b.y);
        }
    }

    /**
     *  １ブロックを書く
     * @param x {number}
     * @param y {number}
     */
    private drawBlock(x:number,y:number){
        this.ctx.fillRect(this.BlockW * x, this.BlockH * y,this.BlockW,this.BlockH);
        this.ctx.strokeRect(this.BlockW * x, this.BlockH * y,this.BlockW, this.BlockH);
    }
}
//30ミリ秒で呼び出される
setInterval(this.render(),30);