/**
 * Created by vista on 2016/07/04.
 */

import * as mysql from "mysql";
import Promise = require("any-promise/index");
import {User} from "../model/User";
import {config} from "./config";
import * as fs from "fs";


export class DBStore {
    /**
     * mysqlへの接続する設定が記述されたファイルを読み込む
     */
    private config:config= JSON.parse(fs.readFileSync("./config.json").toString());

    private connection = mysql.createConnection(this.config);

    /**
     *  ユーザ登録する　登録ができなかったら
     * @param userName {string}
     * @param score {number}
     * @returns {Promise<void>}
     */
    public scoreInsert(userName:string):Promise<void> {
        const connection = this.connection;
        return new Promise<void>(function (resolve, reject)  {
            connection.connect();

            connection.query("INSERT INTO score(id,name,score) VALUE (null,'"+userName+"','"+score+"');", function (err, rows, fields) {
                if (err) throw err;
                if(rows === undefined){
                    reject("データを保存できませんでした");
                }else{
                    resolve();
                }

            });

            connection.end();


        });


    }

    /**
     * 名前からUserオブジェクトを取得
     * @returns {Promise <[]>}
     */
    public getRank():Promise<Object[]>{
        const connection = this.connection;

        return new Promise<Object[]>(function (resolve,reject){

            connection.connect();

            connection.query("SELECT * FROM `score` ORDER BY score DESC LIMIT 20", function (err, rows, fields) {
                if (err) throw err;

                if(rows[0] === undefined){
                    reject("ランキング取得できませんでした");
                }else {
                    const list = [];
                    for(let score in rows) {
                       list.push(rows[score]);
                    }
                    resolve(list);

                }
                
            });

            connection.end();

        });

    }

}