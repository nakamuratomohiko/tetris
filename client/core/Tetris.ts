import {BlockFactory} from "../../model/BlockFactory";
import {BlockType} from "../../model/BlockType";
import {Board} from "../../model/Board";
import {Block} from "../../model/Block";
import {Point} from "../../model/Point";
import {TetrisController} from "./TetrisController";
import {Render} from "./Render";

/**
 * Created by vista on 2016/07/07.
 */
/**
 *　テトリスの処理をするクラス
 */
export class Tetris {
    private blockFactory:BlockFactory;
    private blockList:BlockType[];
    private cols:number = 10;//横
    private rows:number = 20;//縦
    private next:number = 4;//nextブロックが入るために広げる横領域
    private result:Board[][];
    private _lose:boolean;
    private interval;
    private block:Block;//今操作してるブロック
    private tCon:TetrisController;
    private render:Render;
    private nextBlock:Block;//次に入るブロック
    private nextnextBlock:Block;//次の次に入るブロック
    private _pause:boolean;//一時停止のフラグ

    constructor(tCon:TetrisController) {
        this._pause = false;
        this.tCon = tCon;
        this.blockFactory = BlockFactory.getInstance();
        this.result = [];
        for (let x = 0; x < this.cols+this.next + 1; x++) {
            this.result[x] = [];
        }
        //配列を初期化する

        this.init();
        //初期のブロックをセット
        this.render = new Render(this.result);

    }

    /**
     * loseフラグを返す
     * @returns {boolean}
     */
    public get lose(){return this._lose}
    

    /**
     * 不正が疑われた時などに呼び出されるメソッド
     */
    public invalidOperation(){
        this._lose = true;
        clearInterval(this.interval);
    }

    /**
     *  新しいBlockListをセットする
     *  @param blockList {BlockType[]}
     */
    public setBlockList(blockList:BlockType[]) {
        this.blockList = blockList;
        this.nextBlock = this.blockFactory.getBlock(this.blockList.pop());
        this.nextnextBlock = this.blockFactory.getBlock(this.blockList.pop());
    }

    /**
     * ゲームをスタートさせる
     */
    public newGame() {
        clearInterval(this.interval);
        this.init();
        //初期のブロックをセット
        this.render = new Render(this.result);
        this.newBlock();
        this._lose = false;
        this.interval = setInterval(()=>this.tick(), 400);
    }

    /**
     * 自動でずらす、ブロックの検証もしている
     */
    public tick(offsetX:number = 0, offsetY:number = 1, rotate:number = 0) {
        if(this._pause){
        }else {

            if (this.valid(offsetX, offsetY, rotate)) {
                this.block.point.y += offsetY;
                this.block.point.x += offsetX;
                this.block.angle = rotate;
                this.render.render();
                this.tCon.pushBlock(this.block);

            } else {//何かあったとき
                if (rotate != 0) {
                    if (this.valid(1, 0, 1)) {//右に動ける
                        this.block.point.x += 1;
                        this.block.angle = 1;

                    } else if (this.valid(2, 0, 1) && this.block.point.x < this.cols - 2) {
                        this.block.point.x += 2;
                        this.block.angle = 1;

                    } else if (this.valid(-1, 0, 1)) {
                        this.block.point.x += -1;
                        this.block.angle = 1;

                    } else if (this.valid(-2, 0, 1) && this.block.point.x > 2) {
                        this.block.point.x += -2;
                        this.block.angle = 1;
                    }
                    this.render.render();
                    this.tCon.pushBlock(this.block);

                } else {
                    //下にまだおりれるか判定する
                    if (this.valid(0, 1)) {
                        this.render.render();
                        this.tCon.pushBlock(this.block);
                        return;
                    }
                    //動けなくなった時の処理
                    if (this.valid()) {
                        this.freeze();
                        this.block.stop();
                        this.clearLine();
                        this.tCon.pushBlock(this.block);
                        this.newBlock();
                        this.render.render();


                    }
                    //終了したかの判定
                    if (this._lose) {
                        //新しく始めるのかどうするのかを決める
                        // this.tCon.finishGame();
                        clearInterval(this.interval);
                        this.tCon.finishGame();
                        return;
                    }

                }

            }
        }

    }


    /**
     * 検証
     * @param offsetX {number} 横に動く数
     * @param offsetY {number} 縦に動く数
     * @param rotate {number} 回転右回転
     * @param newBlock {Block}　
     * @returns {boolean}　OKかダメか
     */
    public valid(offsetX:number = 0, offsetY:number = 0, rotate:number = 0):boolean {
        const block = this.block;
        const result = this.result;
        offsetX = block.point.x + offsetX;
        offsetY = block.point.y + offsetY;
        
        const blocks:Point[] = block.form[(block.angle + rotate) % 4];
        const coreType = result[offsetX][offsetY].type;

        for (let i in blocks) {
            let type = result[blocks[i].x + offsetX][blocks[i].y + offsetY].type;

            //ブロックが動いていないときの検証
            if (rotate == 0 && offsetX == block.point.x &&
                offsetY == block.point.y &&
                (result[block.point.x + blocks[i].x] [block.point.y + blocks[i].y].type == -2 ||
                coreType == -2)) {
                this._lose = true;
                return false;

                //ブロックが動く方向の検証
            } else if ( type == 1 || type === undefined || type == -1 ||
                            coreType == 1 || coreType ===undefined || coreType == -1) {
                return false;
            }


        }

        return true;

    }

