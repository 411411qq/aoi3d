module editor
{
    import View = aoi.View;
    import HoverController = aoi.HoverController;
    import FrameTimerManager = base.FrameTimerManager;
    import GlobelConst = aoi.GlobelConst;
    import EventBase = base.EventBase;
    import Mesh = aoi.Mesh;
    import DefaultMaterialManager = aoi.DefaultMaterialManager;
    import PlaneGeometry = aoi.PlaneGeometry;
    import PlunginSimple = aoi.PlunginSimple;
    import Geometry = aoi.Geometry;
    import NullBounds = aoi.NullBounds;
    import AssetManager = aoi.AssetManager;
    import AssetDefine = aoi.AssetDefine;
    import TextureAsset = aoi.TextureAsset;
    import ImageAsset = aoi.ImageAsset;
    import ObjByAsset = aoi.ObjByAsset;
    import LoaderData = aoi.LoaderData;
    import ByteArray = base.ByteArray;
    import AltasAsset = aoi.AltasAsset;
    import PlunginDefine = aoi.PlunginDefine;
    import PlunginUvOffset = aoi.PlunginUvOffset;
    import AltasData = aoi.AltasData;
    import Sprite = aoi.Sprite;
    import UiConainer = aoi.UiConainer;
    import Button = aoi.Button;
    import TextField = aoi.TextField;
    import Util = base.Util;
    import UIDefine = aoi.UIDefine;
    import TextInput = aoi.TextInput;
    import RightPanel = editor.RightPanel;
    import Define = aoi.Define;
    import PlunginKillAlpha = aoi.PlunginKillAlpha;
    import CubeGeometry = aoi.CubeGeometry;
    import Vector3D = math.Vector3D;
    import Object3DContainer = aoi.Object3DContainer;
    import CreateWindow = editor.CreateWindow;
    import EffectGroup = aoi.EffectGroup;
    export class  EditorMain
    {
        private _stageWidth:number;
        private _stageHeight:number;
        private _canvas:HTMLCanvasElement;
        private _view:View;
        private _cameraController:HoverController;

        private move:boolean = false;
        private lastPanAngle:number = 0;
        private lastTiltAngle:number = 0;
        private lastMouseX:number = 0;
        private lastMouseY:number = 0;
        private sx:number = 0;
        private sy:number = 0;

        private bgxy:Mesh;
        private bgy:Mesh;
        private scenceContainer:Object3DContainer;
        private winContainer:UiConainer;
        
        private main:EffectGroup;

        constructor(canvas:HTMLCanvasElement, w:number, h:number)
        {
            this._canvas = canvas;
            this._stageWidth = w;
            this._stageHeight = h;
            this._canvas.width = w;
            this._canvas.height = h;
            this._canvas.style.width = w + 'px';
            this._canvas.style.height = h + 'px';
            this._view = new View(this._canvas, w, h);
            //this._view.camera.projection.offsetPos(- 603 / 2, 0, 0);

            this._cameraController = new HoverController(this._view.camera);
            this._cameraController.distance = 700;
            this._cameraController.minTiltAngle = -90;
            this._cameraController.maxTiltAngle = 90;
            this._cameraController.panAngle = 45;
            this._cameraController.tiltAngle = 20;
            this._cameraController.update();

            base.Util.loadScript("res/js/Stats.js");
        }

        private preAssets:Array<Object>;
        private loadedAssets:Array<Object>;
        public setup():void {
            this._view.setup();
            this.initAssetLoader();
            this.scenceContainer = new Object3DContainer(false);
            this._view.addRootObject(this.scenceContainer);
            this._cameraController.lookAtObject = this.scenceContainer;
            var s = this;
            FrameTimerManager.instance.add("main", 16, 0, this, this.onEnterFrame);
            GlobelConst.view = this._view;
            GlobelConst.eventDispatcher.addEventListener(EventBase.MOUSE_ACT, this, this.onMouseAct);
            window.addEventListener('resize', function (evt) {
                s.onWindowResize()
            }, false);
            this.loadedAssets = [];
            this.preAssets = [];
            this.preAssets.push({path:"res/cx_diffuse.png", type:AssetDefine.ASSET_TEXTURE});
            this.preAssets.push({path:"res/cx_normal.png", type:AssetDefine.ASSET_TEXTURE});
            this.preAssets.push({path:"res/uv_mask.png", type:AssetDefine.ASSET_TEXTURE});
            this.preAssets.push({path:"res/noise_1.png", type:AssetDefine.ASSET_TEXTURE});
            this.preAssets.push({path:"res/noise_2.png", type:AssetDefine.ASSET_TEXTURE});
            this.preAssets.push({path:"res/area.png", type:AssetDefine.ASSET_TEXTURE});
            this.preAssets.push({path:"res/julang.mmv", type:AssetDefine.ASSET_MD5MESH_BY});
            this.preAssets.push({path:"res/julang.mav", type:AssetDefine.ASSET_MD5ANIM_BY});
            //AssetManager.instance.fetch(UIDefine.DEFAULT, AssetDefine.ASSET_ALTAS, this, this.onObjLoaded);
            this.checkLoaded(null);
            
            //AssetManager.instance.fetch("res/lineBg.png", AssetDefine.ASSET_TEXTURE, this, this.onLineBgLoaded);
        }
        private checkLoaded(param:LoaderData):void
        {
            if(param != null)
            {
                this.loadedAssets.push(AssetManager.instance.gain(param.path, "main"));
            }
            if(this.loadedAssets.length == this.preAssets.length)
            {
                this.onPreLoaded();
            }
            else
            {
                var index:number = this.loadedAssets.length;
                AssetManager.instance.fetch(this.preAssets[index]["path"], this.preAssets[index]["type"], this, this.checkLoaded);
            }
        }
        private onWindowResize():void
        {
            this._stageWidth = window.innerWidth;
            this._stageHeight = window.innerHeight;
            this._view.resetSize(this._stageWidth, this._stageHeight);
            //this._view.camera.projection.offsetPos(- 603 / 2, 0, 0);
        }
        private onObjLoaded(param:LoaderData):void
        {
            /*
            var rp:RightPanel = new RightPanel();
            this._view.rootCon2d.addChild(rp);
            this.winContainer = new UiConainer();
            this._view.rootCon2d.addChild(this.winContainer);
            */
            this.main = new aoi.EffectGroup();
            this.main.data = DataCenter.instance.mainData;
            this.scenceContainer.addChild(this.main);

            //this.showPanel();
        }
        private planeMesh:aoi.Mesh;
        private lightMesh:aoi.Mesh;

        private buildParticleGeometry():aoi.ParticleSubGeometry
        {
            var parNum:number = 50;
            var p_geo:aoi.ParticleSubGeometry = new aoi.ParticleSubGeometry(4 * parNum, 6 * parNum);
            for(var i:number = 0; i<parNum; i++)
            {
                var offsetIndex:number = i * 4;
                p_geo.addIndex(0 + offsetIndex, 1 + offsetIndex, 2 + offsetIndex);
                p_geo.addIndex(3 + offsetIndex, 2 + offsetIndex, 1 + offsetIndex);

                p_geo.addVertexPos(-25, 25, 0, i);
                p_geo.addVertexPos(-25, -25, 0, i);
                p_geo.addVertexPos(25, 25, 0, i);
                p_geo.addVertexPos(25, -25, 0, i);

                p_geo.addVertexUv(1,0);
                p_geo.addVertexUv(1,1);
                p_geo.addVertexUv(0,0);
                p_geo.addVertexUv(0,1);

                var a1:number = math.MathUtil.getRandomNumberBetween(3,5);
                var a2:number = math.MathUtil.getRandomNumberBetween(0.5, 1.5);
                p_geo.addVertexOffsetTime(a1, a2);
                p_geo.addVertexOffsetTime(a1, a2);
                p_geo.addVertexOffsetTime(a1, a2);
                p_geo.addVertexOffsetTime(a1, a2);

                var a3:number = math.MathUtil.getRandomNumberBetween(0,0);
                var a4:number = math.MathUtil.getRandomNumberBetween(0,0);
                p_geo.addVertexOffsetPos(a3,a4, 0);
                p_geo.addVertexOffsetPos(a3,a4, 0);
                p_geo.addVertexOffsetPos(a3,a4, 0);
                p_geo.addVertexOffsetPos(a3,a4, 0);

                var a5:number = math.MathUtil.getRandomNumberBetween(-500,500);
                var a6:number = math.MathUtil.getRandomNumberBetween(-500,500);
                var a7:number = math.MathUtil.getRandomNumberBetween(-500,500);
                var a8:number = math.MathUtil.getRandomNumberBetween(-30,30);
                p_geo.addVertexSpeed(a5, a6, a7, a8);
                p_geo.addVertexSpeed(a5, a6, a7, a8);
                p_geo.addVertexSpeed(a5, a6, a7, a8);
                p_geo.addVertexSpeed(a5, a6, a7, a8);
            }

            p_geo.buildGeometry();

            return p_geo;
        }

        private onPreLoaded():void
        {
            var geo:aoi.Geometry = new aoi.Geometry();
            geo.addSubGeometry(this.buildParticleGeometry());
            geo.animator = new aoi.ParticleAnimator();
            var mat:aoi.IMaterial = new aoi.Material(this.loadedAssets[0]["texture"]);

            this.planeMesh = new aoi.Mesh(geo, mat);
            this.planeMesh.y = 40;
            //this.planeMesh.setShowInCameraState(Define.CAM_SHADOW, true);
            this.planeMesh.addPlugin(new aoi.PlunginParticlePerturbation(3));
            var ppm:aoi.PlunginParticleMove = new aoi.PlunginParticleMove();
            this.planeMesh.addPlugin(ppm);

            let pp:aoi.PlunginPerturbation = new aoi.PlunginPerturbation();
            pp.setData(0.01, 0.01, 0.2, 0.2);
            this.planeMesh.addPlugin(pp);
            this.planeMesh.addPlugin(new aoi.PlunginBillboard());

            this.planeMesh.getPluginCollector().setParamMode(PlunginDefine.NORMAL, true, true, true);
            this.scenceContainer.addChild(this.planeMesh);

            var plane2:aoi.Mesh = new aoi.Mesh(new aoi.PlaneGeometry(500,500,Define.XZ), new aoi.Material(this.loadedAssets[0]["texture"]));
            //plane2.setShowInCameraState(Define.CAM_SHADOW, true);
            plane2.addPlugin(new aoi.PlunginSimple());
            plane2.addPlugin(new aoi.PlunginSimple(), Define.COLLECT_TYPE_BACK);
            plane2.addPlugin(new aoi.PlunginGray(), Define.COLLECT_TYPE_BACK);
            var t:aoi.PlunginCollecter = plane2.getPluginCollector(Define.COLLECT_TYPE_BACK);
            t.setCullState(GlobelConst.gl.FRONT);
            plane2.addPlugin(new aoi.PlunginSimple(), Define.COLLECT_TYPE_PERTURBATION);
            plane2.addPlugin(new aoi.PlunginGray(), Define.COLLECT_TYPE_PERTURBATION);

            plane2.getPluginCollector().setParamMode(PlunginDefine.NORMAL, false, true, true);
            this.scenceContainer.addChild(plane2);
        }

        private onLineBgLoaded(param:LoaderData):void
        {
			var ass:TextureAsset = AssetManager.instance.gain(param.path, "main") as TextureAsset;
            var geo:PlaneGeometry = new PlaneGeometry(1024,1024, Define.XZ);
            this.bgxy = new Mesh(geo, new aoi.Material(ass.texture));
            this.bgxy.addPlugin(new PlunginSimple());
            this.bgxy.addPlugin(new PlunginKillAlpha(0, 0.1));
            this.bgxy.getPluginCollector().setParamMode(PlunginDefine.NORMAL, true, true, false);
            this.scenceContainer.addChild(this.bgxy);
        }
        private onMeshClick(event):void
        {
            console.log("onMeshClick");
        }

        private initAssetLoader():void
        {
            AssetManager.instance.addAssetClass(AssetDefine.ASSET_TEXTURE, TextureAsset);
            AssetManager.instance.addAssetClass(AssetDefine.ASSET_IMG, ImageAsset);
            AssetManager.instance.addAssetClass(AssetDefine.ASSET_OBJ_BY, ObjByAsset);
            AssetManager.instance.addAssetClass(AssetDefine.ASSET_ALTAS, AltasAsset);
            AssetManager.instance.addAssetClass(AssetDefine.ASSET_MD5MESH_BY, aoi.Md5MeshByAsset);
            AssetManager.instance.addAssetClass(AssetDefine.ASSET_MD5ANIM_BY, aoi.Md5AnimByAsset);
        }

        private onEnterFrame():void
        {
            var t:number = (new Date()).getTime() / 10;
            if (this.move)
            {
                this._cameraController.panAngle = 0.3 * (this.sx - this.lastMouseX) + this.lastPanAngle;
                this._cameraController.tiltAngle = 0.3 * (this.sy - this.lastMouseY) + this.lastTiltAngle;
                this._cameraController.update();
            }
            if(this.planeMesh != null)
            {
                this.vvv1 ++;
                //this.planeMesh.rotationX = this.vvv1 * 0.2;
                //this.planeMesh.rotationY = this.vvv1 * 0.2;
                //this.planeMesh.rotationZ = this.vvv1 * 0.2;
            }
            if(this.planeMesh != null)
            {
                this.vvv2++;
                //this.planeMesh.x = 100 * Math.sin(this.vvv2 * 0.02);
                //this.planeMesh.z = 100 * Math.cos(this.vvv2 * 0.02);
            }
            this._view.render();
        }
        private vvv1:number = 0;
        private vvv2:number = 0;
        private vvv3:number = 0;
        public onMouseAct(evt:any):void {
            switch (evt.data.type) {
                case "mousedown":
                    this.onMouseDown(evt.data);
                    break;
                case "mousemove":
                    this.onMouseMove(evt.data);
                    break;
                case "mouseup":
                    this.onMouseUp(evt.data);
                    break;
            }
        }

        private onMouseDown(evt:any):void {
            var e = evt || window.event;
            this.lastPanAngle = this._cameraController.panAngle;
            this.lastTiltAngle = this._cameraController.tiltAngle;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
            this.move = true;
        }

        private onMouseUp(evt:any):void {
            this.move = false;
        }

        private onMouseMove(evt:any):void {
            var e = evt || window.event;
            this.sx = e.clientX;
            this.sy = e.clientY;
        }
        private showPanel():void
        {
            var w:CreateWindow = new CreateWindow();
            w.x = - w.width / 2;
            w.y = w.height / 2;
            this.winContainer.addChild(w);
        }
    }
}