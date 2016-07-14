/**
 * Created by vista on 2016/07/12.
 */
import * as fs from "fs";
import * as socketio from "socket.io";
import * as express from "express";
import * as http from "http";
import {BlockType} from "../model/BlockType";
import {TetrisServer} from "./TetrisServer";
import {Block} from "../model/Block";

/**
 * 通信担当クラス
 */
export class Communicator {
    private tServer:TetrisServer;
    constructor(ts:TetrisServer) {
        this.tServer = ts;
        let app = express();

        app.get('/', function (req, res) {
                fs.readFile('../../client/core/index.html',
                    function (err, data) {
                        if (err) {
                            res.writeHead(500);
                            return res.end('Error loading index.html');
                        }

                        res.writeHead(200);
                        res.end(data.toString());
                    });

            }
        );

        app.get('/app', function (req, res) {
                fs.readFile('./../../dist/app.js',
                    function (err, data) {
                        if (err) {
                            res.writeHead(500);
                            return res.end('Error loading app.js');
                        }
                        res.writeHead(200, {
                            "Content-Type": "text/javascript"
                        });
                        res.end(data.toString());
                    });

            }
        )
        let server = http.createServer(app);
        let io = socketio.listen(server);

        io.sockets.on('connection', function (client) {
            let tServer = this.tServer;
            client.join(client.id);
            //初めの接続でインスタンス生成
            tServer.connection()
                .then(()=>{

                })
                .catch(()=>{
                    io.sockets.to(client.id).emit('Error',"ページをリロードしてください");
                });

            client.on('disconnect',function(){
               tServer.disconnect();
            });

            /**
             * 準備をする、配列を返す通信
             */
            client.on('ready', function () {
                
                tServer.ready(client.id)
                    .then(list => {
                        io.sockets.to(client.id).emit('ready', list);
                    })
                    .catch(err =>{
                        io.sockets.to(client.id).emit('Error',err);
                    });
                    

            });

            /**
             * ブロックの検証受け付ける
             */
            client.on('verification', function (block:Block) {
                tServer.verid(client.id,block)
                    .then((score)=>{
                        io.sockets.to(client.id).emit('notifyScore',score);
                    })
                    .catch((msg:string)=>{
                       io.sockets.to(client.id).emit('Error',msg);
                    });
            });

            /**
             * ゲームの終了を受け付ける,ランキングを表示する
             */
            client.on('finishGame', function (name) {
                tServer.finishGame(client.id,name)
                    .then(list =>{
                        io.sockets.to(client.id).emit('ranking', [{score: 1000, name: "test"}, {score: 500, name: "asdf"}]);
                    })
                    .catch(err =>{
                        io.sockets.to(client.id).emit('Error', err);

                    });
                
            });


        });
        server.listen(8080);
        console.log("8080:server");
    }

}