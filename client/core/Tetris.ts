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

    constructor(tCon:TetrisController) {
        this.tCon = tCon;
        this.blockFactory = BlockFactory.getInstance();
        this.result = [];
        for (let x = 0; x < this.cols; x++) {
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
        if (this.valid(offsetX, offsetY, rotate)) {
            this.block.point.y += offsetY;
            this.block.point.x += offsetX;
            this.block.angle = rotate;
            this.render.render();

        } else {//何かあったとき

            if (this.valid(0, 1)) {
                this.render.render();
                return;
            }
            if(this.valid()){
                this.freeze();
                this.clearLine();
                this.tCon.pushBlock(this.block);
                this.newBlock();
                this.render.render();


            }
            if (this._lose) {
                //新しく始めるのかどうするのかを決める
                // this.tCon.finishGame();
                clearInterval(this.interval);
                this.tCon.finishGame();
                return;
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
        this.block.reset();
        this.block.point.x = this.cols / 2;
        this.render.setBlock(this.block);
    }

    /**
     * 配列をきれいに戻す
     */
    private
    init() {
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                if (x == 0 || x == this.cols - 1) {
                    this.result[x][y] = {type: -1, color: "black"};

                } else if (y == (this.rows - 1) || y == 0) {
                    this.result[x][y] = {type: -1, color: "black"};

                } else if (y == 1 || y == 2 || y == 3 || y == 4) {
                    this.result[x][y] = {type: -2, color: "gray"}

                } else {
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


}