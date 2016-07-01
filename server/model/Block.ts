/**
 * Created by vista on 2016/07/01.
 */
/**
 * 図形クラス
 */
import {Point} from "./Point";

export abstract class Block{
    private _form : number[][];//図形
    private _fulcrum:Point;//支点の位置
    private _point:Point;//最終地点の支点の位置
    private _date:Date;//着地した時の時間
    private _angle:number;//0:初期,1:右に90度,2:180度,3:左に90度

    constructor(){
        this._form = this.setForm();
        this._fulcrum = this.setFulcrum();
    }

    /**
     * 図形の形をセットする
     */
    protected abstract setForm();

    /**
     * 形を取得する
     * @returns {number[][]}
     */
    public get form():number[][]{return this._form;}

    /**
     * 支点をセットする
     */
    protected abstract setFulcrum():Point;

    /**
     * 支点をしゅとくする　
     * @returns {Point}
     */
    public get fulcrum():Point{return this._fulcrum;}

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
    public set angle(angle:number){this._angle = angle;}

    /**
     * 回転角度取得
     * @returns {number}
     */
    public get angle():number{return this._angle;}


}