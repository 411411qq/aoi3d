module base {
    export class Callback {
        private owner:Object;
        private func:Function;
        private callbackParam:Object

        constructor(owner:Object, func:Function, callbackParam:Object) 
        {
            this.owner = owner;
            this.func = func;
            this.callbackParam = callbackParam;
        }

        exec(param:Object):void 
        {
            this.func.call(this.owner, param, this.callbackParam);
        }

        isSame(owner:Object, func:Function, callbackParam:Object):boolean 
        {
            if (this.owner == owner && this.func == func) 
            {
                return true;
            }
            return false;
        }
    }
}