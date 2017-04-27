/**
 * Created by vista on 2016/07/01.
 */
/**
 * 図形クラス
 */
import {Point} from "./Point";
import {BlockType} from "./BlockType";

export abstract class Block{
    private _form : Point[][];//図形
    private _point:Point;//支点の位置
    private _date:Date;//着地した時の時間
    private _angle:number;//0:初期,1:右に90度,2:180度,3:左に90度
    private _blockType:BlockType;
    private _color:string;
    /**
     * 現在そのブロックが動いている状態か判別
     * true = stop , false = move
     */
    private _stop : boolean;

    constructor(){
        this._form = this.createForm();
        this._blockType = this.setBlockType();
        this._color = this.createColor();
        this._point = {x:0,y:0};
        this._stop = false;
    }

    /**
     * tetrisで戻したいプロパティを初期値に戻す
     */
    public  reset(){
        this._angle = 0;
        this._stop = false;
    };
    
    /**
     * カラー
     */
    protected abstract createColor():string;

    /**
     * カラーを取得
     */
    public get color():string{return this._color};

    /**
     * BlockTypeをセットする
     */
    protected abstract setBlockType():BlockType;

    /**
     * ブロックtypeを返す
     * @returns {BlockType}
     */
    public get blockType():BlockType{return this._blockType;}
    /**
     * 図形の形をセットする
     */
    protected abstract createForm():Point[][];

    /**
     * 形を取得する
     * @returns {number[][]}
     */
    public get form():Point[][]{return this._form;}



    /**
     * 支点の最終地点をセットする
     * @param point
     */
    public set point(point:Point){this._point = point;}

    /**
     * 支点の最終地点を取得する
     * @returns {Point}
     */
    public get point():Point{return this._point;}

    /**
     * 日付セット
     * @param date{Date}
     */
    public set date(date:Date){this._date = date;}

    /**
     * 日付取得
     * @returns {Date}
     */
    public get date():Date{return this._date};

    /**
     * 回転角度セット
     * @param angle{number}
     */
    public set angle(angle:number){
        this._angle = (this._angle + angle) % 4;
    }

    /**
     * 回転角度取得
     * @returns {number}
     */
    public get angle():number{return this._angle;}

    /**
     * 状態をストップにする
     */
    public set stop(stop : boolean) {
        this._stop = stop;
    }

    /**
     * 状態を取得
     * @returns {boolean}
     */
    public get stop():boolean {return this._stop;}

}