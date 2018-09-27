module base 
{
    export class ActionState 
    {
        private value:number = 0;
        constructor(val:number = 0) {
            this.value = val;
        }
        public getState(state:number):boolean
        {
            let temp:number = 1 << state;
            return (this.value & temp) > 0;
        }
        public setState(state:number, svalue:boolean):void
        {
            let cur:boolean = this.getState(state);
            if (cur != svalue)
            {
                let temp:number = 1 << state;
                if (svalue == true)
                {
                    this.value += temp;
                }
                else
                {
                    this.value -= temp;
                }
            }
        }
        public reset(val:number = 0):void
        {
            this.value = val;
        }
    }
}