module aoi {
    import Matrix4 = math.Matrix4;
    import Vector3D = math.Vector3D;
    import EventBase = base.EventBase;
    import MathUtil = math.MathUtil;
    export class Camera3D implements ICamera {
        protected m_viewProjection:Matrix4 = new Matrix4();
        protected m_viewProjectionDirty:boolean = true;
        protected m_unprojection:Matrix4;
        protected m_unprojectionInvalid:boolean = true;

        protected m_transformDirty:boolean = true;
        protected m_transform:Matrix4 = new Matrix4();
        protected m_invertTransformDirty:boolean = true;
        protected m_invertTransform:Matrix4 = new Matrix4();
        protected m_faceCamTransformDirty:boolean = true;
        protected m_faceCamTransform:Matrix4;
        protected m_scaleX:number = 1;
        protected m_scaleY:number = 1;
        protected m_scaleZ:number = 1;
        protected m_x:number = 0;
        protected m_y:number = 0;
        protected m_z:number = 0;
        protected m_rotationX:number = 0;
        protected m_rotationY:number = 0;
        protected m_rotationZ:number = 0;
        protected m_pos:Vector3D = new Vector3D();
        protected m_rot:Vector3D = new Vector3D();
        protected m_sca:Vector3D = new Vector3D();
        protected m_target:Vector3D = new Vector3D();
        protected m_transformComponents:Array<Vector3D>;
        protected m_lightOfSight:Vector3D = new Vector3D();
        protected m_project:ProjectionBase;

        constructor(positionX:number,
                    positionY:number,
                    positionZ:number,
                    project:ProjectionBase) {
            this.m_project = project;

            this.m_x = positionX;
            this.m_y = positionY;
            this.m_z = positionZ;

            this.m_transformComponents = [];
            this.m_transformComponents[0] = this.m_pos;
            this.m_transformComponents[1] = this.m_rot;
            this.m_transformComponents[2] = this.m_sca;

            this.m_transform.identity();
            this.m_invertTransform.identity();
            var s = this;
            this.m_project.addEventListener(EventBase.CHANGES, this, this.onProjectChange);
        }

        public dispose():void {
            this.m_project.removeEventListener(EventBase.CHANGES, this, this.onProjectChange);
        }

        public get projection():ProjectionBase {
            return this.m_project;
        }

        private onProjectChange():void {
            this.m_unprojectionInvalid = true;
            this.m_viewProjectionDirty = true;
        }

        public get viewProjection():Matrix4 {
            if (this.m_viewProjectionDirty) {
                this.m_viewProjection.copyFrom(this.invertTransform);
                this.m_viewProjection.append(this.m_project.matrix);
                this.m_viewProjectionDirty = false;
            }
            return this.m_viewProjection;
        }

        public get transform():Matrix4 {
            if (this.m_transformDirty)
                this.updateTransform();
            return this.m_transform;
        }

        public set transform(val:Matrix4) {
            if (!val.elements[0]) {
                var raw:Float32Array = MathUtil.RAW_DATA_CONTAINER;
                val.copyRawDataTo(raw);
                raw[0] = 0.000001;
                val.copyRawDataFrom(raw);
            }

            var elements:Array<Vector3D> = val.decompose();
            var vec:Vector3D;

            vec = elements[0];

            if (this.m_x != vec.x || this.m_y != vec.y || this.m_z != vec.z) {
                this.m_x = vec.x;
                this.m_y = vec.y;
                this.m_z = vec.z;

                this.m_transformDirty = true;
            }

            vec = elements[1];

            if (this.m_rotationX != vec.x || this.m_rotationY != vec.y || this.m_rotationZ != vec.z) {
                this.m_rotationX = vec.x;
                this.m_rotationY = vec.y;
                this.m_rotationZ = vec.z;

                this.m_transformDirty = true;
            }

            vec = elements[2];

            if (this.m_scaleX != vec.x || this.m_scaleY != vec.y || this.m_scaleZ != vec.z) {
                this.m_scaleX = vec.x;
                this.m_scaleY = vec.y;
                this.m_scaleZ = vec.z;

                this.m_transformDirty = true;
            }
        }

        public get invertTransform():Matrix4 {
            if (this.m_invertTransformDirty == true) {
                this.m_invertTransform.copyFrom(this.transform);
                this.m_invertTransform.invert();
                this.m_invertTransformDirty = false;
            }
            return this.m_invertTransform;
        }

        private updateTransform():void {
            this.m_pos.x = this.m_x;
            this.m_pos.y = this.m_y;
            this.m_pos.z = this.m_z;

            this.m_rot.x = this.m_rotationX;
            this.m_rot.y = this.m_rotationY;
            this.m_rot.z = this.m_rotationZ;

            this.m_sca.x = this.m_scaleX;
            this.m_sca.y = this.m_scaleY;
            this.m_sca.z = this.m_scaleZ;

            this.m_transform.recompose(this.m_transformComponents);

            this.m_transformDirty = false;
        }

        public get position():Vector3D {
            return this.m_pos;
        }

        public get x():number {
            return this.m_x;
        }

        public set x(val:number) {
            if (this.m_x == val)
                return;
            this.m_x = val;
            this.m_transformDirty = true;
            this.m_invertTransformDirty = true;
            this.m_faceCamTransformDirty = true;
        }

