import Mission from "./Mission.js"

class Play5Games extends Mission{
    constructor(current_value = 0){
        super(
            "Play5Games",
            "Play 5 games",
            5,
            50,
            ["PlayGame"],
            current_value
        );
    }
}

export default Play5Games
