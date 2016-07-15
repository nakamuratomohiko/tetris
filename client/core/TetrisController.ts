import {Communicator} from "./Communicator";
import {Tetris} from "./Tetris";
import {BlockType} from "../model/BlockType";
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
        this.ready();
        document.getElementById("refresh").onclick = ()=> this.ready();
        document.getElementById("start").onclick = ()=>this.start();

    }

    /**
     * ClientのTetrisのセット
     */
    public ready(){
        //初期化する
        const s = <HTMLInputElement>document.getElementById("score");
        s.innerHTML = "";
        const e = <HTMLInputElement>document.getElementById("error");
        e.innerHTML = "";
        const a = <HTMLInputElement>document.getElementById("start");
        a.disabled = true;
        this.commu.ready();

    }

    /**
     * BlockType[]をTetrisクラスにセットする
     * @param blockList
     */
    public setBlockList(blockList:BlockType[]){
        this.tetris.setBlockList(blockList);
        const a = <HTMLInputElement>document.getElementById("start");
        a.disabled = false;
    }


    /**
     * ClientのTetrisを動かす
     */
    public start(){
        this.tetris.newGame();
    }

      /**
     * スコアを通知する
     * @param score
     */
    public notifyScore(score:number){
        let p = document.getElementById("score");
        p.innerHTML = score+"POINT";
    }

    /**
     * サーバにブロックを送る
     * @param block
     */
    public pushBlock(block:Block){
        //serverにブロックを送る
        this.commu.pushBlock(block);
        
    }

    /**
     * 不正な操作のときにたたかれる
     * @param msg
     */
    public Error(msg:string){
        let p = document.getElementById("error");
        p.innerHTML = msg;
        this.tetris.invalidOperation();
    }
    
    

    /**
     * 先に入れていた名前をサーバに送ってスコアを登録する
     */
    public finishGame():void{
        const name:HTMLInputElement = <HTMLInputElement>document.getElementById("name");
        this.commu.finishGame(name.value);
    }

    /**
     * 配列でもらったランキングを表示する
     * @param rankList
     */
    public ranking(rankList){
        const table = <HTMLTableElement>document.getElementById("table");
        for(let i in rankList){
            //tdでランクを表示する
            let r = document.createElement("tr");
            let rank  =document.createElement("td");
            rank.innerHTML = i+1+"";
            let score = document.createElement("td");
            score.innerHTML = rankList[i]["score"]
            let name = document.createElement("td");
            name.innerHTML = rankList[i]["name"];

            r.appendChild(rank);
            r.appendChild(name);
            r.appendChild(score);
            table.appendChild(r);

        }
        
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
                e.preventDefault();
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
                this.tetris.tick(-1,0,0);
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