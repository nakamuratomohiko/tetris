/**
 * Created by vista on 2016/07/12.
 */
import * as fs from "fs";
import * as socketio from "socket.io";
import * as express from "express";
import * as http from "http";
import {BlockType} from "../../model/BlockType";
import {Reproduction} from "./Reproduction";
import {TetrisServer} from "./TetrisServer";

/**
 * 通信担当クラス
 */
export class Communicator {
    private tServer:TetrisServer;
    constructor() {
        this.repo = new Reproduction;
        let app = express();

        app.get('/', function (req, res) {
                fs.readFile(/*__dirname +*/ './../index.html',
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
        let tServer = this.tServer;
        io.sockets.on('connection', function (client) {
            client.join(client.id);
            //初めの接続でインスタンス生成
            tServer.connection()
                .then(()=>{

                })
                .catch(()=>{
                    io.sockets.to(client.to).emit('Error',"ページをリロードしてください");
                });

            client.on('disconnect',function(){
               tServer.disconnect();
            });

            client.on('ready', function () {
                
                tServer.ready(client.id)
                    .then(list => {
                        io.sockets.to(client.id).emit('ready', list);
                    })
                    .catch(err =>{
                        io.sockets.to(client.id).emit('Error',"リロードしなおしてください");
                    });
                    

            });

            /**
             * ブロックの検証受け付ける
             */
            client.on('verification', function (block:Block) {
                tServer.verid(id,block)
                    .then((score)=>{
                        io.sockets.to(client.id).emit('notifyScore',score);
                    })
                    .catch((msg:string)=>{
                       io.sockets.to(client.id).emit('Error',msg);
                    });
                io.sockets.to(client.id).emit('verification', msg);
            });

            /**
             * ゲームの終了を受け付ける
             */
            client.on('finishGame', function (name) {
                console.log("name" + name);
                io.sockets.to(client.id).emit('ranking', [{score: 1000, name: "test"}, {score: 500, name: "asdf"}]);


                io.sockets.to(client.id).emit('Error', "test");

            });


        });
        server.listen(8080);
        console.log("8080:server");
    }

}