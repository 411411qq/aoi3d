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
            this._cameraController.distance = 150;
            this._cameraController.minTiltAngle = 0;
            this._cameraController.maxTiltAngle = 90;
            this._cameraController.panAngle = 45;
            this._cameraController.tiltAngle = 20;
            this._cameraController.steps = 1;

            //new aoi.InfoTrace();

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
            this._cameraController.update();
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
            //this.preAssets.push({path:"res/julang.mmv", type:AssetDefine.ASSET_MD5MESH_BY});
            //this.preAssets.push({path:"res/julang.mav", type:AssetDefine.ASSET_MD5ANIM_BY});
            //this.preAssets.push({path:"res/scene/xinshoucun/xinshoucun.scene", type:AssetDefine.ASSET_SCENE});
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
            
            var rp:RightPanel = new RightPanel();
            this._view.add2DObject(rp);
            this.winContainer = new UiConainer();
            this._view.add2DObject(this.winContainer);
            
            this.main = new aoi.EffectGroup();
            this.main.data = DataCenter.instance.mainData;
            this.scenceContainer.addChild(this.main);

            //this.showPanel();
        }

        private onPreLoaded():void
        {
            console.log(base.MD5.hex_md5("res/sky/rightcity.jpg_res/sky/leftcity.jpg"));
            console.log(base.MD5.hex_md5("res/sky/rightcity.jpg_res/sky/leftcity.jpg"));
            var urls:Array<string> = [];
            urls.push("res/sky/rightcity.jpg");
            urls.push("res/sky/leftcity.jpg");
            urls.push("res/sky/botcity.jpg");
            urls.push("res/sky/topcity.jpg");
            urls.push("res/sky/frontcity.jpg");
            urls.push("res/sky/backcity.jpg");
            let sky = new aoi.SkyBox(urls, 1500);
            sky.scaleX = -1;
            sky.scaleY = -1;
            sky.scaleZ = -1;
            this.scenceContainer.addChild(sky);
        }

        private onLineBgLoaded(param:LoaderData):void
        {
			var ass:TextureAsset = AssetManager.instance.gain(param.path, "main") as TextureAsset;
            var geo:PlaneGeometry = new PlaneGeometry(1024,1024, Define.XZ);
            this.bgxy = new Mesh(geo, new aoi.Material(ass.texture));
            this.bgxy.addPlugin(new aoi.PlunginSimple());
            this.bgxy.addPlugin(new PlunginKillAlpha(0, 0.1));
            this.bgxy.pluginCollector.setParamMode(PlunginDefine.NORMAL, true, true, false);
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
            AssetManager.instance.addAssetClass(AssetDefine.ASSET_SCENE, aoi.SceneAsset);
        }
        private onEnterFrame():void
        {
            if (this.move)
            {
                var cp = 0.3 * (this.sx - this.lastMouseX) + this.lastPanAngle;
                var ct = 0.3 * (this.sy - this.lastMouseY) + this.lastTiltAngle;
                this._cameraController.panAngle = cp;
                this._cameraController.tiltAngle = ct;
                this._cameraController.update();
            }
            this._view.render();
        }
        public onMouseAct(evt:any):void {
            switch (evt.data.type) {
                case "mousedown":
                case "touchstart":
                    this.onMouseDown(evt.data);
                    break;
                case "mousemove":
                case "touchmove":
                    this.onMouseMove(evt.data);
                    break;
                case "mouseup":
                case "touchend":
                    this.onMouseUp(evt.data);
                    break;
            }
        }

        private onMouseDown(evt:any):void {
            var e = evt || window.event;
            this.lastPanAngle = this._cameraController.panAngle;
            this.lastTiltAngle = this._cameraController.tiltAngle;
            var mouseObj:Object = Util.getMousePos(e, 0);
            this.lastMouseX = mouseObj["x"];
            this.lastMouseY = mouseObj["y"];
            this.sx = mouseObj["x"];
            this.sy = mouseObj["y"];
            this.move = true;
        }

        private onMouseUp(evt:any):void {
            this.move = false;
        }

        private onMouseMove(evt:any):void {
            var e = evt || window.event;
            var mouseObj:Object = Util.getMousePos(e, 0);
            this.sx = mouseObj["x"];
            this.sy = mouseObj["y"];
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