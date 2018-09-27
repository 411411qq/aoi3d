module aoi {
    export class SkinedSubGeometry extends SubGeometryBase {
        private m_maxJointCount:number = 0;
        public name:string;
        constructor() {
            super();
        }
        public get maxJointCount():number
        {
            return this.m_maxJointCount;
        }
        public set maxJointCount(value:number)
        {
            this.m_maxJointCount = value;
        }
        public get vertexStride():number {
            return 11 + this.m_maxJointCount * 2;
        }
    }
}