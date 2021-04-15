import Mission from "./Mission.js"

class Promote10Pawns extends Mission{
    constructor(current_value = 0){
        super(
            "Promote10Pawns",
            "Promote 10 pawns",
            10,
            100,
            ["PromotePawn"],
            current_value
        );
    }
}

export default Promote10Pawns
