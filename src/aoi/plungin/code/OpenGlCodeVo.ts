module aoi {
    export class OpenGlCodeVo {
        public priority:number;
        public fun:Function;
        public owner:Object;

        constructor(p:number, owner:Object, fun:Function) {
            this.priority = p;
            this.owner = owner;
            this.fun = fun;
        }

        public getCode():string {
            if (this.fun != null && this.owner != null) {
                return this.fun.call(this.owner);
            }
            return "";
        }
    }
}