import {Board} from "../model/Board";
import {Block} from "../model/Block";
/**
 * Created by vista on 2016/07/06.
 */


export class Render{
    //壁はblack,whiteはカラ,配列はnumberではなく色配列とする
    private canvas = document.getElementsByTagName('canvas')[0];
    private ctx = this.canvas.getContext('2d');
    private size = 40;
    private cols:number = 10;//横分割個数
    private rows:number = 20;//縦分割個数
    private result:Board[][];
    private block:Block;//操作しているBlock

    constructor(result:Board[][]){
        this.result = result;
    }

    public setBlock(block):void{
        this.block = block;
    }
    
    /**
     * キャンバスに書き込む
     */
    public render(){
        //キャンバスをリセット
        this.ctx.clearRect(0,0,this.size*this.cols,this.size * this.rows);
        this.ctx.strokeStyle = 'black';
        const blocks = this.block.form[this.block.angle];
        const point = this.block.point;

        for(let x = 0; x < this.cols; x++){
            for(let y = 0; y < this.rows; y++){

                // if(this.result[x][y].type != 0){

                    this.ctx.fillStyle = this.result[x][y].color;
                    this.drawBlock(x,y);

                // }

            }
        }
        
        this.ctx.fillStyle = this.block.color;
        this.drawBlock(this.block.point.x,this.block.point.y);
        for(let b in blocks){
            console.log("block");
            this.drawBlock(blocks[b].x + point.x,blocks[b].y + point.y);
        }
    }

    /**
     *  １ブロックを書く
     * @param x {number}
     * @param y {number}
     */
    private drawBlock(x:number,y:number){
        this.ctx.fillRect(this.size * x, this.size * y,this.size,this.size);
        this.ctx.strokeRect(this.size * x, this.size * y,this.size, this.size);
    }

}
