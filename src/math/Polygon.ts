module math {
    export class Polygon extends PolygonBase implements IPolygon {
        private _pointNum:number;

        constructor(list:Array<Vector3D>) {
            super();
            this._normal = new Vector3D();
            this.reset(list);
        }

        public get pointNum():number {
            return this._pointNum;
        }

        public reset(vec:Array<Vector3D>):void {
            if (vec.length < 3) {
                throw new Error("not enough point");
            }
            this._pointList = vec;
            this._edageList.length = 0;
            this._edageLenSquaredList.length = 0;
            this.update();
        }

        protected update():void {
            var i:number = 0;
            this._pointNum = this._pointList.length;
            for (i = 0; i < this._pointNum; i++) {
                var edage:Line3d = new Line3d(this._pointList[i], i + 1 == this._pointList.length ? this._pointList[0] : this._pointList[i + 1]);
                this._edageList.push(edage);
                this._edageLenSquaredList.push(edage.lengthSquared);
            }
            this._normal.x = this._edageList[0].y * this._edageList[1].z - this._edageList[0].z * this._edageList[1].y;
            this._normal.y = this._edageList[0].z * this._edageList[1].x - this._edageList[0].x * this._edageList[1].z;
            this._normal.z = this._edageList[0].x * this._edageList[1].y - this._edageList[0].y * this._edageList[1].x;
            this._normal.normalize();

            for (i = 0; i < this._pointNum; i++) {
                this._edageList[i].setPlaneNor(this._normal);
            }
            this._distance = Vector3D.dotProduct(this._edageList[0].vector, this._normal);
        }

        public pointInPoly(point:Vector3D):Boolean {
            var edage:Vector3D = MathUtil.TEMP_VEC1;
            for (var i:number = 0; i < this._pointNum; i++) {
                MathUtil.subtract(point, this._pointList[i], edage);
                if (MathUtil.checkClockSide2(this._edageList[i].vector, edage, this._normal) < 0) {
                    return false;
                }
            }
            return true;
        }

        public get position():Vector3D {
            return this._pointList[0];
        }

        public calEdageClosePoint(point:Vector3D, result:Vector3D):Vector3D {
            var miniLenSquared:Number = Number.MAX_VALUE;
            var calPoint:Vector3D = MathUtil.TEMP_VEC1;
            for (var i:number = 0; i < this._pointNum; i++) {
                MathUtil.calClosePoint(point, this._pointList[i], this._edageList[i], calPoint);
                var lenSquared:Number = MathUtil.getLenSquared(point, calPoint);
                if (lenSquared < miniLenSquared) {
                    result.x = calPoint.x;
                    result.y = calPoint.y;
                    result.z = calPoint.z;
                    miniLenSquared = lenSquared;
                }
            }
            return result;
        }
    }
}