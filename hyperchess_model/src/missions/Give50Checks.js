import Mission from "./Mission.js"

class Give50Checks extends Mission{
    constructor(current_value = 0){
        super(
            "Give50Checks",
            "Give 50 checks",
            50,
            100,
            ["GiveCheck"],
            current_value
        );
    }
}

export default Give50Checks
