module aoi {
    import EventBase = base.EventBase;
    import Matrix4 = math.Matrix4;
    import EventDispatcher = base.EventDispatcher;
    export class ProjectionBase extends EventDispatcher {
        protected m_near:number = 10;
        protected m_far:number = 3000;

        protected m_matrix:Matrix4;
        protected m_matrixInvalid:boolean = true;
        protected m_offsetVec:math.Vector3D;

        constructor(near:number, far:number) {
            super();
            this.m_far = far;
            this.m_near = near;
            this.m_matrix = new Matrix4();
        }

        public get type():number
        {
            return 0;
        }

        public get far():number {
            return this.m_far;
        }

        public get near():number {
            return this.m_near;
        }

        public resizeView(w:number, h:number):void {
            throw new Error("need override");
        }

        protected set matrixInvalid(value:boolean) {
            this.m_matrixInvalid = value;
            if (value == true) {
                this.dispatchEvent(new EventBase(EventBase.CHANGES));
            }
        }

        public get matrix():Matrix4 {
            if (this.m_matrixInvalid == true) {
                this.updateMatrix();
                this.matrixInvalid = false;
            }
            return this.m_matrix;
        }

        protected updateMatrix():void {
            throw new Error("need override");
        }
        public offsetPos(px:number, py:number, pz:number):void
        {
            if(this.m_offsetVec == null)
            {
                this.m_offsetVec = new math.Vector3D(0,0,0);
            }
            this.m_offsetVec.x = px;
            this.m_offsetVec.y = py;
            this.m_offsetVec.z = pz;
            if(px == 0 && py == 0 && pz == 0)
            {
                this.m_offsetVec = null;
            }
        }
    }
}