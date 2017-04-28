import {Reproduction} from "./Reproduction";
import {Block} from "../../model/Block";
import {Communicator} from "./Communicator";
import {BlockType} from "../../model/BlockType";
import * as sms from "source-map-support";
import {ReceiveBlock} from "../../model/ReceiveBlock";
import {BattleManagement} from "../BattleManagement";
/**
 * Created by vista on 2016/07/12.
 */

sms.install();

export class TetrisServer{

    private reproList:{};
    private Comm:Communicator;
    private battleManage : BattleManagement;

    constructor(){
       this.Comm = new Communicator(this);
        this.reproList = {};
        this.battleManage = new BattleManagement();
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
            } else {
                resolve();
            }


        });
    }

    /**
     * 通信していた人のインスタンスを削除
     */
    public disconnect(id:string){
        if(this.reproList[id] != undefined){
            this.battleManage.unregister(id);
            delete  this.reproList[id];

        }
    }

    /**
     * BlockTypeの配列を返す
     * @returns {Promise}
     */
    public ready(id:string, name : string):Promise<Map<string, any>>{
        return new Promise<Map<string,any>> ((resolve,reject) =>{
            if(this.reproList[id] === undefined){
                reject("ページを読み込み直してください");
            }
            const list = this.reproList[id].ready();
            if(list === undefined){
                reject("ブロックの読み込みに失敗しました。もう一度準備をおしてください");
            }
            this.battleManage.unregister(id);
            this.battleManage.challenge(id);
            this.battleManage.setPlayerName(id,name);
            const opponentId = this.battleManage.getOpponent(id);
            const map = new Map<string, any>();
            if (opponentId)  map.set('opponentName', this.battleManage.getPlayerName(opponentId));
            map.set('list', list);
            map.set('opponentId', opponentId);
            map.set('myName', this.battleManage.getPlayerName(id));
            resolve(map);

        });
    }

    /**
     * 検証
     * @param id {string}
     * @param block {Block}
     * @returns {Promise<number>}
     */
    public verid(id:string,block:ReceiveBlock):Promise<Map<string, any>>{
        return new Promise<Map<string,any>>((resolve,reject) =>{
            const re = this.reproList[id];
            if(re === undefined){
                reject("ページをリロードしてください");
            }else{
                if(re.pushBlock(block)){
                    const map = new Map();
                    map.set('score',re.score);
                    map.set('opponentId',this.battleManage.getOpponent(id));
                    resolve( map );
                }else{
                    this.battleManage.unregister(id);
                    reject("不正がみうけられました");
                }
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
                this.battleManage.unregister(id);
                reject("プレイデータが消えました。ページをリロードしてください");
            }else{
                re.finish(name)
                    .then((list) => {
                        resolve(list);
                    })
                    .catch((err) =>{
                        this.battleManage.unregister(id);
                        reject(err);
                    });
            }
        });
    }


}