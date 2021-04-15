import Achievement from "./Achievement.js"

class PlayXGames extends Achievement{
    constructor(current_value = 0){
        super(
            "PlayXGames",
            "Play %VALUE% games",
            [10, 100, 1000, 10000],
            [100, 500, 2500, 10000],
            ["PlayGame"],
            current_value
        );
    }
}

export default PlayXGames
