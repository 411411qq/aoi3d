module aoi {
    import Quaternion = math.Quaternion;
    import Vector3D = math.Vector3D;
    import Matrix4 = math.Matrix4;
    export class JointPose {
        public datas:Array<number>;
        private _orientation:Quaternion;
        private _translation:Vector3D;
        private _globalMatrix3d:Matrix4;
        private _matrix3d:Matrix4;
        public index:number;
        public name:string;
        private _rsRotation:Float32Array;
        private _rsPosition:Float32Array;
        private _rowData:Float32Array;

        constructor() {
            this.datas = null;

            this._orientation = null;
            this._translation = null;
            this._globalMatrix3d = null;
            this._matrix3d = null;
            this.index = 0;

            this._rsRotation = null;
            this._rsPosition = null;

            this._rowData = null;
        }

        public get rsRotation():Float32Array {
            if (this._rsRotation == null) {
                this.buildRsData();
            }
            return this._rsRotation;
        }

        public get rsPosition():Float32Array {
            if (this._rsPosition == null) {
                this.buildRsData();
            }
            return this._rsPosition;
        }

        private buildRsData():void {
            if (this.matrix3d != null) {
                this.buildLimitData();
                var vecs = this.matrix3d.decompose();
                this._rsPosition = new Float32Array([vecs[0].x, vecs[0].y, vecs[0].z, (vecs[2].x + vecs[2].y + vecs[2].z) / 3]);
                this._rsRotation = new Float32Array([-vecs[1].x, -vecs[1].y, -vecs[1].z, -vecs[1].w]);
            }
        }

        public get matrix3d():Matrix4 {
            if (this._matrix3d == null) {
                this._matrix3d = this.orientation.toMatrix();
                this._matrix3d.appendTranslation(this.translation.x, this.translation.y, this.translation.z);
            }
            return this._matrix3d;
        }

        public set matrix3d(value:Matrix4) {
            this._matrix3d = value;
        }

        public get translation():Vector3D {
            if (this._translation == null) {
                this._translation = new Vector3D();
                if (this.datas != null) {
                    this._translation.x = this.datas[0];
                    this._translation.y = this.datas[1];
                    this._translation.z = this.datas[2];
                }
            }
            return this._translation;
        }

        public set translation(val:Vector3D) {
            if (this.datas == null) {
                this._translation = val;
            }
        }

        public get orientation():Quaternion {
            if (this._orientation == null) {
                this._orientation = new Quaternion();
                if (this.datas != null) {
                    this._orientation.x = this.datas[3];
                    this._orientation.y = this.datas[4];
                    this._orientation.z = this.datas[5];
                    var w = 1 - this._orientation.x * this._orientation.x - this._orientation.y * this._orientation.y - this._orientation.z * this._orientation.z;
                    this._orientation.w = w < 0 ? 0 : -Math.sqrt(w);
                }
            }
            return this._orientation;
        }

        public set orientation(val:Quaternion) {
            if (this.datas == null) {
                this._orientation = val;
            }
        }

        private buildLimitData():void
        {
            if (this._rowData == null)
            {
                this._rowData = this.matrix3d.elements;
            }
        }
        public get rowData():Float32Array
        {
            this.buildLimitData();
            return this._rowData;
        }
        public caculateJoint(value:SkeletonJoint, parentJoint:SkeletonJoint):void
        {
            if(value.parentIndex < 0){
				value.bindPose = this.matrix3d;
			}
			else {
				this.matrix3d.append(parentJoint.bindPose);
				value.bindPose = this.matrix3d;
			}
			
			this._matrix3d = value.inverseBindPose.clone();
			this._matrix3d.append(value.bindPose);
        }
    }
}