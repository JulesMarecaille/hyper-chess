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
        allowed_positions: ALLOWED_POS["Queen"]
    },

    "ClassicKing": {
        is_king: true,
        value: 1,
        allowed_positions: ALLOWED_POS["King"]
    },

    "ClassicRook": {
        is_king: false,
        value: 5,
        allowed_positions: ALLOWED_POS["Rook"]
    },

    "ClassicKnight": {
        is_king: false,
        value: 3,
        allowed_positions: ALLOWED_POS["Knight"]
    },

    "ClassicBishop": {
        is_king: false,
        value: 3,
        allowed_positions: ALLOWED_POS["Bishop"]
    },

    "ClassicPawn": {
        is_king: false,
        value: 1,
        allowed_positions: ALLOWED_POS["Pawn"] + ALLOWED_POS["Bishop"]
    }
}
