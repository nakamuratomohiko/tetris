import {Block} from "../model/Block";
import {Point} from "../model/Point";
import {User} from "../model/User";
import {BlockType} from "../model/BlockType";
import Promise = require("any-promise/index");
import {DBStore} from "../db/DBStore";
/**
 * Created by vista on 2016/07/05.
 */


export class Reproduction{

    private _score:number;
    private result:number[][];
    private blockList:BlockType[];
    private user:User;
    private _startTime:Date;
    private dbStore:DBStore;
    private _endTime:Date ;

    constructor(user:User){
        this.user = user;
        this.dbStore = new DBStore();
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
     * ゲームの終了でデータベースにデータを入れる、最高得点のときのみ
     * @returns {Promise}
     */
    public finish():Promise<any>{
        return new Promise(function (resolve,reject) {
            this.dbStore.scoreUpdate(this.user)
                .then(res =>{resolve()})
                .catch(err =>{reject()});
                        
        });
    }

    /**
     * 検証
     * @param block
     * @returns {boolean}
     */
    public verification(block:Block):boolean{

        //置いた時間が終了時間を超えていた場合不正とみなす。
        if(this.endTime < block.date){return false;}

        this.blockList.pop();//ここで引数のブロックのタイプから手元で同じものを作成してテストを始める
        const px:number = block.point.x;
        const py:number = block.point.y;
        let form:Point[][] = block.form;
        //ここで検証する
        if(this.result[px][py] == 1){
            //失敗
            this.change(0);
            return false;

        }else{//成功
            for(let i of form[block.angle]){
                let x = i.x;
                let y = i.y;

                if(this.result[block.point.x+x][block.point.y+y] == 1){
                    //失敗
                    this.change(0);
                    return false;
                }else {
                    //仮で入れる
                    this.result[block.point.x+x][block.point.y+y] = -1;
                }


            }

        }
        this.change(1);
        this.calculation();
        return true;
    }

    /**
     * 仮で入っている-1を引数の数字に変換する
     * @param num {number}
     */
    private change(num:number){
        for(let i:number = 0; i < this.result[0].length;i++){
            for(let j = 0; this.result.length;j++){
                if(this.result[j][i] == -1){this.result[j][i] = num}
            }
        }
    }



    /**
     * 点数を計算と計算したレーンを消す
     */
    private calculation(){

        let lane:number=0;

        //上から下に
        for(let i:number = 0;i < this.result[0].length;i++){
            let count = 0;
            //左から右に
            for(let j:number = 0; j < this.result.length;j++){

                if(this.result[j][i]==1 ){
                    count += 1;
                }
                if(count == this.result.length){
                    lane += 1;
                    //一直線に埋まっているlaneは0を入れる
                    for( let c:number = 1; c < this.result.length -1; c++){
                        this.result[c][i] = 0;
                    }
                }

            }

        }

        this.score = this.score + (lane * 100);
    }





}
