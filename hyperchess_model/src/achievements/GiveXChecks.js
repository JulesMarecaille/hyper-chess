import Achievement from "./Achievement.js"

class GiveXChecks extends Achievement{
    constructor(current_value = 0){
        super(
            "GiveXChecks",
            "Give %VALUE% checks",
            [50, 500, 5000, 10000],
            [100, 500, 2500, 10000],
            ["GiveCheck"],
            current_value
        );
    }
}

export default GiveXChecks
