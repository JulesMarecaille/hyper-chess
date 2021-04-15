import Mission from "./Mission.js"

class Play10Games extends Mission{
    constructor(current_value = 0){
        super(
            "Play10Games",
            "Play 10 games",
            10,
            100,
            ["PlayGame"],
            current_value
        );
    }
}

export default Play10Games
