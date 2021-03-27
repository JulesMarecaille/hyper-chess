import ClassicBishop from './ClassicBishop'
import ClassicPawn from './ClassicPawn'
import ClassicRook from './ClassicRook'
import ClassicKnight from './ClassicKnight'
import ClassicKing from './ClassicKing'
import ClassicQueen from './ClassicQueen'

export const PIECE_MAPPING = {
    "ClassicBishop": ClassicBishop,
    "ClassicPawn": ClassicPawn,
    "ClassicRook": ClassicRook,
    "ClassicKnight": ClassicKnight,
    "ClassicKing": ClassicKing,
    "ClassicQueen": ClassicQueen,
}

export const piece_list = ["ClassicBishop", "ClassicPawn", "ClassicRook",
                          "ClassicKnight", "ClassicKing", "ClassicQueen"];
