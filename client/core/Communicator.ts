import * as io from "socket.io-client";
import {Block} from "../../model/Block";
import {TetrisController} from "./TetrisController";
import {BlockType} from "../../model/BlockType";
import {ReceiveBlock} from "../../model/ReceiveBlock";

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
        this.tCon = tCon;
        const tc = this.tCon;
        this.socket = io.connect(window.location.href);
      
        /**
         * BlockList:BlockType[]を送ってくる
         */
        this.socket.on('ready',function(blockList:BlockType[]){
            tc.setBlockList(blockList);
        });
        /**
         * サーバ内でエラーが起きたときに送信してくる
         * 不正なそうさが起きたときにたたかれる
         */
        this.socket.on('Error',function(msg:string){
            tc.Error(msg);
        });
        /**
         * スコアを通知してくる
         */
        this.socket.on('notifyScore',function(score:number){
            tc.notifyScore(score);
        });

        /**
         * ランキングの配列が来る
         */
        this.socket.on('ranking',function(rank){
           tc.ranking(rank);
        });

        this.socket.on('rivalBlock', function (rivalBlock : ReceiveBlock) {

           tc.receiveBlock(rivalBlock);
        });

        this.socket.on('rivalScore', (score: number) => {
           tc.rivalScore(score);
        });

        this.socket.on('rivalName', (name : string) => {
            tc.rivalName(name);
        });

        
    }

    /**
     * 準備を
     */
    public ready(name: string){
        this.socket.emit('ready', name);
    }

    /**
     * ゲームを終了した合図
     */
    public finishGame(name:string){
        this.socket.emit('finishGame',name);
    }

    /**
     * ブロックを送信する
     * @param block {Block}
     */
    public pushBlock(block:ReceiveBlock){
        this.socket.emit('verification',block)
    }

   
    
}