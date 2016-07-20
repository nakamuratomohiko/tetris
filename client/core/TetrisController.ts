import {Communicator} from "./Communicator";
import {Tetris} from "./Tetris";
import {BlockType} from "../../model/BlockType";
import {Block} from "../../model/Block";
/**
 * Created by vista on 2016/07/07.
 */

export class TetrisController{

    private commu:Communicator;
    private tetris:Tetris;

    constructor(){
        this.commu = new Communicator(this);
        this.tetris = new Tetris(this);
        document.body.onkeydown = (e)=>this.onKeyDown(e);
        this.ready();
        document.getElementById("refresh").onclick = ()=> this.ready();
        document.getElementById("start").onclick = ()=>this.start();
        const e = <HTMLInputElement>document.getElementById("error");
        e.innerHTML = "名前は先にいれてください";


    }

    /**
     * ClientのTetrisのセット
     */
    public ready(){
        //初期化する
        const s = <HTMLInputElement>document.getElementById("score");
        s.innerHTML = "";
        const e = <HTMLInputElement>document.getElementById("error");

        const a = <HTMLInputElement>document.getElementById("start");
        const name:HTMLInputElement = <HTMLInputElement>document.getElementById("name");
        a.disabled = true;
        if(name.value  != ""){
            e.innerHTML = "";
            this.commu.ready();
        }else{
            e.innerHTML = "名前は先にいれてください";

        }

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
        const a = <HTMLInputElement>document.getElementById("start");
        a.disabled = true;
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
        const s =  table.rows.length;
        for( let l = 1;l < s; l++){
            table.deleteRow(1);
        }
        let ranking = 0;
        for(let i in rankList){
            ranking += 1;
            //tdでランクを表示する
            let r = document.createElement("tr");
            let rank  =document.createElement("td");
            rank.innerHTML = ranking+"";
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
     * 一時停止を知らせるためエラーの中に表示する
     */
    public pause(){
        const p = document.getElementById("error");
        const name = <HTMLInputElement>document.getElementById("name");
        if(this.tetris.pause()) {
            p.innerHTML = "pause";
        }else{
            if(name.value == ""){
                p.innerHTML = "名前は先にいれてください";
            }else{
                p.innerHTML = "";


            }
            
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
            38: 'rotate',
            32: 'space'
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
            case 'space':
                this.pause();
                break;
        }
    }


}