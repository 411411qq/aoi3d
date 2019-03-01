module aoi {
    import EventBase = base.EventBase;
    export class ObjectDrawerTexture extends FrameBufferTexture {
        private _clearColor:math.Vector3D;
        private _camera:ICamera;
        private _type:number;
        constructor(type:number, w:number, h:number, cam:ICamera) 
        {
            super(w,h);
            this._camera = cam;
            this._type = type;
            this._clearColor = new math.Vector3D(0.5,0.5,0.5,1.0);
        }
        public setClearColor(r:number, g:number, b:number, a:number):void
        {
            this._clearColor.x = r;
            this._clearColor.y = g;
            this._clearColor.z = b;
            this._clearColor.w = a;
        }
        public get type():number
        {
            return this._type;
        }
        public get camera():ICamera
        {
            return this._camera;
        }
        public drawFrameBuffer(gl:WebGLRenderingContext, container:Object3DContainer, renderType:number):void
        {
            this.beforeDraw(gl);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
            gl.viewport(0, 0, this._width, this._height);

            gl.clearColor(this._clearColor.x, this._clearColor.y, this._clearColor.z, this._clearColor.w);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            let rList:RenderList = null;
            rList = RenderCollecter.instance.getRenderList(renderType);
            container.createRenderList(gl, this._camera, renderType, rList, true);
            rList.doRender(gl, this._camera, renderType);

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this.afterDraw(gl);
        }
    }
}