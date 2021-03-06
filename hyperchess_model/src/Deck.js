import { SQUARES, WHITE, BLACK } from './constants'

class Deck {
    constructor(name='New Deck', pieces=new Array(16)) {
        this.name = name;
        this.pieces = pieces;
    }

    getPiecesAsWhite(){
        let ret = {}
        ret[SQUARES['a2']] = this.pieces[0]
        ret[SQUARES['b2']] = this.pieces[1]
        ret[SQUARES['c2']] = this.pieces[2]
        ret[SQUARES['d2']] = this.pieces[3]
        ret[SQUARES['e2']] = this.pieces[4]
        ret[SQUARES['f2']] = this.pieces[5]
        ret[SQUARES['g2']] = this.pieces[6]
        ret[SQUARES['h2']] = this.pieces[7]
        ret[SQUARES['a1']] = this.pieces[8]
        ret[SQUARES['b1']] = this.pieces[9]
        ret[SQUARES['c1']] = this.pieces[10]
        ret[SQUARES['d1']] = this.pieces[11]
        ret[SQUARES['e1']] = this.pieces[12]
        ret[SQUARES['f1']] = this.pieces[13]
        ret[SQUARES['g1']] = this.pieces[14]
        ret[SQUARES['h1']] = this.pieces[15]
        return ret
    }

    getPiecesAsBlack(){
        let ret = {}
        ret[SQUARES['a7']] = this.pieces[0]
        ret[SQUARES['b7']] = this.pieces[1]
        ret[SQUARES['c7']] = this.pieces[2]
        ret[SQUARES['d7']] = this.pieces[3]
        ret[SQUARES['e7']] = this.pieces[4]
        ret[SQUARES['f7']] = this.pieces[5]
        ret[SQUARES['g7']] = this.pieces[6]
        ret[SQUARES['h7']] = this.pieces[7]
        ret[SQUARES['a8']] = this.pieces[8]
        ret[SQUARES['b8']] = this.pieces[9]
        ret[SQUARES['c8']] = this.pieces[10]
        ret[SQUARES['d8']] = this.pieces[11]
        ret[SQUARES['e8']] = this.pieces[12]
        ret[SQUARES['f8']] = this.pieces[13]
        ret[SQUARES['g8']] = this.pieces[14]
        ret[SQUARES['h8']] = this.pieces[15]
        return ret
    }

    static buildFromPayload(payload){
        return new Deck(payload.name, payload.pieces)
    }
}

export default Deck
