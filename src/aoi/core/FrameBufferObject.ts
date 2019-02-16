module aoi {
    export class FrameBufferObject
    {
        private _width:number;
        private _height:number;
        private _frameBuffer:WebGLFramebuffer;
        private _texture:WebGLTexture;
        private _depthBuffer:WebGLRenderbuffer;
        private _camera:ICamera;
        private _clearColor:math.Vector3D;
        private _type:number;

        private _renderItems:Array<Object3DContainer>;

        constructor(type:number, w:number, h:number, cam:ICamera) 
        {
            GlobelConst.eventDispatcher.addEventListener(base.EventBase.CONTEXT_DISPOSE, this, this.onContextDispose);
            this._width = w;
            this._height = h;
            this._camera = cam;
            this._type = type;
            this._clearColor = new math.Vector3D(0.0,0.0,0.0,1.0);
        }
        public addRenderItem(item:Object3DContainer):void
        {
            if(this._renderItems == null)
            {
                this.initRenderList();
            }
            this._renderItems.push(item);
        }
        public initRenderList():void
        {
            this._renderItems = [];
        }
        public drowTo(geo:Geometry):void
        {
            
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
        public get texture():WebGLTexture
        {
            return this._texture;
        }
        public get camera():ICamera
        {
            return this._camera;
        }
        private onContextDispose(event:base.EventBase):void
        {
            this.clear();
        }
        public dispose():void
        {
            GlobelConst.eventDispatcher.removeEventListener(base.EventBase.CONTEXT_DISPOSE, this, this.onContextDispose);
            this.clear();
        }
        public clear():void
        {
            let gl:WebGLRenderingContext = GlobelConst.gl;
            if(this._frameBuffer != null)
            {
                gl.deleteFramebuffer(this._frameBuffer);
                this._frameBuffer = null;
            }
            if(this._texture != null)
            {
                gl.deleteTexture(this._texture);
                this._texture = null;
            }
            if(this._depthBuffer != null)
            {
                gl.deleteRenderbuffer(this._depthBuffer);
                this._depthBuffer = null;
            }
        }
        public createFrameBuffer(gl:WebGLRenderingContext):void
        {
            if(this._frameBuffer != null || this._texture != null || this._depthBuffer != null)
            {
                return;
            }
            this._frameBuffer = gl.createFramebuffer();
            if(this._frameBuffer == null)
            {
                console.log('Failed to create frame buffer object');
                return;
            }
            this._texture = gl.createTexture();
            if (this._texture == null) 
            {
                console.log('Failed to create texture object');
                return;
            }
            gl.bindTexture(gl.TEXTURE_2D, this._texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._width, this._height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            
            this._depthBuffer = gl.createRenderbuffer();
            if (!this._depthBuffer)
            {
                console.log('Failed to create renderbuffer object');
                return;
            }
            gl.bindRenderbuffer(gl.RENDERBUFFER, this._depthBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this._width, this._height);

            gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._texture, 0);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._depthBuffer);

            var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
            if (gl.FRAMEBUFFER_COMPLETE !== e)
            {
                console.log('Frame buffer object is incomplete: ' + e.toString());
                return;
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        }
        public drawFrameBuffer(gl:WebGLRenderingContext, container:Object3DContainer, renderType:number):void
        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
            gl.viewport(0, 0, this._width, this._height);

            gl.clearColor(this._clearColor.x, this._clearColor.y, this._clearColor.z, this._clearColor.w);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            let rList:RenderList = null;
            if(this._renderItems == null)
            {
                rList = RenderCollecter.instance.getRenderList(renderType);
                container.createRenderList(gl, this._camera, renderType, rList, true);
            }
            else
            {
                rList = new RenderList();
                let len = this._renderItems.length;
                for(let i:number = 1; i < len; i++)
                {
                    this._renderItems[i].createRenderList(gl, this._camera, renderType, rList, true);
                }
            }
            rList.doRender(gl, this._camera, renderType);

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }
}