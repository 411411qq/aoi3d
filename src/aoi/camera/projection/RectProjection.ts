module aoi {
    import MathUtil = math.MathUtil;
    export class RectProjection extends ProjectionBase {
        private m_aspectRatio:number;
        private m_height:number;

        private m_scale:number = 1;

        constructor(near:number,
                    far:number,
                    aspectRatio:number,
                    height:number,
                    scal:number = 1) {
            super(near, far);
            this.m_scale = scal;
            this.m_height = height / scal;
            this.aspectRatio = aspectRatio;

        }
        public get type():number
        {
            return 1;
        }
        public resizeView(w:number, h:number):void {
            this.m_height = h / this.m_scale;
            this.aspectRatio = w / h;
        }

        public set scale(value:number) {
            this.m_scale = value;
        }

        public set aspectRatio(value:number) {
            this.m_aspectRatio = value;
            this.matrixInvalid = true;
        }

        protected updateMatrix():void {
            var raw:Float32Array = MathUtil.RAW_DATA_CONTAINER;
            var projectionHeight:number = this.m_height;
            var m_yMax:number = projectionHeight * 0.5;
            var m_xMax:number = m_yMax * this.m_aspectRatio;

            var left:number = -m_xMax;
            var right:number = m_xMax;
            var top:number = -m_yMax;
            var bottom:number = m_yMax;

            raw[0] = 2 / (projectionHeight * this.m_aspectRatio);
            raw[5] = 2 / projectionHeight;
            raw[10] = 1 / (this.m_far - this.m_near);
            raw[14] = this.m_near / (this.m_near - this.m_far);
            raw[1] = raw[2] = raw[3] = raw[4] =
                raw[6] = raw[7] = raw[8] = raw[9] =
                    raw[11] = raw[12] = raw[13] = 0;
            raw[15] = 1;
            this.m_matrix.copyRawDataFrom(raw);
            if(this.m_offsetVec != null)
            {
                this.m_matrix.appendTranslation(this.m_offsetVec.x, this.m_offsetVec.y, this.m_offsetVec.z);
            }
        }
    }
}