import {Reproduction} from "./Reproduction";
import {Block} from "../model/Block";
import {Communicator} from "./Communicator";
/**
 * Created by vista on 2016/07/12.
 */

export class TetrisServer{

    private reproList;
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
    public connection(id:strig):Promise{
        return new Promise((resolve,reject) => {
            
            this.reproList[id] = new Reproduction();
            if(this.repoList[id] != undefined){
                resolve();
            }
            reject();

        });
    }

    /**
     * 通信していた人のインスタンスを削除
     */
    public disconnect(){
        if(this.reproList[id] != undefined){
            this.reproList[id].delete();

        }
    }

    /**
     * BlockTypeの配列を返す
     * @returns {Promise}
     */
    public ready(id:string):Promise<BlockType[]>{
        return new Promise((resolve,reject) =>{
            const re  = this.reproList[id];
            if(re === undefined){
                reject("ページを読み込み直してください");
            }
            this.reproList[id].ready();
            const list = re.ready();
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
        return new Promise((resolve,reject) =>{
            const re = this.repoList[id];
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
    public finishGame(id:string,name:string):Promise<[]>{
        return new Promise((resolve,reject) =>{
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