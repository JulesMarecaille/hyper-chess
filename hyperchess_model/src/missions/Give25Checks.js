import Mission from "./Mission.js"

class Give25Checks extends Mission{
    constructor(current_value = 0){
        super(
            "Give25Checks",
            "Give 25 checks",
            25,
            50,
            ["GiveCheck"],
            current_value
        );
    }
}

export default Give25Checks
