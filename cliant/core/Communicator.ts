import * as io from "socket.io-client";
import {Block} from "../../cliant/model/Block";
import {TetrisController} from "./TetrisController";

/**
 * Created by vista on 2016/07/08.
 */

/**
 * 通信を担当するクラス
 */
export class Communicator{

    private socket;
    private tCon:TetrisController;
    constructor(tCon:TetrisController){
        this.socket = io.connect('http://localhost:8080');
        this.tCon = tCon;
        this.socket.on('connection',function(){ console.log("conn")});
        /**
         * BlockList:BlockType[]を送ってくる
         */
        this.socket.on('ready',function(data:string){   
            const obj = JSON.parse(data);
            this.tCon.ready(obj.blockList);
        });
        /**
         * サーバ内でエラーが起きたときに送信してくる
         */
        this.socket.on('Error',function(msg:string){
            this.tCon.Error(msg);
        });
        /**
         * スコアを通知してくる
         */
        this.socket.on('notifyScore',function(msg:string){
            this.tCon.notifyScore(msg);
        });

        /**
         * これは検証でおかしければ送信してくる
         */
        this.socket.on('verification',function (msg:string){
            console.log(msg);
        });
        
        
        
    }

    /**
     * 準備を
     * @param name
     */
    public ready(name:string){
        this.socket.emit('ready',JSON.stringify({name:name}));
    }

    /**
     * ゲームを終了した合図
     */
    public finishGame(){
        this.socket.emit('finishGame');
    }

    /**
     * ブロックを送信する
     * @param block {Block}
     */
    public pushBlock(block:Block){
        console.log("pushBlock");
        this.socket.emit('verification',JSON.stringify({block:block}))
    }


    

    


    





    
}