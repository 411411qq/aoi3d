module base {
    export class Color {
        private _data:math.Vector3D;

        constructor(r:number, g:number, b:number, a:number) {
            this._data = new math.Vector3D();
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        public set r(val:number)
        {
            this._data.x = math.MathUtil.clamp(val, 0, 1);
        }
        public get r():number
        {
            return this._data.x;
        }
        public set g(val:number)
        {
            this._data.y = math.MathUtil.clamp(val, 0, 1);
        }
        public get g():number
        {
            return this._data.y;
        }
        public set b(val:number)
        {
            this._data.z = math.MathUtil.clamp(val, 0, 1);
        }
        public get b():number
        {
            return this._data.z;
        }
        public set a(val:number)
        {
            this._data.w = math.MathUtil.clamp(val, 0, 1);
        }
        public get a():number
        {
            return this._data.w;
        }
        public setColor(color:number, alpha:number):void
        {
            this.a = alpha;
            this.r = ((color >> 16) & 0xff)/0xff;
			this.g = ((color >> 8) & 0xff)/0xff;
			this.b = (color & 0xff)/0xff;
        }
        public get elements():Float32Array
        {
            return this._data.elements;
        }
    }
}