        public get y():number {
            return this.m_y;
        }

        public set y(val:number) {
            if (this.m_y == val)
                return;
            this.m_y = val;
            this.m_transformDirty = true;
            this.m_invertTransformDirty = true;
            this.m_faceCamTransformDirty = true;
        }

        public get z():number {
            return this.m_z;
        }

        public set z(val:number) {
            if (this.m_z == val)
                return;
            this.m_z = val;
            this.m_transformDirty = true;
            this.m_invertTransformDirty = true;
        }

        public setPositionValues(x:number, y:number, z:number):void {
            this.m_x = x;
            this.m_y = y;
            this.m_z = z;
            this.m_transformDirty = true;
            this.m_invertTransformDirty = true;
            this.m_faceCamTransformDirty = true;
        }

        public get targetPos():Vector3D {
            return this.m_target;
        }

        public lookAt(target:Vector3D, upAxis:Vector3D = null):void {
            this.m_target = target.clone();
            this.m_lightOfSight.x = target.x - this.x;
            this.m_lightOfSight.y = target.y - this.y;
            this.m_lightOfSight.z = target.z - this.z;

            this.updateTransform();
            var yAxis:Vector3D, zAxis:Vector3D, xAxis:Vector3D;
            var raw:Float32Array;

            if (upAxis == null) upAxis = Vector3D.Y_AXIS;

            zAxis = target.subtract(this.position);
            zAxis.normalize();

            xAxis = Vector3D.crossProduct(upAxis, zAxis);
            xAxis.normalize();

            if (xAxis.length < .05) {
                xAxis = Vector3D.crossProduct(upAxis, Vector3D.Z_AXIS);
            }

            raw = MathUtil.RAW_DATA_CONTAINER;

            yAxis = Vector3D.crossProduct(zAxis, xAxis);

            raw[0] = this.m_scaleX * xAxis.x;
            raw[1] = this.m_scaleX * xAxis.y;
            raw[2] = this.m_scaleX * xAxis.z;
            raw[3] = 0;

            raw[4] = this.m_scaleY * yAxis.x;
            raw[5] = this.m_scaleY * yAxis.y;
            raw[6] = this.m_scaleY * yAxis.z;
            raw[7] = 0;

            raw[8] = this.m_scaleZ * zAxis.x;
            raw[9] = this.m_scaleZ * zAxis.y;
            raw[10] = this.m_scaleZ * zAxis.z;
            raw[11] = 0;

            raw[12] = this.m_x;
            raw[13] = this.m_y;
            raw[14] = this.m_z;
            raw[15] = 1;
            this.m_transform.copyRawDataFrom(raw);
            this.transform = this.transform;

            if (zAxis.z < 0) {
                this.rotationY = (180 - this.rotationY);
                this.rotationX -= 180;
                this.rotationZ -= 180;
            }
            this.m_viewProjectionDirty = true;
        }

        public get rotationX():number {
            return this.m_rotationX * Define.RADIANS_TO_DEGREES;
        }

        public set rotationX(val:number) {
            if (this.rotationX == val)
                return;
            this.m_rotationX = val * Define.DEGREES_TO_RADIANS;
            this.m_transformDirty = true;
        }

        public get rotationY():number {
            return this.m_rotationY * Define.RADIANS_TO_DEGREES;
        }

        public set rotationY(val:number) {
            if (this.rotationY == val)
                return;
            this.m_rotationY = val * Define.DEGREES_TO_RADIANS;
            this.m_transformDirty = true;
        }

        public get rotationZ():number {
            return this.m_rotationZ * Define.RADIANS_TO_DEGREES;
        }

        public set rotationZ(val:number) {
            if (this.rotationZ == val)
                return;
            this.m_rotationZ = val * Define.DEGREES_TO_RADIANS;
            this.m_transformDirty = true;
        }

        public unproject(mX:number, mY:number, mZ:number = 0):Vector3D {
            var v:Vector3D = new Vector3D(mX, -mY, mZ, 1.0);
            v = this.unprojectionMatrix.transformVector(v);
            var inv:number = 1 / v.w;
            v.x *= inv;
            v.y *= inv;
            v.z *= inv;
            v.w = 1.0;
            var rs:Vector3D = this.transform.transformVector(v);
            return rs;
        }

        private get unprojectionMatrix():Matrix4 {
            if (this.m_unprojectionInvalid) {
                if (this.m_unprojection == null) {
                    this.m_unprojection = new Matrix4();
                }
                this.m_unprojection.copyFrom(this.m_project.matrix);
                this.m_unprojection.invert();
                this.m_unprojectionInvalid = false;
            }

            return this.m_unprojection;
        }

        public get lightOfSight():Vector3D {
            return this.m_lightOfSight;
        }

        public get faceCamTransform():Matrix4 {
            if (this.m_faceCamTransformDirty == true) {
                this.m_faceCamTransform = this.transform.clone();
                this.m_faceCamTransform.appendTranslation(this.lightOfSight.x, this.lightOfSight.y, this.lightOfSight.z);
                this.m_faceCamTransformDirty = false;
            }
            return this.m_faceCamTransform;
        }
    }
}