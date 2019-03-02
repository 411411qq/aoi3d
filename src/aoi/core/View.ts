module aoi {
    import EventBase = base.EventBase;
    import Vector3D = math.Vector3D;
    export class View {
        public width:number;
        public height:number;
        private mouseEvent:EventBase;
        private canvas:HTMLCanvasElement;
        private m_mouseMeshCheck:boolean;
        public mouseX:number = 0;
        public mouseY:number = 0;
        private pixelRatio:number = 1;
        private m_mouseManager:Mouse3DManager;
        public camera:ICamera;
        private rootContainer:Object3DContainer;
        private rootCon2d:UiConainer;
        private gl:WebGLRenderingContext;

        private cam2d:ICamera;
        private shadowCam:Camera3D;

        constructor(canvas:HTMLCanvasElement, w:number, h:number, cam:ICamera = null) {
            this.canvas = canvas;
            this.width = w;
            this.height = h;
            this.mouseEvent = new EventBase(EventBase.MOUSE_ACT);
            this.m_mouseManager = new Mouse3DManager();
            this.m_mouseMeshCheck = false;
            this.mouseX = 0;
            this.mouseY = 0;
            this.pixelRatio = 1;
            if (cam == null) {
                var project = new PointProjection(20, 2000, w / h, 60);
                this.camera = new Camera3D(0, 0, 2, project);
                this.camera.z = -5800;
                this.camera.y = 0;
                this.camera.lookAt(new Vector3D(0, 0, 0), null);
            }
            else {
                this.camera = cam;
            }
            var pro2d = new RectProjection(1, 2000, w / h, h, 1);
            this.cam2d = new Camera3D(0,0,-1000, pro2d);
            this.cam2d.lookAt(new Vector3D(0,0,0), Vector3D.Y_AXIS);
            this.rootContainer = new Object3DContainer(true);
            this.rootCon2d = new UiConainer(true);
            this.gl = null;
            GlobelConst.view = this;

            var d = document.getElementsByClassName("egret-player");
            d[0]["style"]["overflowX"] = "hidden";
            d[0]["style"]["overflowY"] = "hidden";
        }

        public addRootObject(obj:Object3DContainer):void
        {
            this.rootContainer.addChild(obj);
        }

        public add2DObject(obj:Object3DContainer):void
        {
            this.rootCon2d.addChild(obj);
        }

        public setPixelRatio(val:number):void {
            this.pixelRatio = val;
        }

        public setup():void {
            this.gl = CuonUtils.getWebGLContext(this.canvas, {antialias:true});
            this.initGLState();
            this.m_mouseManager.init(this, this.m_mouseMeshCheck);
            this.m_mouseManager.enableMouseListeners();
            GlobelConst.gl = this.gl;

            var sofl:aoi.SupportsOESTextureFloatLinear = new aoi.SupportsOESTextureFloatLinear();
            sofl.init(this.gl);

            var s = this;
            var onClickCanvas = function (evt) {
                var e = evt || window.event;
                var mouseObj:Object = base.Util.getMousePos(e, 0);
                s.mouseX = mouseObj["x"];
                s.mouseY = mouseObj["y"];
                s.mouseEvent.data = e;
                GlobelConst.eventDispatcher.dispatchEvent(s.mouseEvent);
            };
            
            this.canvas.onclick = onClickCanvas;
            if(base.Util.getPlatform() == Define.PC)
            {
                this.canvas.onmousemove = onClickCanvas;
                this.canvas.onmouseover = onClickCanvas;
                this.canvas.onmouseout = onClickCanvas;
                this.canvas.onmousedown = onClickCanvas;
                this.canvas.onmouseup = onClickCanvas;

                var scrollFunc=function(e){
                    var direct=0;
                    e=e || window.event;
                
                    if(e.wheelDelta){//IE/Opera/Chrome
                        //console.log("wheelDelta:", e.wheelDelta);
                    }else if(e.detail){//Firefox
                        //console.log("detail:", e.detail);
                    }
                }
                /*注册事件*/
                if(this.canvas.addEventListener){
                    this.canvas.addEventListener('DOMMouseScroll',scrollFunc,false);
                }//W3C
                this.canvas.onmousewheel = scrollFunc;
            }
            else
            {
                this.canvas.ontouchend = onClickCanvas;
                this.canvas.ontouchmove = onClickCanvas;
                this.canvas.ontouchstart = onClickCanvas;
                this.canvas.ontouchend = onClickCanvas;
            }
        }
        private initGLState()
        {
            this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
            this.gl.enable(this.gl.CULL_FACE);
        }
        public resetSize(w:number, h:number):void {
            this.canvas.width = this.width = w * this.pixelRatio;
            this.canvas.height = this.height = h * this.pixelRatio;
            this.canvas.style.width = this.width + 'px';
            this.canvas.style.height = this.height + 'px';
            this.canvas.style.overflowX = "hidden";
            this.canvas.style.overflowY = "hidden";
            this.camera.projection.resizeView(w, h);
            this.cam2d.projection.resizeView(w, h);
            if(this.shadowCam != null)this.shadowCam.projection.resizeView(w, h);
            this.gl.viewport(0, 0, this.width, this.height);
            GlobelConst.eventDispatcher.dispatchEvent(new EventBase(EventBase.WIN_RESIZE));
        }

        public setMouseMeshCheck(value:boolean):void {
            this.m_mouseMeshCheck = value;
            this.m_mouseManager.meshDataCheck = value;
        }
        public render():void {
            var checkMouse = false;
            if (GlobelConst.nowTime - this.m_mouseManager.lastCheckTime >= 100) {
                this.m_mouseManager.lastCheckTime = GlobelConst.nowTime;
                checkMouse = true;
            }
            /*
            if(this.shadowCam == null)
            {
                this.shadowCam = new Camera3D(0, 0, 2, new PointProjection(20, 1000, 1, 60));
                //this.shadowCam = new Camera3D(0, 0, 2, new RectProjection(20, 1000, 1, 512));
                let v:math.Vector3D = new math.Vector3D(1,1,1);
                v.normalize();
                v.scaleBy(800);
                this.shadowCam.setPositionValues(v.x, v.y, v.z);
                this.shadowCam.lookAt(new math.Vector3D(0,0,0));
                var fbo:FrameBufferObject = FrameBufferManager.instance.addFrameBufferObject(Define.FBO_SHADOW, 512, 512, this.shadowCam, Define.CAM_SHADOW);
                fbo.setClearColor(1,1,1,1);
            }
            */
            TextureDrawerManager.instance.doDraw(this.gl);
            if(FrameBufferManager.instance.getFrameBufferObject(Define.FBO_PERTURBATION) == null)
            {
                FrameBufferManager.instance.addFrameBufferObject(Define.FBO_PERTURBATION, 1024, 1024, this.camera, Define.CAM_PERTURBATION);
            }
            
            let root2dList:RenderList = RenderCollecter.instance.getRenderList(Define.CAM_2D);
            this.rootCon2d.createRenderList(this.gl, this.cam2d, Define.CAM_2D, root2dList, true);
            let rootList:RenderList = RenderCollecter.instance.getRenderList(Define.CAM_NORMAL);
            this.rootContainer.createRenderList(this.gl, this.camera, Define.CAM_NORMAL, rootList, true);
            
            FrameBufferManager.instance.drawFrameBuffer(this.gl, this.rootContainer);

            GlobelConst.tempValue ++;
            
            this.gl.clearColor(.5,.5,.5,1);
            this.gl.viewport(0, 0, this.width, this.height);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

            
            root2dList.doRender(this.gl, this.cam2d, Define.CAM_2D);
            rootList.doRender(this.gl, this.camera, Define.CAM_NORMAL);
            if (checkMouse == true)this.m_mouseManager.updateCollider(this, rootList, root2dList);
            RenderCollecter.instance.clearAll();
        }
        
        public unproject(mX:number, mY:number, mZ:number):Vector3D {
            return this.camera.unproject((mX * 2 - this.width) / this.width, (mY * 2 - this.height) / this.height, mZ);
        }
    }
}