import {Board} from "../../model/Board";
import {Block} from "../../model/Block";
import {ReceiveBlock} from "../../model/ReceiveBlock";
/**
 * Created by vista on 2016/07/06.
 */


export class Render{
    //壁はblack,whiteはカラ,配列はnumberではなく色配列とする
    private ctx;
    private size;
    private cols:number = 10;//横分割個数
    private rows:number = 20;//縦分割個数
    private block:Block | ReceiveBlock;//操作しているBlock
    private next:number = 4;//nextBlockを表示する横領域

    constructor(canvas : HTMLCanvasElement, size : number ){
        this.ctx = canvas.getContext('2d');
        this.size = size;
    }

    /**
     * Blockをセットする
     * @param block
     */
    public setBlock(block : Block | ReceiveBlock):void{
        this.block = block;
    }
    
    /**
     * キャンバスに書き込む
     */
    public render(result : Board[][]){
        //キャンバスをリセット
        this.ctx.clearRect(0,0,this.size*this.cols,this.size * this.rows);
        this.ctx.strokeStyle = 'black';

        for(let x = 0; x < this.cols+this.next + 1; x++){
            for(let y = 0; y < this.rows; y++){

                // if(this.result[x][y].type != 0){

                    this.ctx.fillStyle = result[x][y].color;
                    this.drawBlock(x,y);

                // }

            }
        }

        //ブロックがなければ書かない
        if(this.block !== undefined) {
            const blocks = this.block.form[this.block.angle];
            const point = this.block.point;
            this.ctx.fillStyle = this.block.color;
            this.drawBlock(this.block.point.x, this.block.point.y);
            for (let b in blocks) {
                this.drawBlock(blocks[b].x + point.x, blocks[b].y + point.y);
            }
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
