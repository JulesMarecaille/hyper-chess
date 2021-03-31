const ALLOWED_POS = {
    "Pawn" : [0, 1, 2, 3, 4, 5, 6, 7],
    "Rook" : [8, 15],
    "Knight" : [9, 14],
    "Bishop" : [10, 13],
    "Queen" : [11],
    "King" : [12]
}


module.exports = {
    "ClassicQueen": {
        is_king: false,
        value: 9,
        allowed_positions: ALLOWED_POS["Queen"],
        cost: 0
    },

    "ClassicKing": {
        is_king: true,
        value: 1,
        allowed_positions: ALLOWED_POS["King"],
        cost: 0
    },

    "ClassicRook": {
        is_king: false,
        value: 5,
        allowed_positions: ALLOWED_POS["Rook"],
        cost: 0
    },

    "ClassicKnight": {
        is_king: false,
        value: 3,
        allowed_positions: ALLOWED_POS["Knight"],
        cost: 0
    },

    "ClassicBishop": {
        is_king: false,
        value: 3,
        allowed_positions: ALLOWED_POS["Bishop"],
        cost: 0
    },

    "ClassicPawn": {
        is_king: false,
        value: 1,
        allowed_positions: ALLOWED_POS["Pawn"],
        cost: 0
    },

    "Unicorn": {
        is_king: false,
        value: 4,
        allowed_positions: ALLOWED_POS["Knight"],
        cost: 400
    },

    "Phantom": {
        is_king: false,
        value: 2,
        allowed_positions: ALLOWED_POS["Knight"].concat(ALLOWED_POS["Bishop"]).concat(ALLOWED_POS["Rook"]),
        cost:1000
    },

    "Elephant": {
        is_king: false,
        value: 5,
        allowed_positions: ALLOWED_POS["Rook"],
        cost:800
    },

    "Archimage": {
        is_king: false,
        value: 7,
        allowed_positions: ALLOWED_POS["Rook"].concat(ALLOWED_POS["Queen"]),
        cost:200
    },

    "Empress": {
        is_king: false,
        value: 9,
        allowed_positions: ALLOWED_POS["Queen"],
        cost:200
    },

    "Princess": {
        is_king: false,
        value: 7,
        allowed_positions: ALLOWED_POS["Rook"],
        cost:200
    },

    "Fearful": {
        is_king: false,
        value: 2,
        allowed_positions: ALLOWED_POS["Pawn"],
        cost:250
    }
}
