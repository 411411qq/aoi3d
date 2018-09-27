module aoi {
    import EventBase = base.EventBase;
    export class FrameBufferManager {
        private static _instance:FrameBufferManager;
        public static get instance():FrameBufferManager {
            if (FrameBufferManager._instance == null) {
                FrameBufferManager._instance = new FrameBufferManager()
            }
            return FrameBufferManager._instance;
        }
        private _dic:Object;
        constructor() 
        {
            this._dic = {};
        }
        public getFrameBufferObject(type:number):FrameBufferObject
        {
            return this._dic[type];
        }
        public addFrameBufferObject(type:number, width:number, height:number, cam:ICamera, camType:number):FrameBufferObject
        {
            if(this._dic[type] != null)
            {
                this._dic[type].dispose();
                this._dic[type] = null;
            }
            var fbo:FrameBufferObject = new FrameBufferObject(camType, width, height, cam);
            this._dic[type] = fbo;
            return fbo;
        }
        public drawFrameBuffer(gl:WebGLRenderingContext, container:Object3DContainer):void
        {
            for(var index in this._dic)
            {
                var fbo:FrameBufferObject = this._dic[index];
                fbo.createFrameBuffer(gl);
                fbo.drawFrameBuffer(gl, container, fbo.type);
            }
        }
    }
}