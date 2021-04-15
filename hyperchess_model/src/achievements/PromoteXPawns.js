import Achievement from "./Achievement.js"

class PromoteXPawns extends Achievement{
    constructor(current_value = 0){
        super(
            "PromoteXPawns",
            "Promote %VALUE% pawns",
            [10, 100, 1000, 5000],
            [100, 500, 2500, 10000],
            ["PromotePawn"],
            current_value
        );
    }
}

export default PromoteXPawns
