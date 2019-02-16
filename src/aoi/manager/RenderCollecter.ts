module aoi {
    export class RenderCollecter {
        private static _instance:RenderCollecter;
        public static get instance():RenderCollecter {
            if (RenderCollecter._instance == null) {
                RenderCollecter._instance = new RenderCollecter();
            }
            return RenderCollecter._instance;
        }
        private _dic:Object = {};
        public getRenderList(type:number):RenderList
        {
            if(this._dic[type] == null)
            {
                this._dic[type] = new RenderList();
            }
            return this._dic[type];
        }
        public clearAll():void
        {
            for(var index in this._dic)
            {
                var rlist:RenderList = this._dic[index];
                rlist.clear();
            }
        }
    }
    export class RenderList
    {
        public vec:Array<IRenderable>;
        public alphaVec:Array<IRenderable>;
        public quadBatch:Array<QuadBatch>;
        public useBatch:Array<QuadBatch>;
        public mouseVec:Array<IMouseObj>;
        constructor() 
        {
            this.vec = [];
            this.alphaVec = [];
            this.quadBatch = [];
            this.useBatch = [];
            this.mouseVec = [];
        }
        public doRender(gl:WebGLRenderingContext, cam:ICamera, renderType:number):void
        {
            var i, len, obj;
            len = this.alphaVec.length;
            if(renderType == Define.CAM_2D)
            {
                var q:QuadBatch;
                for (i = 0; i < len; i++) {
                    obj = this.alphaVec[i];
                    obj.z = 1 - i;
                    obj.render(gl, cam);
                    if (q == null
                        || q.isSame(obj, renderType) == false) {
                        q = this.getOneQuadBatch();
                        this.useBatch.push(q);
                    }
                    q.addMesh(obj, cam, renderType);
                }
                len = this.useBatch.length;
                for (i = 0; i < len; i++) {
                    this.useBatch[i].render(gl, cam, renderType);
                }
                len = this.vec.length;
                for (i = 0; i < len; i++) {
                    obj = this.vec[i];
                    obj.render(gl, cam, renderType);
                }
            }
            else
            {
                len = this.vec.length;
                for (i = 0; i < len; i++) {
                    obj = this.vec[i];
                    obj.render(gl, cam, renderType);
                }
                this.alphaVec.sort(sortNumber);
                len = this.alphaVec.length;
                for (i = 0; i < len; i++) {
                    obj = this.alphaVec[i];
                    obj.render(gl, cam, renderType);
                }
            }
            function sortNumber(a, b) {
                return a.renderDepth - b.renderDepth;
            }
        }
        private getOneQuadBatch(renderType:number = 1):QuadBatch 
        {
            if (this.quadBatch.length > 0) {
                return this.quadBatch.shift();
            }
            var q:QuadBatch = new QuadBatch();
            q.addPlugin(new PlunginSimple());
            let nor:PlunginCollecter = q.getPluginCollector(renderType) as PlunginCollecter;
            nor.setParamMode(PlunginDefine.NORMAL, true, true);
            return q;
        }
        public addRender(target:any, cam:ICamera, checkInFrustum:boolean):void
        {
            if (target.visible == true
                && target.alpha > 0
                && target.geometry != null && target.material != null
                && target.bound.isInFrustum(cam, target) == true) {
                if (target.hasAlpha == false) {
                    this.vec.push(target);
                }
                else {
                    this.alphaVec.push(target);
                    target.caculateRenderDepth(cam);
                }
                this.addMouseCheck(target);
            }
        }
        public addMouseCheck(target:any):void {
            if (target.mouseEnable == true) {
                if (target["geometry"] != null
                    && target["material"] != null) {
                    this.mouseVec.push(target);
                }
            }
        }
        public clear():void {
            this.vec.length = 0;
            this.alphaVec.length = 0;
            this.mouseVec.length = 0;
            while(this.useBatch.length > 0)
            {
                this.returnQuadBatch(this.useBatch.shift());
            }
        }
        private returnQuadBatch(value:QuadBatch):void {
            value.reset();
            this.quadBatch.push(value);
        }
    }
}