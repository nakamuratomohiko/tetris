import {Reproduction} from "./Reproduction";
import {Block} from "../model/Block";
import {Communicator} from "./Communicator";
import {BlockType} from "../model/BlockType";
/**
 * Created by vista on 2016/07/12.
 */

export class TetrisServer{

    private reproList:{};
    private Comm:Communicator;
    
    constructor(){
       this.Comm = new Communicator(this);
        this.reproList = {};
    }

    /**
     * 接続してきた人に検証するインスタンス生成
     * @param id
     * @returns {Promise}
     */
    public connection(id:string):Promise<void>{
        return new Promise<void>((resolve,reject) => {
            this.reproList[id] = new Reproduction();
            if(this.reproList[id] === undefined){
                reject();

            }
            resolve();


        });
    }

    /**
     * 通信していた人のインスタンスを削除
     */
    public disconnect(id:string){
        if(this.reproList[id] != undefined){
          delete  this.reproList[id];

        }
    }

    /**
     * BlockTypeの配列を返す
     * @returns {Promise}
     */
    public ready(id:string):Promise<BlockType[]>{
        return new Promise<BlockType[]>((resolve,reject) =>{
            if(this.reproList[id] === undefined){
                reject("ページを読み込み直してください");
            }
            const list = this.reproList[id].ready();
            if(list === undefined){
                reject("ブロックの読み込みに失敗しました。もう一度準備をおしてください");
            }
            resolve(list);

        });
    }

    /**
     * 検証
     * @param id {string}
     * @param block {Block}
     * @returns {Promise<number>}
     */
    public verid(id:string,block:Block):Promise<number>{
        return new Promise<number>((resolve,reject) =>{
            const re = this.reproList[id];
            if(re == undefined){
                reject("ページをリロードしてください");
            }

            if(re.pushBlock(block)){

                resolve(re.score);
            }else{
                reject("不正がみうけられました");
            }
        });
    }

    /**
     * ゲームの終了処理
     * @param id
     * @returns {Promise<[]>}
     */
    public finishGame(id:string,name:string):Promise<Object[]>{
        return new Promise<Object[]>((resolve,reject) =>{
            const re = this.reproList[id];
            if(re == undefined){
                reject("プレイデータが消えました。ページをリロードしてください");
            }else{
                re.finish(name)
                    .then((list) => {
                        resolve(list);
                    })
                    .catch((err) =>{
                        reject(err);
                    });
            }
        });
    }
}