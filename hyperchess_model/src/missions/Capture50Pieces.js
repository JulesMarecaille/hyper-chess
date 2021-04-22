import Mission from "./Mission.js"

class Capture50Pieces extends Mission{
    constructor(current_value = 0){
        super(
            "Capture50Pieces",
            "Capture 50 pieces",
            50,
            100,
            ["CapturePiece"],
            current_value
        );
    }
}

export default Capture50Pieces
