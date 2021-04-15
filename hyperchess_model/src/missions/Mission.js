class Mission{
    constructor(name, label, goal, reward, events_target, current_value){
        this.name = name;
        this.label = label;
        this.goal = goal;
        this.reward = reward;
        this.events_target = events_target;
        this.current_value = current_value;
    }

    isComplete(){
        return this.current_value === this.goal;
    }

    hasEventTarget(evt){
        return this.events_target.includes(evt);
    }
}

export default Mission
