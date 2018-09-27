module math
{
    export class Vector3D {
        public elements:Float32Array;

        constructor(x:number = 0, y:number = 0, z:number = 0, w:number = 1) {
            x = x == null ? 0 : x;
            y = y == null ? 0 : y;
            z = z == null ? 0 : z;
            w = w == null ? 1 : w;
            this.elements = new Float32Array([x, y, z, w]);
        }

        get x():number {
            return this.elements[0];
        }

        set x(val:number) {
            this.elements[0] = val;
        }

        get y():number {
            return this.elements[1];
        }

        set y(val:number) {
            this.elements[1] = val;
        }

        get z():number {
            return this.elements[2];
        }

        set z(val:number) {
            this.elements[2] = val;
        }

        get w():number {
            return this.elements[3];
        };

        set w(val:number) {
            this.elements[3] = val;
        }

        get length():number {
            return Math.sqrt(this.lengthSquared);
        }

        get lengthSquared():number {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        }

        set length(val:number) {
            this.normalize();
            this.scaleBy(val);
        }

        clone():Vector3D {
            return new Vector3D(this.x, this.y, this.z, this.w);
        }

        setTo(x:number, y:number, z:number, w:number = 1):void {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }

        add(v:Vector3D):Vector3D {
            var rs:Vector3D = this.clone();
            rs.x += v.x;
            rs.y += v.y;
            rs.z += v.z;
            return rs;
        }

        public incrementBy(value:Vector3D):void {
            this.x += value.x;
            this.y += value.y;
            this.z += value.z;
        }

        copyFrom(v:Vector3D):void {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
        }

        subtract(v:Vector3D):Vector3D {
            var rs:Vector3D = this.clone();
            rs.x -= v.x;
            rs.y -= v.y;
            rs.z -= v.z;
            return rs;
        }

        normalize():void {
            var t = 1 / this.length;
            this.scaleBy(t);
        }

        scaleBy(t):Vector3D {
            this.x *= t;
            this.y *= t;
            this.z *= t;
            return this;
        }

        toString():string {
            return "(" + this.x + "," + this.y + "," + this.z + "," + this.w + ")";
        }

        static angleBetween(a:Vector3D, b:Vector3D):number {
            var cosA = (a.x * b.x + a.y * b.y + a.z * b.z) / (a.length * b.length);
            return Math.acos(cosA);
        }

        static distance(a:Vector3D, b:Vector3D):number {
            var x = a.x - b.x;
            var y = a.y - b.y;
            var z = a.z - b.z;
            return Math.sqrt(x * x + y * y + z * z);
        };

        static dotProduct(a:Vector3D, b:Vector3D):number {
            return a.x * b.x + a.y * b.y + a.z * b.z;
        }

        static crossProduct(a:Vector3D, b:Vector3D):Vector3D {
            var vec = new Vector3D(0, 0, 0, 1);
            vec.x = a.y * b.z - a.z * b.y;
            vec.y = a.z * b.x - a.x * b.z;
            vec.z = a.x * b.y - a.y * b.x;
            return vec;
        }

        static X_AXIS = new Vector3D(1, 0, 0);
        static Y_AXIS = new Vector3D(0, 1, 0);
        static Z_AXIS = new Vector3D(0, 0, 1);
    }
}