module math
{
    export class Quaternion {
        public x:number;
        public y:number;
        public z:number;
        public w:number;

        constructor(x:number = 0, y:number = 0, z:number = 0, w:number = 0) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }

        get magnitudeSq():number {
            return this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z;
        }

        get magnitude():number {
            return Math.sqrt(this.magnitudeSq);
        }

        toEulerAngles(target:Vector3D = null):Vector3D {
            if (target == null || target == undefined) target = new Vector3D();
            target.x = Math.atan2(2 * (this.w * this.x + this.y * this.z), 1 - 2 * (this.x * this.x + this.y * this.y));
            target.y = Math.asin(2 * (this.w * this.y - this.z * this.x));
            target.z = Math.atan2(2 * (this.w * this.z + this.x * this.y), 1 - 2 * (this.y * this.y + this.z * this.z));
            return target;
        }

        toVector3d(target:Vector3D = null):Vector3D {
            if (target == null || target == undefined) target = new Vector3D();
            target.x = this.x;
            target.y = this.y;
            target.z = this.z;
            target.w = this.w;
            return target;
        }

        toAxisAngles(target:Vector3D = null):Vector3D {
            if (target == null || target == undefined) target = new Vector3D();
            var sc = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
            if (sc == 0) {
                target.x = 0;
                target.y = 0;
                target.z = 0;
            }
            else {
                target.x = this.x / sc;
                target.y = this.y / sc;
                target.z = this.z / sc;
            }
            target.w = Math.acos(this.w) * 2.0;
            return target;
        }

        multiplyVector(vec:Vector3D, target:Vector3D):Vector3D {
            if (target == null || target == undefined) target = new Vector3D();
            var x2 = vec.x;
            var y2 = vec.y;
            var z2 = vec.z;
            target.w = -this.x * x2 - this.y * y2 - this.z * z2;
            target.x = this.w * x2 + this.y * z2 - this.z * y2;
            target.y = this.w * y2 - this.x * z2 + this.z * x2;
            target.z = this.w * z2 + this.x * y2 - this.y * x2;
            return target;
        }

        fromAxisAngle(axis:Vector3D, angle:number):void {
            var sin_a = Math.sin(angle / 2);
            var cos_a = Math.cos(angle / 2);
            this.x = axis.x * sin_a;
            this.y = axis.y * sin_a;
            this.z = axis.z * sin_a;
            this.w = cos_a;
            this.normalize();
        }

        normalize():void {
            var mag = 1 / this.magnitude;
            this.x *= mag;
            this.y *= mag;
            this.z *= mag;
            this.w *= mag;
        }

        slerp(qa:Quaternion, qb:Quaternion, t:number):void {
            var w1 = qa.w, x1 = qa.x, y1 = qa.y, z1 = qa.z;
            var w2 = qb.w, x2 = qb.x, y2 = qb.y, z2 = qb.z;
            var dot = w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2;
            if (dot < 0) {
                dot = -dot;
                w2 = -w2;
                x2 = -x2;
                y2 = -y2;
                z2 = -z2;
            }
            if (dot < 0.95) {
                var angle = Math.acos(dot);
                var s = 1 / Math.sin(angle);
                var s1 = Math.sin(angle * (1 - t)) * s;
                var s2 = Math.sin(angle * t) * s;
                this.w = w1 * s1 + w2 * s2;
                this.x = x1 * s1 + x2 * s2;
                this.y = y1 * s1 + y2 * s2;
                this.z = z1 * s1 + z2 * s2;
            }
            else {
                this.w = w1 + t * (w2 - w1);
                this.x = x1 + t * (x2 - x1);
                this.y = y1 + t * (y2 - y1);
                this.z = z1 + t * (z2 - z1);
                this.normalize();
            }
        }

        lerp(qa, qb, t):void {
            var w1 = qa.w, x1 = qa.x, y1 = qa.y, z1 = qa.z;
            var w2 = qb.w, x2 = qb.x, y2 = qb.y, z2 = qb.z;
            var len;
            if (w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2 < 0) {
                w2 = -w2;
                x2 = -x2;
                y2 = -y2;
                z2 = -z2;
            }
            this.w = w1 + t * (w2 - w1);
            this.x = x1 + t * (x2 - x1);
            this.y = y1 + t * (y2 - y1);
            this.z = z1 + t * (z2 - z1);
            this.normalize();
        }

        fromEulerAngles(ax:number, ay:number, az:number):void {
            var halfX = ax * .5, halfY = ay * .5, halfZ = az * .5;
            var cosX = Math.cos(halfX), sinX = Math.sin(halfX);
            var cosY = Math.cos(halfY), sinY = Math.sin(halfY);
            var cosZ = Math.cos(halfZ), sinZ = Math.sin(halfZ);

            this.w = cosX * cosY * cosZ + sinX * sinY * sinZ;
            this.x = sinX * cosY * cosZ - cosX * sinY * sinZ;
            this.y = cosX * sinY * cosZ + sinX * cosY * sinZ;
            this.z = cosX * cosY * sinZ - sinX * sinY * cosZ;
        }

        toMatrix(target:Matrix4 = null):Matrix4 {
            if (target == null || target == undefined)target = new Matrix4();
            var rawData = target.elements;
            var xy2 = 2.0 * this.x * this.y, xz2 = 2.0 * this.x * this.z, xw2 = 2.0 * this.x * this.w;
            var yz2 = 2.0 * this.y * this.z, yw2 = 2.0 * this.y * this.w, zw2 = 2.0 * this.z * this.w;
            var xx = this.x * this.x, yy = this.y * this.y, zz = this.z * this.z, ww = this.w * this.w;
            rawData[0] = xx - yy - zz + ww;
            rawData[4] = xy2 - zw2;
            rawData[8] = xz2 + yw2;
            rawData[12] = 0;
            rawData[1] = xy2 + zw2;
            rawData[5] = -xx + yy - zz + ww;
            rawData[9] = yz2 - xw2;
            rawData[13] = 0;
            rawData[2] = xz2 - yw2;
            rawData[6] = yz2 + xw2;
            rawData[10] = -xx - yy + zz + ww;
            rawData[14] = 0;
            rawData[3] = 0.0;
            rawData[7] = 0.0;
            rawData[11] = 0;
            rawData[15] = 1;
            return target;
        }

        rotatePoint(vector:Vector3D, target:Vector3D):Vector3D {
            if (target == null || target == undefined)target = new Vector3D();
            var x1, y1, z1, w1;
            var x2 = vector.x, y2 = vector.y, z2 = vector.z;
            w1 = -this.x * x2 - this.y * y2 - this.z * z2;
            x1 = this.w * x2 + this.y * z2 - this.z * y2;
            y1 = this.w * y2 - this.x * z2 + this.z * x2;
            z1 = this.w * z2 + this.x * y2 - this.y * x2;
            target.x = -w1 * this.x + x1 * this.w - y1 * this.z + z1 * this.y;
            target.y = -w1 * this.y + x1 * this.z + y1 * this.w - z1 * this.x;
            target.z = -w1 * this.z - x1 * this.y + y1 * this.x + z1 * this.w;
            return target;
        }

        toString():string {
            return "(" + this.x + "," + this.y + "," + this.z + "," + this.w + ")";
        }

        multiply(qa:Quaternion, qb:Quaternion):Quaternion {
            var rs = new Quaternion();
            var w1 = qa.w, x1 = qa.x, y1 = qa.y, z1 = qa.z;
            var w2 = qb.w, x2 = qb.x, y2 = qb.y, z2 = qb.z;

            rs.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
            rs.x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
            rs.y = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
            rs.z = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;
            return rs;
        }
    }
}