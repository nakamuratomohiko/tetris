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
    //getter setter
    protected abstract setForm();
    public get form():number[][]{return this._form;}
    protected abstract setFulcrum():Point;
    public get fulcrum():Point{return this._fulcrum;}
    public set point(point:Point){this._point = point;}
    public get point():Point{return this._point;}
    public set date(date:Date){this._date = date;}
    public get date():Date{return this._date};
    public set angle(angle:number){this._angle = angle;}
    public get angle():number{return this._angle;}


}