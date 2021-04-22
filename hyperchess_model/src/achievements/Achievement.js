function getIndexToIns(arr, num) {
  arr.sort(function(a,b) {
    return a-b;
  });
  for (var i=0;i<arr.length;i++) {
    if (arr[i] > num) {
        return i;
    }
    if (i === arr.length - 1) {
        arr.push(num);
        return arr.indexOf(num);
    }
  }
}

class Achievement {
    constructor(name, label, steps, rewards, events_target, current_value){
        this.name = name;
        this.label = label;
        this.steps = steps;
        this.rewards = rewards;
        this.events_target = events_target;
        this.current_value = current_value;
    }

    getCurrentLevel(){
        return getIndexToIns(this.steps, this.current_value);
    }

    getNextStep(){
        if(this.steps[this.getCurrentLevel()]){
            return this.steps[this.getCurrentLevel()];
        }
        return null;
    }

    getNextReward(){
        if(this.rewards[this.getCurrentLevel()]){
            return this.rewards[this.getCurrentLevel()]
        }
        return null;
    }

    getLabel(){
        let value = this.steps[this.steps.length - 1];
        if (this.getNextStep()){
            value = this.getNextStep()
        }
        return this.label.replace("%VALUE%", value)
    }

    hasEventTarget(evt){
        return this.events_target.includes(evt);
    }
}

export default Achievement
