import {Communicator} from "./Communicator";
import {Tetris} from "./Tetris";
import {BlockType} from "../../model/BlockType";
import {Block} from "../../model/Block";
import {ReceiveBlock} from "../../model/ReceiveBlock";
/**
 * Created by vista on 2016/07/07.
 */

export class TetrisController{

    private commu:Communicator;
    private myTetris:Tetris;
    private rivalTetris: Tetris;

    constructor(){
        this.commu = new Communicator(this);
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

        if( this.myTetris) this.myTetris.invalidOperation();
        if( this.rivalTetris ) this.rivalTetris.invalidOperation();

        //初期化する
        const s = <HTMLInputElement>document.getElementById("score");
        s.innerHTML = "";
        const e = <HTMLInputElement>document.getElementById("error");

        const a = <HTMLInputElement>document.getElementById("start");
        const name:HTMLInputElement = <HTMLInputElement>document.getElementById("name");
        a.disabled = true;
        if(name.value  != ""){
            e.innerHTML = "";
            this.myTetris = new Tetris(this);
            this.rivalTetris = new Tetris();
            this.commu.ready(name.value);
        }else{
            e.innerHTML = "名前は先にいれてください";

        }

    }

    /**
     * BlockType[]をTetrisクラスにセットする
     * @param blockList
     */
    public setBlockList(blockList:BlockType[]){
        this.myTetris.setBlockList(blockList);
        const a = <HTMLInputElement>document.getElementById("start");
        a.disabled = false;
    }


    /**
     * ClientのTetrisを動かす
     */
    public start(){
        const a = <HTMLInputElement>document.getElementById("start");
        a.disabled = true;
        this.myTetris.newGame();
    }

      /**
     * スコアを通知する
     * @param score
     */
    public notifyScore(score:number){
        let p = document.getElementById("score");
        p.innerHTML = score+"POINT";
    }

    public rivalScore(score: number) {
        const rivalScore = document.getElementById('rivalScore');
        rivalScore.innerText = score+"POINT";
    }

    /**
     * サーバにブロックを送る
     * @param block
     */
    public pushBlock(block:Block){
        //serverにブロックを送る
        this.commu.pushBlock(block.toReceiveBlock());
        
    }

    /**
     * サーバから受け取った対戦相手のブロック情報
     * @param block {Block}
     */
    public receiveBlock (rivalBlock : ReceiveBlock ) {
        this.rivalTetris.rivalView(rivalBlock);
    }

    /**
     * 不正な操作のときにたたかれる
     * @param msg
     */
    public Error(msg:string){
        let p = document.getElementById("error");
        p.innerHTML = msg;
        this.myTetris.invalidOperation();
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
        if(this.myTetris.pause()) {
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
            if(!this.myTetris.lose) {
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
                this.myTetris.tick(-1,0,0);
                break;

            case 'rotate':
                this.myTetris.tick(0,0,1);
                break;
            case 'right':
                this.myTetris.tick(1,0,0);
                break;
            case 'down':
                this.myTetris.tick(0,1);
                break;
            case 'space':
                this.pause();
                break;
        }
    }


}