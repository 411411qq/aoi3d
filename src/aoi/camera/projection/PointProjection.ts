module aoi {
    import MathUtil = math.MathUtil;
    export class PointProjection extends ProjectionBase {
        private m_aspectRatio:number = 1;
        private m_fieldOfView:number;
        private m_focalLengthInv:number;

        constructor(near:number,
                    far:number,
                    aspect:number,
                    vFOV:number) {
            super(near, far);
            this.m_aspectRatio = aspect;
            this.fieldOfView = vFOV;
        }
        public get type():number
        {
            return 2;
        }
        public set fieldOfView(value:number) {
            if (value == this.m_fieldOfView) return;
            this.m_fieldOfView = value;
            this.m_focalLengthInv = Math.tan(this.m_fieldOfView * Math.PI / 360);
            this.matrixInvalid = true;
        }

        public resizeView(w:number, h:number):void {
            this.aspectRatio = w / h;
        }

        public set aspectRatio(value:number) {
            this.m_aspectRatio = value;
            this.matrixInvalid = true;
        }

        protected updateMatrix():void {
            var raw:Float32Array = MathUtil.RAW_DATA_CONTAINER;
            var m_yMax:number = this.m_near * this.m_focalLengthInv;
            var m_xMax:number = m_yMax * this.m_aspectRatio;

            raw[0] = this.m_near / m_xMax;
            raw[5] = this.m_near / m_yMax;
            raw[10] = this.m_far / (this.m_far - this.m_near);
            raw[11] = 1;
            raw[1] = raw[2] = raw[3] = raw[4] =
                raw[6] = raw[7] = raw[8] = raw[9] =
                    raw[12] = raw[13] = raw[15] = 0;
            raw[14] = -this.m_near * raw[10];

            this.m_matrix.copyRawDataFrom(raw);
            if(this.m_offsetVec != null)
            {
                this.m_matrix.appendTranslation(this.m_offsetVec.x, this.m_offsetVec.y, this.m_offsetVec.z);
            }
        }
    }
}