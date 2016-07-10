import {Communicator} from "./Communicator";
import {Tetris} from "./Tetris";
import {BlockType} from "../../server/model/BlockType";
import {Block} from "../model/Block";
import {User} from "../model/User";
/**
 * Created by vista on 2016/07/07.
 */

export class TetrisController{

    private commu:Communicator;
    private tetris:Tetris;
    private user:User;

    constructor(){
        this.commu = new Communicator(this);
        this.tetris = new Tetris(this);
        document.body.onkeydown = (e)=>this.onKeyDown(e);
        this.user = new User();
    }

    /**
     * ClientのTetrisのセット
     * @param blockList {BlockType}
     */
    public ready(blockList:BlockType[]){
        this.tetris.setBlockList(blockList);
    }

    /**
     * ClientのTetrisを動かす
     */
    public start(){
        this.tetris.newGame();
    }

    /**
     * ユーザをセットする
     * @param user
     */
    public setUser(name:string,score:number){
        this.user.name = name;
        this.user.score = score;
    }

    /**
     * ユーザのスコアをセットする
     * @returns {number}
     */
    public getScore():number{
        return this.user.score;
    }

    //ユーザのスコアよりも高かった場合に表示、ユーザのスコア更新
    public notifyScore(score:number){

    }

    /**
     * サーバにブロックを送る
     * @param block
     */
    public pushBlock(block:Block){
        //serverにブロックを送る
        this.commu.pushBlock(block);
        
    }

    


    public finishGame():void{
        //serverに終了を告げる
    }

    /**
     * キーをセット
     * @param e
     */
    private onKeyDown(e):void{

        //キーに名前をセットする
        const keys ={
            37: 'left',
            39: 'right',
            40: 'down',
            38: 'rotate'
        };

        if(typeof keys[e.keyCode] != 'undefined'){
            if(!this.tetris.lose) {
                this.keyDown(keys[e.keyCode]);
            }
        }


    }


    /**
     * キーの動作設定
     * @param key
     */
    private keyDown( key ){
        
        switch (key){

            case 'left':
                this.tetris.tick(-1);
                break;

            case 'rotate':
                this.tetris.tick(0,0,1);
                break;
            case 'right':
                this.tetris.tick(1,0,0);
                break;
            case 'down':
                this.tetris.tick(0,1);
                break;
        }
    }


}