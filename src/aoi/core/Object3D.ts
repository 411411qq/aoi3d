module aoi {
    import Matrix4 = math.Matrix4;
    import Vector3D = math.Vector3D;
    import MathUtil = math.MathUtil;
    import EventDispatcher = base.EventDispatcher;
    export class Object3D extends EventDispatcher {
        static SMALLEST_number:number = 0.0000000000000000000001;
        protected m_transformDirty:boolean = true;

        protected m_positionDirty:boolean;
        protected m_rotationDirty:boolean;
        protected m_scaleDirty:boolean;

        protected m_rotationX:number = 0;
        protected m_rotationY:number = 0;
        protected m_rotationZ:number = 0;

        protected m_transform:Matrix4 = new Matrix4();
        protected m_scaleX:number = 1;
        protected m_scaleY:number = 1;
        protected m_scaleZ:number = 1;
        protected m_scaleRate:number = 1;
        protected m_x:number = 0;
        protected m_y:number = 0;
        protected m_z:number = 0;
        protected m_pos:Vector3D = new Vector3D();
        protected m_rot:Vector3D = new Vector3D();
        protected m_sca:Vector3D = new Vector3D(1, 1, 1);
        protected m_transformComponents:Array<Vector3D>;
        protected m_mouseEnable:boolean = false;
        protected m_visible:boolean = true;
        protected m_alpha:number = 1;

        public name:string;
        public extra:Object;

        constructor() {
            super();
            this.m_transformComponents = [];
            this.m_transformComponents[0] = this.m_pos;
            this.m_transformComponents[1] = this.m_rot;
            this.m_transformComponents[2] = this.m_sca;
            this.m_transform.identity();
        }

        protected invalidatePosition():void {
            if (this.m_positionDirty)
                return;
            this.m_positionDirty = true;
            this.invalidateTransform();
        }

        protected invalidateRotation():void {
            if (this.m_rotationDirty)
                return;
            this.m_rotationDirty = true;
            this.invalidateTransform();
        }

        protected invalidateScale():void {
            if (this.m_scaleDirty)
                return;
            this.m_scaleDirty = true;
            this.invalidateTransform();
        }

        public get x():number {
            return this.m_x;
        }

        public set x(val:number) {
            if (this.m_x == val)
                return;
            this.m_x = val;
            this.invalidatePosition();
        }

        public get y():number {
            return this.m_y;
        }

        public set y(val:number) {
            if (this.m_y == val)
                return;
            this.m_y = val;
            this.invalidatePosition();
        }

        public get z():number {
            return this.m_z;
        }

        public set z(val:number) {
            if (this.m_z == val)
                return;
            this.m_z = val;
            this.invalidatePosition();
        }

        public setPositionValues(x:number, y:number, z:number):void {
            this.m_x = x;
            this.m_y = y;
            this.m_z = z;
            this.invalidatePosition();
        }

        public get rotationX():number {
            return this.m_rotationX * Define.RADIANS_TO_DEGREES;
        }

        public set rotationX(val:number) {
            if (this.rotationX == val)
                return;

            this.m_rotationX = val * Define.DEGREES_TO_RADIANS;

            this.invalidateRotation();
        }

        public get rotationY():number {
            return this.m_rotationY * Define.RADIANS_TO_DEGREES;
        }

        public set rotationY(val:number) {
            if (this.rotationY == val)
                return;

            this.m_rotationY = val * Define.DEGREES_TO_RADIANS;

            this.invalidateRotation();
        }

        public get rotationZ():number {
            return this.m_rotationZ * Define.RADIANS_TO_DEGREES;
        }

        public set rotationZ(val:number) {
            if (this.rotationZ == val)
                return;

            this.m_rotationZ = val * Define.DEGREES_TO_RADIANS;

            this.invalidateRotation();
        }

        public get scaleX():number {
            return this.m_scaleX;
        }

        public set scaleX(val:number) {
            if (this.m_scaleX == val)
                return;

            this.m_scaleX = val;

            this.invalidateScale();
        }

        public set scaleRate(value:number) {
            if (this.m_scaleRate == value)
                return;
            this.m_scaleRate = value;
            this.invalidateScale();
        }

        public get scaleY():number {
            return this.m_scaleY;
        }

        public set scaleY(val:number) {
            if (this.m_scaleY == val)
                return;
            this.m_scaleY = val;
            this.invalidateScale();
        }

        public get scaleZ():number {
            return this.m_scaleZ;
        }

        public set scaleZ(val:number) {
            if (this.m_scaleZ == val)
                return;
            this.m_scaleZ = val;
            this.invalidateScale();
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
                raw[0] = Object3D.SMALLEST_number;
                val.copyRawDataFrom(raw);
            }
            var elements:Array<Vector3D> = val.decompose();
            var vec:Vector3D;
            vec = elements[0];
            if (this.m_x != vec.x || this.m_y != vec.y || this.m_z != vec.z) {
                this.m_x = vec.x;
                this.m_y = vec.y;
                this.m_z = vec.z;
                this.invalidatePosition();
            }
            vec = elements[1];
            if (this.m_rotationX != vec.x || this.m_rotationY != vec.y || this.m_rotationZ != vec.z) {
                this.m_rotationX = vec.x;
                this.m_rotationY = vec.y;
                this.m_rotationZ = vec.z;
                this.invalidateRotation();
            }

            vec = elements[2];

            if (this.m_scaleX != vec.x || this.m_scaleY != vec.y || this.m_scaleZ != vec.z) {
                this.m_scaleX = vec.x;
                this.m_scaleY = vec.y;
                this.m_scaleZ = vec.z;
                this.invalidateScale();
            }
        }

        public get position():Vector3D {
            return this.m_transformComponents[0];
        }

        public set position(value:Vector3D) {
            this.m_x = value.x;
            this.m_y = value.y;
            this.m_z = value.z;

            this.invalidatePosition();
        }

        public setScale(x:number, y:number, z:number):void {
            this.m_scaleX = x;
            this.m_scaleY = y;
            this.m_scaleZ = z;

            this.invalidateScale();
        }

        public moveTo(dx:number, dy:number, dz:number):void {
            if (this.m_x == dx && this.m_y == dy && this.m_z == dz) return;
            this.m_x = dx;
            this.m_y = dy;
            this.m_z = dz;
            this.invalidatePosition();
        }

        public rotateTo(ax:number, ay:number, az:number):void {
            this.m_rotationX = ax * Define.DEGREES_TO_RADIANS;
            this.m_rotationY = ay * Define.DEGREES_TO_RADIANS;
            this.m_rotationZ = az * Define.DEGREES_TO_RADIANS;

            this.invalidateRotation();
        }

        public lookAt(target:Vector3D, upAxis:Vector3D = Vector3D.Y_AXIS):void {
            this.updateTransform();
            var yAxis:Vector3D, zAxis:Vector3D, xAxis:Vector3D;
            var raw:Float32Array;

            zAxis = target.subtract(this.position);
            zAxis.normalize();

            xAxis = Vector3D.crossProduct(upAxis, zAxis);
            xAxis.normalize();

            if (xAxis.length < .05) {
                xAxis = Vector3D.crossProduct(upAxis, Vector3D.Z_AXIS);
            }
            yAxis = Vector3D.crossProduct(zAxis, xAxis);

            raw = MathUtil.RAW_DATA_CONTAINER;
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
        }

        public dispose():void {
            this.x = 0;
            this.y = 0;
            this.z = 0;

            this.scaleX = 1;
            this.scaleY = 1;
            this.scaleZ = 1;

            this.rotationX = 0;
            this.rotationY = 0;
            this.rotationZ = 0;

            this.m_pos.setTo(0, 0, 0);
            this.m_rot.setTo(0, 0, 0);
            this.m_sca.setTo(1, 1, 1);

            this.m_transform.identity();

            this.m_visible = true;
            this.m_alpha = 1;
        }

        public invalidateTransform():void {
            this.m_transformDirty = true;
        }

        public updateTransform():void {
            this.m_pos.x = this.m_x;
            this.m_pos.y = this.m_y;
            this.m_pos.z = this.m_z;

            this.m_rot.x = this.m_rotationX;
            this.m_rot.y = this.m_rotationY;
            this.m_rot.z = this.m_rotationZ;

            this.m_sca.x = this.m_scaleX * this.m_scaleRate;
            this.m_sca.y = this.m_scaleY * this.m_scaleRate;
            this.m_sca.z = this.m_scaleZ * this.m_scaleRate;

            this.m_transform.recompose(this.m_transformComponents);
            this.m_transformDirty = false;
            this.m_positionDirty = false;
            this.m_rotationDirty = false;
            this.m_scaleDirty = false;
        }

        public get mouseEnable():boolean {
            return this.m_mouseEnable;
        }

        public set mouseEnable(value:boolean) {
            this.m_mouseEnable = value;
        }

        public get visible():boolean {
            return this.m_visible;
        }

        public set visible(value:boolean) {
            this.m_visible = value;
        }

        public get alpha():number {
            return this.m_alpha;
        }

        public set alpha(value:number) {
            this.m_alpha = Math.max(0, value);
            this.m_alpha = Math.min(1, this.m_alpha);
        }
    }
}