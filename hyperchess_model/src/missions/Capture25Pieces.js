import Mission from "./Mission.js"

class Capture25Pieces extends Mission{
    constructor(current_value = 0){
        super(
            "Capture25Pieces",
            "Capture 25 pieces",
            25,
            50,
            ["CapturePiece"],
            current_value
        );
    }
}

export default Capture25Pieces
