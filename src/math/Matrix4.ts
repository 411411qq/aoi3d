module math
{
    export class Matrix4 {
        public elements:Float32Array;

        constructor(n11:number = 1, n12:number = 0, n13:number = 0, n14:number = 0,
                    n21:number = 0, n22:number = 1, n23:number = 0, n24:number = 0,
                    n31:number = 0, n32:number = 0, n33:number = 1, n34:number = 0,
                    n41:number = 0, n42:number = 0, n43:number = 0, n44:number = 1) {
            this.elements = new Float32Array(16);
            this.reset(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44);
        }

        reset(n11, n12, n13, n14,
              n21, n22, n23, n24,
              n31, n32, n33, n34,
              n41, n42, n43, n44):void {
            var te = this.elements;
            te[0] = (n11 !== undefined) ? n11 : 1;
            te[1] = n12 || 0;
            te[2] = n13 || 0;
            te[3] = n14 || 0;
            te[4] = n21 || 0;
            te[5] = (n22 !== undefined) ? n22 : 1;
            te[6] = n23 || 0;
            te[7] = n24 || 0;
            te[8] = n31 || 0;
            te[9] = n32 || 0;
            te[10] = (n33 !== undefined) ? n33 : 1;
            te[11] = n34 || 0;
            te[12] = n41 || 0;
            te[13] = n42 || 0;
            te[14] = n43 || 0;
            te[15] = (n44 !== undefined) ? n44 : 1;
        }

        public copyRawDataTo(target:Float32Array):void {
            var te = this.elements;
            var i = 0;
            for (i = 0; i < 16; i++) {
                target[i] = te[i];
            }
        }

        identity():void {
            this.reset(1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1);
        }

        clone():Matrix4 {
            var te = this.elements;
            return new Matrix4(te[0], te[1], te[2], te[3],
                te[4], te[5], te[6], te[7],
                te[8], te[9], te[10], te[11],
                te[12], te[13], te[14], te[15]);
        }

        setInverseOf(other):Matrix4 {
            var i, s, d, inv, det;
            var te:Float32Array = this.elements;
            var me:Float32Array = other.elements;

            var n11:number = me[0], n12:number = me[4], n13:number = me[8], n14:number = me[12];
            var n21:number = me[1], n22:number = me[5], n23:number = me[9], n24:number = me[13];
            var n31:number = me[2], n32:number = me[6], n33:number = me[10], n34:number = me[14];
            var n41:number = me[3], n42:number = me[7], n43:number = me[11], n44:number = me[15];

            te[0] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
            te[4] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
            te[8] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
            te[12] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
            te[1] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
            te[5] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
            te[9] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
            te[13] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
            te[2] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
            te[6] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
            te[10] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
            te[14] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
            te[3] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
            te[7] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
            te[11] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
            te[15] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

            var det:any = n11 * te[0] + n21 * te[4] + n31 * te[8] + n41 * te[12];
            if (det === 0) {
                return this;
            }
            det = 1 / det;
            this.multiplyScalar(det);
            return this;
        }

        multiplyScalar(s:number):Matrix4 {
            var te = this.elements;
            te[0] *= s;
            te[4] *= s;
            te[8] *= s;
            te[12] *= s;
            te[1] *= s;
            te[5] *= s;
            te[9] *= s;
            te[13] *= s;
            te[2] *= s;
            te[6] *= s;
            te[10] *= s;
            te[14] *= s;
            te[3] *= s;
            te[7] *= s;
            te[11] *= s;
            te[15] *= s;
            return this;
        }

        invert():Matrix4 {
            return this.setInverseOf(this);
        }

        appendScale(x:number, y:number, z:number):Matrix4 {
            var e = this.elements;
            e[0] *= x;
            e[4] *= y;
            e[8] *= z;
            e[1] *= x;
            e[5] *= y;
            e[9] *= z;
            e[2] *= x;
            e[6] *= y;
            e[10] *= z;
            e[3] *= x;
            e[7] *= y;
            e[11] *= z;
            e[12] *= x;
            e[13] *= y;
            e[14] *= z;
            return this;
        }

        appendTranslation(x:number, y:number, z:number):Matrix4 {
            var e = this.elements;
            e[12] += x;
            e[13] += y;
            e[14] += z;
            e[15] = 1;
            return this;
        }

        setRotate(angle:number, x:number, y:number, z:number):Matrix4 {
            var e, s, c, len, rlen, nc, xy, yz, zx, xs, ys, zs;
            e = this.elements;
            angle = Math.PI * angle / 180;
            s = Math.sin(angle);
            c = Math.cos(angle);

            if (0 !== x && 0 === y && 0 === z) {
                if (x < 0) {
                    s = -s;
                }
                e[0] = 1;
                e[4] = 0;
                e[8] = 0;
                e[12] = 0;
                e[1] = 0;
                e[5] = c;
                e[9] = -s;
                e[13] = 0;
                e[2] = 0;
                e[6] = s;
                e[10] = c;
                e[14] = 0;
                e[3] = 0;
                e[7] = 0;
                e[11] = 0;
                e[15] = 1;
            } else if (0 === x && 0 !== y && 0 === z) {
                if (y < 0) {
                    s = -s;
                }
                e[0] = c;
                e[4] = 0;
                e[8] = s;
                e[12] = 0;
                e[1] = 0;
                e[5] = 1;
                e[9] = 0;
                e[13] = 0;
                e[2] = -s;
                e[6] = 0;
                e[10] = c;
                e[14] = 0;
                e[3] = 0;
                e[7] = 0;
                e[11] = 0;
                e[15] = 1;
            } else if (0 === x && 0 === y && 0 !== z) {
                if (z < 0) {
                    s = -s;
                }
                e[0] = c;
                e[4] = -s;
                e[8] = 0;
                e[12] = 0;
                e[1] = s;
                e[5] = c;
                e[9] = 0;
                e[13] = 0;
                e[2] = 0;
                e[6] = 0;
                e[10] = 1;
                e[14] = 0;
                e[3] = 0;
                e[7] = 0;
                e[11] = 0;
                e[15] = 1;
            } else {
                len = Math.sqrt(x * x + y * y + z * z);
                if (len !== 1) {
                    if (len == 0) {
                        rlen = 500000;
                    }
                    else {
                        rlen = 1 / len;
                    }
                    x *= rlen;
                    y *= rlen;
                    z *= rlen;
                }
                nc = 1 - c;
                xy = x * y;
                yz = y * z;
                zx = z * x;
                xs = x * s;
                ys = y * s;
                zs = z * s;

                e[0] = x * x * nc + c;
                e[1] = xy * nc + zs;
                e[2] = zx * nc - ys;
                e[3] = 0;

                e[4] = xy * nc - zs;
                e[5] = y * y * nc + c;
                e[6] = yz * nc + xs;
                e[7] = 0;

                e[8] = zx * nc + ys;
                e[9] = yz * nc - xs;
                e[10] = z * z * nc + c;
                e[11] = 0;

                e[12] = 0;
                e[13] = 0;
                e[14] = 0;
                e[15] = 1;
            }
            return this;
        }

        copyFrom(target):void {
            var te = this.elements;
            var i = 0;
            for (i = 0; i < 16; i++) {
                te[i] = target.elements[i];
            }
        }

        public copyRawDataFrom(target:Float32Array):void {
            var te = this.elements;
            var i = 0;
            for (i = 0; i < 16; i++) {
                te[i] = target[i];
            }
        }

        appendRotation(angle:number, x:number, y:number, z:number):void {
            this.append(new Matrix4().setRotate(angle, x, y, z));
        }

        append(other):void {
            this.elements = Matrix4.append(this, other);
        }

        prepend(other):void {
            this.elements = Matrix4.append(other, this);
        }

        transformVector(pos:Vector3D):Vector3D {
            var e:Float32Array = this.elements;
            var p:Float32Array = pos.elements;
            var v:Vector3D = new Vector3D();
            var result:Float32Array = v.elements;
            result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8] + p[3] * e[12];
            result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9] + p[3] * e[13];
            result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + p[3] * e[14];
            result[3] = p[0] * e[3] + p[1] * e[7] + p[2] * e[11] + p[3] * e[15];
            return v;
        }

        deltaTransformVector(pos):Vector3D {
            var e = this.elements;
            var p = pos.elements;
            var v:Vector3D = new Vector3D();
            var result = v.elements;
            result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8];
            result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9];
            result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10];
            result[3] = p[0] * e[3] + p[1] * e[7] + p[2] * e[11] + p[3] * e[15];
            return v;
        }

        static append(a:Matrix4, b:Matrix4):Float32Array {
            var ae, be;
            ae = a.elements;
            be = b.elements;
            var rsEle = new Float32Array(16);
            rsEle[0] = ae[0] * be[0] + ae[1] * be[4] + ae[2] * be[8] + ae[3] * be[12];
            rsEle[1] = ae[0] * be[1] + ae[1] * be[5] + ae[2] * be[9] + ae[3] * be[13];
            rsEle[2] = ae[0] * be[2] + ae[1] * be[6] + ae[2] * be[10] + ae[3] * be[14];
            rsEle[3] = ae[0] * be[3] + ae[1] * be[7] + ae[2] * be[11] + ae[3] * be[15];

            rsEle[4] = ae[4] * be[0] + ae[5] * be[4] + ae[6] * be[8] + ae[7] * be[12];
            rsEle[5] = ae[4] * be[1] + ae[5] * be[5] + ae[6] * be[9] + ae[7] * be[13];
            rsEle[6] = ae[4] * be[2] + ae[5] * be[6] + ae[6] * be[10] + ae[7] * be[14];
            rsEle[7] = ae[4] * be[3] + ae[5] * be[7] + ae[6] * be[11] + ae[7] * be[15];

            rsEle[8] = ae[8] * be[0] + ae[9] * be[4] + ae[10] * be[8] + ae[11] * be[12];
            rsEle[9] = ae[8] * be[1] + ae[9] * be[5] + ae[10] * be[9] + ae[11] * be[13];
            rsEle[10] = ae[8] * be[2] + ae[9] * be[6] + ae[10] * be[10] + ae[11] * be[14];
            rsEle[11] = ae[8] * be[3] + ae[9] * be[7] + ae[10] * be[11] + ae[11] * be[15];

            rsEle[12] = ae[12] * be[0] + ae[13] * be[4] + ae[14] * be[8] + ae[15] * be[12];
            rsEle[13] = ae[12] * be[1] + ae[13] * be[5] + ae[14] * be[9] + ae[15] * be[13];
            rsEle[14] = ae[12] * be[2] + ae[13] * be[6] + ae[14] * be[10] + ae[15] * be[14];
            rsEle[15] = ae[12] * be[3] + ae[13] * be[7] + ae[14] * be[11] + ae[15] * be[15];
            return rsEle;
        }

        static getRotationVector(m:Matrix4, type:number):Vector3D {
            var rot:Quaternion = new Quaternion();
            var a, ele = m.elements, c = ele[0];
            a = ele[4];
            var d = ele[8], e = ele[1], f = ele[5], g = ele[9], h = ele[2], k = ele[6], b = ele[10], l = c + f + b;
            if (0 < l) {
                c = 0.5 / Math.sqrt(l + 1);
                rot.w = 0.25 / c;
                rot.x = (k - g) * c;
                rot.y = (d - h) * c;
                rot.z = (e - a) * c;
            }
            else if (c > f && c > b) {
                c = 2 * Math.sqrt(1 + c - f - b);
                rot.w = (k - g) / c;
                rot.x = .25 * c;
                rot.y = (a + e) / c;
                rot.z = (d + h) / c;
            }
            else if (f > b) {
                c = 2 * Math.sqrt(1 + f - c - b);
                rot.w = (d - h) / c;
                rot.x = (a + e) / c;
                rot.y = .25 * c;
                rot.z = (g + k) / c;
            }
            else {
                c = 2 * Math.sqrt(1 + b - c - f);
                rot.w = (e - a) / c;
                rot.x = (d + h) / c;
                rot.y = (g + k) / c;
                rot.z = .25 * c;
            }
            if (type == Orientation3D.EULER_ANGLES) {
                return rot.toEulerAngles();
            }
            else if (type == Orientation3D.AXIS_ANGLE) {
                return rot.toAxisAngles();
            }
            else {
                return rot.toVector3d();
            }
        }

        public get position():Vector3D {
            var pos:Vector3D = new Vector3D();
            var te:Float32Array = this.elements;
            pos.x = te[12];
            pos.y = te[13];
            pos.z = te[14];
            return pos;
        }

        decompose(type:number = Orientation3D.EULER_ANGLES) {
            var position, quaternion, scale, vec, matrix;
            position = new Vector3D();
            scale = new Vector3D();
            vec = new Vector3D();
            matrix = this.clone();
            var te = this.elements;
            vec.setTo(te[0], te[1], te[2]);
            var sx = vec.length;
            vec.setTo(te[4], te[5], te[6]);
            var sy = vec.length;
            vec.setTo(te[8], te[9], te[10]);
            var sz = vec.length;
            var det = this.determinant();
            if (det < 0) {
                sx = -sx;
            }
            position.x = te[12];
            position.y = te[13];
            position.z = te[14];
            var invSX = 1 / sx;
            var invSY = 1 / sy;
            var invSZ = 1 / sz;
            matrix.elements[0] *= invSX;
            matrix.elements[1] *= invSX;
            matrix.elements[2] *= invSX;
            matrix.elements[4] *= invSY;
            matrix.elements[5] *= invSY;
            matrix.elements[6] *= invSY;
            matrix.elements[8] *= invSZ;
            matrix.elements[9] *= invSZ;
            matrix.elements[10] *= invSZ;
            quaternion = Matrix4.getRotationVector(matrix, type);
            scale.x = sx;
            scale.y = sy;
            scale.z = sz;
            return [position, quaternion, scale];
        }

        recompose(arr):void {
            var q = new Quaternion();
            q.fromEulerAngles(arr[1].x, arr[1].y, arr[1].z);
            q.toMatrix(this);
            this.appendScale(arr[2].x, arr[2].y, arr[2].z);
            this.elements[12] = arr[0].x;
            this.elements[13] = arr[0].y;
            this.elements[14] = arr[0].z;
        }

        determinant():number {
            var te = this.elements;
            var n11 = te[0], n12 = te[4], n13 = te[8], n14 = te[12];
            var n21 = te[1], n22 = te[5], n23 = te[9], n24 = te[13];
            var n31 = te[2], n32 = te[6], n33 = te[10], n34 = te[14];
            var n41 = te[3], n42 = te[7], n43 = te[11], n44 = te[15];
            return (
                n41 * (
                    +n14 * n23 * n32
                    - n13 * n24 * n32
                    - n14 * n22 * n33
                    + n12 * n24 * n33
                    + n13 * n22 * n34
                    - n12 * n23 * n34
                ) +
                n42 * (
                    +n11 * n23 * n34
                    - n11 * n24 * n33
                    + n14 * n21 * n33
                    - n13 * n21 * n34
                    + n13 * n24 * n31
                    - n14 * n23 * n31
                ) +
                n43 * (
                    +n11 * n24 * n32
                    - n11 * n22 * n34
                    - n14 * n21 * n32
                    + n12 * n21 * n34
                    + n14 * n22 * n31
                    - n12 * n24 * n31
                ) +
                n44 * (
                    -n13 * n22 * n31
                    - n11 * n23 * n32
                    + n11 * n22 * n33
                    + n13 * n21 * n32
                    - n12 * n21 * n33
                    + n12 * n23 * n31
                )
            );
        }
    }
    export class Orientation3D {
        static EULER_ANGLES = 1;
        static AXIS_ANGLE = 2;
    }
}
