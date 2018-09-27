module math {
    export class PolygonBase {
        protected _pointList:Array<Vector3D> = [];
        protected _edageList:Array<Line3d> = [];
        protected _edageLenSquaredList:Array<number> = [];

        protected _normal:Vector3D;
        protected _center:Vector3D;
        protected _distance:number;

        constructor() {
        }

        protected update():void {

        }

        public caculatePolygonSide(poly:IPolygon):number {
            var list:Array<Vector3D> = poly.pointList;
            var numPoint:number = poly.pointList.length;
            var i:number = 0;
            var lastCheck:number = -1;
            for (i = 0; i < numPoint; i++) {
                var temp:number = this.caculatePointSide(list[i]);
                if (temp == PlaneClassification.COINCIDING) {
                    continue;
                }
                if (lastCheck == -1) {
                    lastCheck = temp;
                }
                if (lastCheck != -1 && lastCheck != temp) {
                    return PlaneClassification.SPANNING;
                }
            }
            if (lastCheck == -1) {
                return PlaneClassification.COINCIDING;
            }
            return lastCheck;
        }

        public caculatePointSide(p:Vector3D):number {
            var dis:number = this.caculatePointDis(p);
            if (dis > PlaneClassification.EPSILON) {
                return PlaneClassification.FRONT;
            }
            else if (dis < -PlaneClassification.EPSILON) {
                return PlaneClassification.BACK;
            }
            else {
                return PlaneClassification.COINCIDING;
            }
        }

        public get centre():Vector3D {
            if (this._center == null) {
                this._center = new Vector3D();
                for (var i:number = 0; i < this._pointList.length; i++) {
                    this._center.incrementBy(this._pointList[i]);
                }
                this._center.scaleBy(1 / this._pointList.length);
            }
            return this._center;
        }

        public checkRayCollision(pos:Vector3D, dir:Vector3D):Vector3D {
            var v:Vector3D = MathUtil.getLineCrossPlane(pos, dir, this._normal, this.position);
            if (v != null) {
                if (this.pointInPoly(v) == true) {
                    return v;
                }
            }
            return null;
        }

        public get position():Vector3D {
            return null;
        }

        public get distance():number {
            return this._distance;
        }

        public pointInPoly(p:Vector3D):Boolean {
            return false;
        }

        public get edageList():Array<Line3d> {
            return this._edageList;
        }

        public get pointList():Array<Vector3D> {
            return this._pointList;
        }

        public get normal():Vector3D {
            return this._normal;
        }

        public get outNormal():Vector3D {
            return this._normal.clone();
        }

        public get edageLenSquaredList():Array<number> {
            return this._edageLenSquaredList;
        }

        public caculatePointDis(p:Vector3D):number {
            return Vector3D.dotProduct(p, this._normal) - this._distance;
        }

        protected addEdage(start:Vector3D, edage:Line3d):void {
            this._pointList.push(start);
            this._edageList.push(edage);
            this._edageLenSquaredList.push(edage.lengthSquared);
        }

        public dispose():void {
            this._pointList.length = 0;
            this._edageList.length = 0;
            this._edageLenSquaredList.length = 0;
        }
    }
}