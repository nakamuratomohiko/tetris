/**
 * Created by vista on 2016/07/04.
 */

import * as mysql from "mysql";
import {config} from "./config";
import * as fs from "fs";


export class DBStore {
    /**
     * mysqlへの接続する設定が記述されたファイルを読み込む
     */
    private config:config;

    private connection;


    constructor() {
        this.config = JSON.parse(fs.readFileSync("./server/db/config.json").toString());
        this.connection = mysql.createPool(this.config);
    }

    /**
     *  ユーザ登録する　登録ができなかったら
     * @param userName {string}
     * @param score {number}
     * @returns {Promise<void>}
     */
    public scoreInsert(userName:string, score:number):Promise<void> {
        const connection = this.connection;
        const name = mysql.escape(userName);
        return new Promise<void>(function (resolve, reject) {
            connection.getConnection((err, connect) => {
                if (err) {
                    reject('エラーです、管理者に報告してください。');
                }else {
                    connect.query("INSERT INTO score(id,name,score) VALUE (null," + name + ",'" + score + "');", function (err, rows, fields) {
                        if (err){
                            reject('異常発生');

                        }else {

                            if (rows === undefined) {
                                connect.release();
                                reject("データを保存できませんでした");
                            } else {
                                connect.release();
                                resolve();
                            }
                        }
                    });
                }
            });
        });


    }

    /**
     * 名前からUserオブジェクトを取得
     * @returns {Promise <[]>}
     */
    public getRank():Promise<Object[]> {
        const connection = this.connection;

        return new Promise<Object[]>(function (resolve, reject) {

            connection.getConnection((err, connect) => {

                if(err){
                    reject();

                }else {
                    connect.query("SELECT * FROM `score` ORDER BY score DESC LIMIT 20", function (err, rows, fields) {
                        if (err) {
                            reject();

                        } else {

                            if (rows[0] === undefined) {
                                connect.release();
                                reject("ランキング取得できませんでした");
                            } else {
                                const list = [];
                                for (let score in rows) {
                                    list.push(rows[score]);
                                }
                                connect.release();
                                resolve(list);

                            }
                        }

                    });
                }

            });

        });

    }

}