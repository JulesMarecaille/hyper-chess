import Achievement from "./Achievement.js"

class CaptureXPieces extends Achievement{
    constructor(current_value = 0){
        super(
            "CaptureXPieces",
            "Capture %VALUE% pieces",
            [100, 1000, 5000, 10000],
            [100, 500, 2500, 10000],
            ["CapturePiece"],
            current_value
        );
    }
}

export default CaptureXPieces