    /**
     * ブロックタイプの配列から次の要素を取得してBlockインスタンスを返す
     */
    private newBlock() {
        this.block = this.nextBlock;
        this.nextBlock = this.nextnextBlock;
        this.nextnextBlock = this.blockFactory.getBlock(this.blockList.pop());
        if(this.block === undefined){
            this._lose = true;
            this.render.setBlock(this.block);
            return;
        }
        this.nextBlockAreaSet();
        this.block.reset();
        this.block.point.x = this.cols / 2;
        this.render.setBlock(this.block);
    }

    /**
     * 次のブロック、次の次ブロックを配列にセット
     */
    private nextBlockAreaSet(){
        //nextBlockAreaの中身を書き直すために情報を変える
        for(let x = this.cols; x < this.cols+ this.next; x++){
            for(let y = 1; y < this.rows  -1; y++){

                if(y == 5){
                    //次のブロックと次の次ブロックを区切る
                    this.result[x][y] = {type:-1,color:"black"};
                }else{
                    this.result[x][y] = {type:0,color:"white"};
                }

            }
        }

        const x = this.cols + this.next -3;

        if(this.nextBlock !== undefined) {
            //ブロックの中心軸を書く
            //nextBlockを書く
            const y = 2;
            const nBlock = this.nextBlock;
            const form = nBlock.form[0];
            this.result[x][y] = {type: 0, color: nBlock.color};
            for (let i  in form) {
                this.result[x + form[i].x][y + form[i].y] = {type: 0, color: nBlock.color};
            }
        }

        //nextnextBlockを書く
        if(this.nextnextBlock !== undefined){

            const y = 7;
            const nnBlock = this.nextnextBlock;
            const form = nnBlock.form[0];
            this.result[x][y] = {type: 0, color: nnBlock.color};
            for (let i  in form) {
                this.result[x + form[i].x][y + form[i].y] = {type: 0, color: nnBlock.color};
            }

        }
    }

    /**
     * 配列をきれいに戻す
     */
    private
    init() {
        for (let x = 0; x < this.cols + this.next + 1; x++) {
            for (let y = 0; y < this.rows; y++) {
                if (x == 0 || x == this.cols - 1 || x == this.cols+this.next ) {
                    this.result[x][y] = {type: -1, color: "black"};

                } else if (y == (this.rows - 1) || y == 0) {
                    this.result[x][y] = {type: -1, color: "black"};

                } else if (y == 1 || y == 2 || y == 3 || y == 4 ) {
                    this.result[x][y] = {type: -2, color: "gray"}

                } else if(this.cols <= x && y == 5) {
                    //ネクストブロックの区切りを記述
                    this.result[x][y] = {type: -1, color:"black"};
                }else {
                    this.result[x][y] = {type: 0, color: "white"};
                }

            }
        }

    }

    /**
     * ブロックを固定させる
     */
    public freeze() {
        const blocks:Point[] = this.block.form[this.block.angle];
        const point = {x: this.block.point.x, y: this.block.point.y};

        const board = {type: 1, color: this.block.color};
        this.result[point.x][point.y] = board;
        for (let block of blocks) {
            if (this.result[block.x + point.x][block.y + point.y].type == -2) {

            } else {
                this.result[block.x + point.x][block.y + point.y] = board;

            }
        }

    }

    /**
     * 一列に並んでいるラインがあれば消す
     */
    public
    clearLine() {

            for (let y = 5; y < this.rows -1 ; y++) {
            let rowLine = true;
            for (let x = 0; x < this.cols ; x++) {
                if (this.result[x][y].type == 0) {
                    rowLine = false;
                    break;
                }
            }

            if (rowLine) {
                for (let yy = y; yy > 5; yy--) {
                    for (let x = 1; x < this.cols - 1; x++) {
                        this.result[x][yy] = this.result[x][yy - 1];
                    }

                }
                for(let z = 1 ; z < this.cols -1; z++){
                    this.result[z][5] = {type:0,color:"white"};
                }

            }

        }
    }

    /**
     * 一時停止
     * @returns {boolean}
     */
    public pause():boolean{
        
        if(this._pause ){
            this.interval = setInterval(()=>this.tick(), 400);
            this._pause = false;
            return this._pause;
            
        }else{
            
            clearInterval(this.interval);
            this._pause = true;
            return this._pause;
        }

    }


}