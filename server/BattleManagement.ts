/**
 * 対戦をしているか？、または受け付けているかを管理する
 */
export class BattleManagement {

    /**
     * 対戦相手を管理するMap
     * <自分,相手>のソケットID
     */
    private opponents : Map <string, string>;

    /**
     * 対戦を受け付けているかを管理するMap
     */
    private matchAcceptance : Map <string, boolean>;

    constructor(){
        this.opponents  = new Map<string,string>();
        this.matchAcceptance = new Map<string, boolean>();
    }

    /**
     * 対戦を受け付け登録
     * @param id
     */
    public challenge (id : string) {

        let opponentId : string = "" ;
        //マッチすればtrueになる
        let matchFlag : boolean = false;
        this.matchAcceptance.forEach( (value, key, map) => {

            //まだ受付中のとき
            //なおかつ自分のIDでない時
            if (map.get(key) && id != key) {
                opponentId = key;
                this.opponents.set(id, opponentId);
                this.opponents.set(opponentId, id);
                this.matchAcceptance.set(id, false);
                this.matchAcceptance.set(opponentId, false);
                matchFlag = true;
                return;
            }

        });
        //マッチしていなければ受付登録
        if( !matchFlag ){
            this.matchAcceptance.set(id, true);
        }
    }



    /**
     * 対戦相手のIDを受け取る
     * @param id
     * @returns {undefined|string}
     */
    public getOpponent (id : string) : string | undefined {
        return this.opponents.get(id);
    }

    /**
     * 指定したIDをキーとするキーとバリューを削除
     * @param id
     */
    public unregister (id : string) {
        this.matchAcceptance.delete(id);
        this.opponents.delete(id);
    }

}