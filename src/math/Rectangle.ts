module math
{
    export class Rectangle
    {
        private _x:number;
        private _y:number;
        private _width:number;
        private _height:number;
        constructor(x:number = 0, y:number = 0, width:number = 0, height:number = 0)
        {
            this._x = x;
            this._y = y;
            this._width = width;
            this._height = height;
        }
        public set x(value:number)
        {
            this._x = value;
        }
        public get x():number
        {
            return this._x;
        }
        public set y(value:number)
        {
            this._y = value;
        }
        public get y():number
        {
            return this._y;
        }
        public set width(value:number)
        {
            this._width = value;
        }
        public get width():number
        {
            return this._width;
        }
        public set height(value:number)
        {
            this._height = value;
        }
        public get height():number
        {
            return this._height;
        }
        public containPoint(point:Vector2D):boolean
        {
            return this.containPoint2(point.x, point.y);
        }
        public containPoint2(px:number, py:number):boolean
        {
            return px >= this._x
                && px <= this._x + this._width
                && py >= this._y
                && py <= this._y + this._height;
        }
        public intersects(rect:Rectangle):boolean
        {
            return this.x < rect.x + rect.width
                && rect.x < this.x + this.width
                && this.y < rect.y + rect.height
                && rect.y < this.y + this.height;
        }
        public intersectRectangle(rect:Rectangle):Rectangle
        {
            var rec:Rectangle = new Rectangle();
            var x1:number = Math.max(this.x, rect.x);
            var x2:number = Math.min(this.x + this.width, rect.x + rect.width);
            var y1:number = Math.max(this.y, rect.y);
            var y2:number = Math.min(this.y + this.height, rect.y + rect.height);
            if (x2 >= x1 && y2 >= y1)
            {
                rec.x = x1;
                rec.y = y1;
                rec.width = x2 - x1;
                rec.height = y2 - y1;
            }
            return rec;
        }
    }
}