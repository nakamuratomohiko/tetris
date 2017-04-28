Tetris
====
テトリスクローンのWebアプリです。

TypeScriptでサーバサイド、クライアントサイドをフルスタックに開発、
サーバ内でリアルタイムにブロック検証、スコアを算出する、セキュアなテトリス

moduleは、リアルタイム通信にsoket.ioを使用。
        Node.jsを使用することにより、サーバサイドをJavaScriptで組むことにより、フルスタック.Webアプリになっています。

      
対戦は準備ボタンを押して待ちます、対戦相手が見つかると「相手の得点」->「○○の得点」に変化します。
相手が見つかる前に始めた場合はマッチングはしません。

#Demo
http://kbckj.net:8080
操作方法は十字キー
上:回転
右:右移動
左:左移動
下:下移動
スペースキー:一時停止

## Licence
MIT
