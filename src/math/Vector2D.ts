module math
{
    export class Vector2D {
        public x:number;
        public y:number;

        constructor(x:number = 0, y:number = 0) {
            this.x = x;
            this.y = y;
        }

        public get length():number {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        public set length(value:number) {
            this.normalize();
            this.scaleBy(value);
        }

        public normalize():void {
            var t = 1 / this.length;
            this.scaleBy(t);
        }

        public scaleBy(value:number):void {
            this.x *= value;
            this.y *= value;
        }

        public setTo(x:number, y:number):void {
            this.x = x;
            this.y = y;
        }

        public add(v:Vector2D):Vector2D {
            this.x += v.x;
            this.y += v.y;
            return this;
        }

        public subtract(v:Vector2D):Vector2D {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        }

        public clone():Vector2D {
            return new Vector2D(this.x, this.y);
        }
    }
}