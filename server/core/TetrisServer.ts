import {Reproduction} from "./Reproduction";
/**
 * Created by vista on 2016/07/12.
 */

export class TetrisServer{

    private reproList;
    
    constructor(){
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
    public ready(id:string):Promise{
        return new Promise((resolve,reject) =>{
            const re  = this.reproList[id];
            if(re === undefined){
                reject();
            }
            this.reproList[id].ready();
            const list = re.ready();
            if(list === undefined){
                reject();
            }
            resolve(list);

        });
    }
}