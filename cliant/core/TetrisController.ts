import {Communicator} from "./Communicator";
import {Tetris} from "./Tetris";
import {BlockType} from "../../server/model/BlockType";
import {Block} from "../model/Block";
/**
 * Created by vista on 2016/07/07.
 */

export class TetrisController{

    private commu:Communicator;
    private tetris:Tetris;

    constructor(){
        this.commu = new Communicator;
        this.tetris = new Tetris(this);
        document.body.onkeydown = (e)=>this.onKeyDown(e);

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


    public pushBlock(block:Block){
        //serverにブロックを送る
        
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