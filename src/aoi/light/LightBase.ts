module aoi
{
    export class LightBase
    {
        protected _color:number;
        protected _strong:number;
        protected _colorList:math.Vector3D;

        constructor()
        {
            this._colorList = new math.Vector3D();
            this.color = 0xFFFFFF;
            this.strong = 1;
        }

        public set color(val:number)
        {
            this._color = val;
            this._colorList.x = ((val >> 16) & 0xff)/0xff;
            this._colorList.y = ((val >> 8) & 0xff)/0xff;
            this._colorList.z = (val & 0xff)/0xff;
        }
        public get colorData():Float32Array
        {
            return this._colorList.elements;
        }
        public set strong(val:number)
        {
            this._strong = val;
            this._colorList.w = val;
        }
        public get color():number
        {
            return this._color;
        }
        public get strong():number
        {
            return this._strong;
        }
    }
    export class PointLight extends LightBase
    {
        private _dataList:math.Vector3D;
        constructor()
        {
            super();
            this._dataList = new math.Vector3D(0,0,0,1);
        }
        public setPos(x:number, y:number, z:number):void
        {
            this.x = x;
			this.y = y;
			this.z = z;
        }
        public set x(value:number)
		{
			this._dataList.x = value;
		}
		
		public get x():number
		{
			return this._dataList.x;
		}
		
		public set y(value:number)
		{
			this._dataList.y = value;
		}
		
		public get y():number
		{
			return this._dataList.y;
		}
		
		public set z(value:number)
		{
			this._dataList.z = value;
		}
		
		public get z():number
		{
			return this._dataList.z;
		}
		
		public get dataList():Float32Array
		{
			return this._dataList.elements;
		}
        public set radius(value:number)
		{
			this._dataList[3] = value;
		}
		
		public get radius():number
		{
			return this._dataList[3];
		}
    }
    export class DirectionLight extends LightBase
    {
        private _dirVec:math.Vector3D;
        constructor()
        {
            super();
            this._dirVec = new math.Vector3D(0,0,0,1);
        }
        public setDir(x:number, y:number, z:number):void
		{
			this._dirVec.setTo(x, y, z);
			this._dirVec.normalize();
			this._dirVec.w = 1;
		}
		
		public get dataList():Float32Array
		{
			return this._dirVec.elements;
		}
    }
}