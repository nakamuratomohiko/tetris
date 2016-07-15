/**
 * Created by vista on 2016/07/01.
 */


export class User{

    /**
     * 名前
     */
    private _name:string;
    /**
     * 最高点
     * @type {number}
     * @private
     */
    private _score:number = 0;

    /**
     * getter Name
     * @returns {string}
     */
    public get name():string{
        return this._name;
    }

    /**
     * name setter
     * @param name {string}
     */
    public set name(name:string){
        this._name = name;
    }

    /**
     * getter maxScore
     * @returns {number}
     */
    public get score():number{
        return this._score;
    }

    /**
     * setter maxScore
     * @param maxScore{number}
     */
    public set score(maxScore:number){
        this._score = maxScore;
    }

}