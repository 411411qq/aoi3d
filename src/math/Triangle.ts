module math {
    export class Triangle extends Polygon implements IPolygon {
        protected _a:Vector3D;
        protected _b:Vector3D;
        protected _c:Vector3D;

        protected _ba:Vector3D;
        protected _ca:Vector3D;

        protected dot00:number;
        protected dot01:number;
        protected dot11:number;

        protected _edageAB:Line3d;
        protected _edageBC:Line3d;
        protected _edageCA:Line3d;

        constructor(p0:Vector3D, p1:Vector3D, p2:Vector3D) {
            super([]);
            if (p0 != null && p1 != null && p2 != null) {
                this._a = p0;
                this._b = p1;
                this._c = p2;

                this._ba = this._b.subtract(this._a);
                this._ca = this._c.subtract(this._a);

                this.dot00 = Vector3D.dotProduct(this._ca, this._ca);
                this.dot01 = Vector3D.dotProduct(this._ca, this._ba);
                this.dot11 = Vector3D.dotProduct(this._ba, this._ba);
                this.update();
            }
        }

        public get pointNum():number {
            return 3;
        }

        protected update():void {
            this._normal = new Vector3D();
            var tmp:Vector3D = MathUtil.TEMP_VEC1;
            var tmp1:Vector3D = MathUtil.TEMP_VEC2;
            MathUtil.subtract(this._b, this._a, tmp);
            MathUtil.subtract(this._c, this._b, tmp1);
            if (tmp.length < 0.001 || tmp1.length < 0.001 || this._ba.length < 0.001 || this._ca.length < 0.001) {//在这个精度下认为这个三角形的三个顶点在同一条直线上
                tmp.setTo(0, 0, 0);
            }
            MathUtil.crossProduct(tmp, tmp1, this._normal);
            this._normal.normalize();
            this._distance = Vector3D.dotProduct(this._a, this.normal);
            this._edageAB = new Line3d(this._a, this._b);
            this._edageBC = new Line3d(this._b, this._c);
            this._edageCA = new Line3d(this._c, this._a);

            this.addEdage(this._a, this._edageAB);
            this.addEdage(this._b, this._edageBC);
            this.addEdage(this._c, this._edageCA);

            this._edageAB.setPlaneNor(this._normal);
            this._edageBC.setPlaneNor(this._normal);
            this._edageCA.setPlaneNor(this._normal);
        }

        public calEdageClosePoint(point:Vector3D, result:Vector3D):Vector3D {
            var miniLenSquared:number = Number.MAX_VALUE;

            var calPoint:Vector3D = MathUtil.TEMP_VEC1;
            for (var i:number = 0; i < 3; i++) {
                var orgin:Vector3D;
                var edage:Line3d;
                if (i == 0) {
                    orgin = this._a;
                    edage = this._edageAB;
                } else if (i == 1) {
                    orgin = this._b;
                    edage = this._edageBC;
                }
                else {
                    orgin = this._c;
                    edage = this._edageCA;
                }

                MathUtil.calClosePoint(point, orgin, edage, calPoint);
                var lenSquared:number = MathUtil.getLenSquared(point, calPoint);
                if (lenSquared < miniLenSquared) {
                    result.x = calPoint.x;
                    result.y = calPoint.y;
                    result.z = calPoint.z;
                    miniLenSquared = lenSquared;
                }
            }
            return result;
        }

        public get normal():Vector3D {
            return this._normal;
        }

        public get position():Vector3D {
            return this._a;
        }

        public pointInPoly(p:Vector3D):Boolean {
            var v0:Vector3D = this._ca;
            var v1:Vector3D = this._ba;
            var v2:Vector3D = p.subtract(this._a);

            var dot02:number = Vector3D.dotProduct(v0, v2);
            var dot12:number = Vector3D.dotProduct(v1, v2);

            var inverDeno:number = 1 / (this.dot00 * this.dot11 - this.dot01 * this.dot01);

            var u:number = (this.dot11 * dot02 - this.dot01 * dot12) * inverDeno;

            if (u < 0 || u > 1) {
                return false;
            }
            var v:number = (this.dot00 * dot12 - this.dot01 * dot02) * inverDeno;
            if (v < 0 || v > 1) {
                return false;
            }
            return u + v <= 1;
        }
    }
}