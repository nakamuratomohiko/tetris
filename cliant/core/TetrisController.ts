import {Communicator} from "./Communicator";
import {Tetris} from "./Tetris";
import {BlockType} from "../../server/model/BlockType";
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

    public setBlockList(blockList:BlockType[]){
        this.tetris.setBlockList(blockList);
        this.tetris.newGame();
    }
    
    public newGame(){
        this.newGame();
    }

    

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
                this.keydown(keys[e.keyCode]);
            }
        }


    }




    private keydown( key ){
        
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
        }
    }


}