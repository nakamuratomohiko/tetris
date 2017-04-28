/**
 * Created by vista on 2016/07/12.
 */
import * as fs from "fs";
import * as socketio from "socket.io";
import * as express from "express";
import * as http from "http";
import {TetrisServer} from "./TetrisServer";
import {ReceiveBlock} from "../../model/ReceiveBlock";

/**
 * 通信担当クラス
 */
export class Communicator {
    private tServer:TetrisServer;
    constructor(ts:TetrisServer) {
        this.tServer = ts;
        let app = express();

        app.get('/', function (req, res) {
                fs.readFile('./client/core/index.html',
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

        app.get('/app.js', function (req, res) {
                fs.readFile('./client/dist/app.js',
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
        );
        let server = http.createServer(app);
        let io = socketio.listen(server);
        let tServer:TetrisServer = this.tServer;

        io.sockets.on('connection', function (client) {
            client.join(client.id);
            //初めの接続でインスタンス生成
            tServer.connection(client.id)
                .then(()=>{
                })
                .catch(()=>{
                    io.sockets.to(client.id).emit('Error',"ページをリロードしてください");
                });

            client.on('disconnect',function(){
               tServer.disconnect(client.id);
            });

            /**
             * 準備をする、配列を返す通信
             */
            client.on('ready', function (name : string) {
                
                tServer.ready(client.id, name)
                    .then(map => {
                        io.sockets.to(client.id).emit('ready', map.get('list'));
                        if (map.get('opponentId')) {
                            io.sockets.to(map.get('opponentId')).emit('rivalName', map.get('myName'));
                            io.sockets.to(client.id).emit(('rivalName'), map.get('opponentName'));
                        }
                    })
                    .catch(err =>{
                        io.sockets.to(client.id).emit('Error',err);
                    });
                    

            });

            /**
             * ブロックの検証受け付ける
             */
            client.on('verification', function (block:ReceiveBlock) {
                tServer.verid(client.id,block,)
                    .then((map) =>{
                        const score = map.get('score');

                        io.sockets.to(client.id).emit('notifyScore',score);
                        if(map.get('opponentId')) {
                            const opponentId = map.get('opponentId');
                            io.sockets.to(opponentId).emit('rivalBlock', block);
                            io.sockets.to(opponentId).emit('rivalScore', score);
                        }
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
                        io.sockets.to(client.id).emit('ranking', list);
                    })
                    .catch(err =>{
                        console.log(err);
                        io.sockets.to(client.id).emit('Error', err);

                    });
                
            });

            /**
             * ゲームをスタートした事をTetrisServerに伝える
             */
            client.on('clientStart', () => {
                this.tServer.start(client.id);
            });


        });
        server.listen(8080);
        console.log("8080:server");
    }

}