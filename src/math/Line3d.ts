module math {
    export class Line3d {
        private _pointA:Vector3D;
        private _pointB:Vector3D;
        protected _lengthSquared:number = -1;

        private _vector:Vector3D;
        private _nor:Vector3D;

        private _planeNor:Vector3D;

        constructor(pa:Vector3D, pb:Vector3D) {
            this._pointA = pa;
            this._pointB = pb;
            this.update();
        }

        public setPointB(p:Vector3D):void {
            this._pointB = p;
            this.update();
        }

        public setPlaneNor(vec:Vector3D):void {
            this._planeNor = vec;
            this._nor = null;
        }

        public get nor():Vector3D {
            if (this._nor == null) {
                this._nor = Vector3D.crossProduct(this.vector, this._planeNor);
            }
            return this._nor;
        }

        private update():void {
            this._vector = null;
            this._lengthSquared = -1;
            this._nor = null;
        }

        public get vector():Vector3D {
            if (this._vector == null) {
                this._vector = this._pointB.subtract(this._pointA);
            }
            return this._vector;
        }

        public get x():number {
            return this.vector.x;
        }

        public get y():number {
            return this.vector.y;
        }

        public get z():number {
            return this.vector.z;
        }

        public get pointA():Vector3D {
            return this._pointA;
        }

        public get pointB():Vector3D {
            return this._pointB;
        }

        public get lengthSquared():number {
            if (this._lengthSquared == -1) {
                var oa:number = this._pointA.x - this._pointB.x;
                var ob:number = this._pointA.y - this._pointB.y;
                this._lengthSquared = oa * oa + ob * ob;
            }
            return this._lengthSquared;
        }

        /** 点在直线的顺逆时针伽关系*/
        public classifyPoint(point:Vector3D, epsilon:number = 0.000001):number {
            var result:number = PlaneClassification.COINCIDING;
            var distance:number = this.signedDistance(point);
            if (distance > epsilon) {
                result = PlaneClassification.FRONT;
            }
            else if (distance < -epsilon) {
                result = PlaneClassification.BACK;
            }
            return result;
        }

        private signedDistance(point:Vector3D):number {
            var v:Vector3D = point.subtract(this._pointA);
            return Vector3D.dotProduct(v, this.nor);
        }
    }
}