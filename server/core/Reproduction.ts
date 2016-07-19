import {BlockType} from "../../model/BlockType";
import Promise = require("any-promise/index");
import {DBStore} from "../db/DBStore";
import {BlockFactory} from "../../model/BlockFactory";
import {Generator} from "./Generator";
/**
 * Created by vista on 2016/07/05.
 */


export class Reproduction {

    private _score:number;
    private result:number[][];
    private blockList:BlockType[];
    private _startTime:Date;
    private dbStore:DBStore;
    private _endTime:Date;
    private blockFactry:BlockFactory;
    private cols:number  = 10;
    private rows:number = 20;
    private genrator:Generator;

    constructor(){
        this.dbStore = new DBStore();
        this.blockFactry = BlockFactory.getInstance();
        this.genrator = Generator.getInstance();
        this.result = [];
        for(let i = 0;i < 10;i++){
            this.result[i] = [];
        }

    }

    public set startTime(startTime:Date){
        this._startTime = startTime;
    }

    public get startTime():Date{
        return this._startTime;
    }

    public get endTime():Date{
        return this._endTime;
    }

    public set endTime(endTime){
        this._endTime = endTime;
    }

    public get score():number{
        return this._score;
    }

    /**
     * 準備、リセット
     */
    public ready():BlockType[]{
        this._score = 0;
        this.init();
        this.blockList = this.genrator.createList();
        return this.blockList;
    }
    
    /**
     * ゲームの終了でデータベースにデータを入れる,またランキングを取得する
     * @returns {Promise}
     */
    public finish(name:string):Promise<Object> {
        const db = this.dbStore;
        const score = this._score;
        return new Promise<Object[]>(function (resolve, reject) {
            db.scoreInsert(name,score)
                .then(()=>db.getRank())
                .then((list:Object[]) => {
                    resolve(list);
                })
                .catch((err) => {
                    reject(err);
                });

        });
    }

    /**
     * ブロックを送られてくる、検証から計算、ラインの削除まで行う
     * @param block
     * @returns {boolean}
     */
    public pushBlock(block):boolean{
        if( this.verification(block) ){
            this.change(1);
            this.calculation();
            this.clearLine();
            return true;
        }else{
            this.change(0);
            return false;
        }

    }

    /**
     * 検証
     * @param block
     * @returns {boolean}
     */
    private verification(block):boolean {
        //置いた時間が終了時間を超えていた場合不正とみなす。
        // if (this.endTime < block.date) {return false;}
        //配列から引っ張ってきて、引数と比較
        if(this.blockList.pop() == block._blockType){
            const px:number = block._point.x;
            const py:number = block._point.y;
            const tBlock = this.blockFactry.getBlock(block._blockType);
            if(tBlock === undefined){;return false;}
            //ここで検証する

            if (this.result[px][py] == 0) {
                this.result[px][py] = -2;
            }else{
                return false;
            }let c = 0;
            for (let i of tBlock.form[block._angle]) {
                let x = i.x;
                let y = i.y;
                if (this.result[px + x][py + y] == 0) {
                    //仮で入れる
                    this.result[px + x][py + y] = -2;
                } else {
                    //失敗
                    return false;
                }


            }
            return true;    
        }//ここで引数のブロックのタイプから手元で同じものを作成してテストを始める
        return false;
        
    }

    /**
     * 仮で入っている-1を引数の数字に変換する
     * @param num {number}
     */
    private change(num:number) {
        for (let i:number = 0; i < this.result[0].length; i++) {
            for (let j = 0; j < this.result.length; j++) {
                if (this.result[j][i] == -2) {
                    this.result[j][i] = num
                }
            }
        }
    }


    /**
     * 点数を計算
     */
    private calculation(){

        let lane:number=0;

        //上から下に
        for(let i:number = 0;i < this.result[0].length;i++){
            let count = 0;
            //左から右に
            for(let j:number = 1; j < this.result.length -1 ;j++){

                if(this.result[j][i]==1){
                    count += 1;
                }
            }
            if (count == this.result.length -2) {
                lane += 1;
            }

        }


        this._score = this._score + (lane * 10);
    }

    /**
     * result配列を初期化する
     */
    private init() {
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                if (x == 0 || x == this.cols - 1) {
                    this.result[x][y] = -1;

                } else if (y == (this.rows - 1) || y == 0) {
                    this.result[x][y] = -1;
                    
                } else {
                    this.result[x][y] = 0;
                }

            }
        }

    }
    
    /**
     * 一列に並んでいるラインがあれば消す
     */
    private
    clearLine() {

        for (let y = 5; y < this.rows -1 ; y++) {
            let rowLine = true;
            for (let x = 0; x < this.cols ; x++) {
                if (this.result[x][y] == 0) {
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

                for(let z = 1; z < this.cols-1;z++){
                    this.result[z][5] = 0;
                }

            }

        }
    }


}
