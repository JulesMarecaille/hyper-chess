import Achievement from "./Achievement.js"

class GiveXCheckmates extends Achievement{
    constructor(current_value = 0){
        super(
            "GiveXCheckmates",
            "Give %VALUE% checkmates",
            [10, 100, 1000, 5000],
            [100, 500, 2500, 10000],
            ["GiveCheckmate"],
            current_value
        );
    }
}

export default GiveXCheckmates
