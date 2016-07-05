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
     * @param password {string}
     * @returns {Promise} resolve成功:true　reject失敗:false
     */
    public insert(userName:string,password:string) {
        const connection = this.connection;
        return new Promise(function (resolve, reject)  {
            connection.connect();

            connection.query("INSERT INTO user(id,name,pass) VALUE (null,'"+userName+"','"+password+"');", function (err, rows, fields) {
                if (err) throw err;
                if(rows === undefined){
                    reject(false);
                }else{
                    resolve(true);
                }

            });

            connection.end();


        });


    }

    /**
     * 最高scoreの更新 
     * @param user
     * @returns {Promise} 
     */
    public update(user:User){
        const connection = this.connection;

        return new Promise(function (resolve,reject){
            connection.connect();

            connection.query("UPDATE rank, user SET rank.score = "+user.maxScore+" WHERE user.name = '"+ user.name +"' AND score < "+user.maxScore+" AND user.id = rank.id", function (err, rows, fields) {
                if (err) throw err;

                console.log('The solution is: ', rows);
                if(rows.changedRows == 0){
                    reject(false);
                }else{
                    resolve(true);
                }


            });

            connection.end();

        });


    }

    /**
     * 名前からUserオブジェクトを取得
     * @param userName
     * @returns {Promise}　成功:Userクラス
     */
    public getUser(userName:string){
        const connection = this.connection;

        return new Promise(function (resolve,reject){

            connection.connect();

            connection.query("SELECT u.name as name ,r.score as score FROM user u,rank r WHERE name = '"+userName+"' AND u.id = r.id", function (err, rows, fields) {
                if (err) throw err;

                console.log('The solution is: ', rows[0]);
                if(rows[0] === undefined){
                    reject();
                }else {
                    const user = new User();
                    user.name = userName;
                    user.maxScore = rows[0].score;
                    resolve(user);
                }
                
            });

            connection.end();

        });

    }

}