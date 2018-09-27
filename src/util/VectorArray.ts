module base {
    export class VectorArray {
        public data:Float32Array|Uint16Array;
        private pos:number;

        constructor(type:number, len:number) {
            if (type == 1) {
                this.data = new Float32Array(len);
            }
            else if (type == 2) {
                this.data = new Uint16Array(len);
            }
            this.pos = 0;
        }
        public clear():void
        {
            this.pos = 0;
        }
        public push(...arg):void {
            var arr = arguments;
            var len = arr.length, i = 0;
            for (i = 0; i < len; i++) {
                this.data[this.pos++] = arr[i];
            }
        }
    }
}