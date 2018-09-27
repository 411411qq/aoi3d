module editor {
    import Sprite = aoi.Sprite;
    import AltasAsset = aoi.AltasAsset;
    import AssetManager = aoi.AssetManager;
    import UiConainer = aoi.UiConainer;
    import UIDefine = aoi.UIDefine;
    import GlobelConst = aoi.GlobelConst;
    import EventBase = base.EventBase;
    import Button = aoi.Button;
    import UICreate = editor.UICreate;
    import Util = base.Util;
    import DataCenter = editor.DataCenter;
    import TextField = aoi.TextField;
    export class EditorPanelBase extends UiConainer {
        protected ass:AltasAsset;
        private bg:Sprite;
        private _width:number;
        private _height:number;

        constructor(width:number, height:number, needbg:boolean = false) {
            super(false);
            this._width = width;
            this._height = height;
            this.ass = AssetManager.instance.gain(UIDefine.DEFAULT, "Componenet") as AltasAsset;
            if (needbg) {
                this.bg = new Sprite(width, height);
                this.bg.altas = this.ass.altas;
                this.bg.altasName = "bg";
                this.addChild(this.bg);
            }
        }

        public get width():number {
            return this._width;
        }

        public set width(value:number) {
            this._width = value;
            if (this.bg != null) {
                this.bg.width = value;
            }
        }

        public get height():number {
            return this._height;
        }

        public set height(value:number) {
            this._height = value;
            if (this.bg != null) {
                this.bg.height = value;
            }
        }
    }
    export class RightPanel extends EditorPanelBase {
        private rr:RightRightPanel;
        private rm:EditorPanelBase;
        private rl:EditorPanelBase;

        constructor() {
            super(603, GlobelConst.view.height, false);
            this.rr = new RightRightPanel(200, GlobelConst.view.height);
            this.addChild(this.rr);

            this.rm = new EditorPanelBase(200, GlobelConst.view.height, true);
            this.addChild(this.rm);
            this.rm.x = 201;

            this.rl = new EditorPanelBase(200, GlobelConst.view.height, true);
            this.addChild(this.rl);
            this.rl.x = 402;

            this.resize();
            var s = this;
            GlobelConst.eventDispatcher.addEventListener(EventBase.WIN_RESIZE, this, this.resize);
        }

        public resize():void {
            this.y = GlobelConst.view.height / 2;
            this.x = GlobelConst.view.width / 2 - 603;
            this.rr.height = GlobelConst.view.height;
            this.rm.height = GlobelConst.view.height;
            this.rl.height = GlobelConst.view.height;

            this.rr.onResize();
        }
    }
    export class RightRightPanel extends EditorPanelBase {
        private btn:Button;
        private txt:TextField;
        constructor(width:number, height:number) {
            super(width, height, true);

            this.btn = UICreate.createBtn(100, 40);
            this.addChild(this.btn);
            var s = this;
            this.btn.addEventListener(EventBase.MOUSE_DOWN, this, this.onBtnClick);

            this.txt = new TextField(150, 30);
            this.txt.y = -200;
            this.addChild(this.txt);
        }

        private onBtnClick(event):void {
        	
        }
        public onResize():void
        {
            var str:string = GlobelConst.view.width + ", " + GlobelConst.view.height;
            this.txt.text = str;
        }
    }
    export class RightMidPanel extends EditorPanelBase {
        private btn:Button;

        constructor(width:number, height:number) {
            super(width, height, true);
        }
    }
    export class Window extends UiConainer
    {
        protected ass:AltasAsset;
        protected bg:Sprite;
        protected closeBtn:Sprite;
        protected _width:number;
        protected _height:number;
        protected _title:TextField;
        constructor(w:number, h:number)
        {
            super(false);
            this._width = w;
            this._height = h;
            this.ass = AssetManager.instance.gain(UIDefine.DEFAULT, "Componenet") as AltasAsset;
            this.buildShowItem();
        }
        protected buildShowItem():void
        {
        	var s = this;
            this.bg = new Sprite(this._width, this._height);
            this.bg.altas = this.ass.altas;
            this.bg.altasName = "panel_bg";
            this.addChild(this.bg);

            this.closeBtn = new Sprite(35, 35);
            this.closeBtn.altas = this.ass.altas;
            this.closeBtn.altasName = "close";
            this.closeBtn.mouseEnable = true;
            this.closeBtn.addEventListener(EventBase.MOUSE_DOWN, this, this.onCloseClick);
            this.addChild(this.closeBtn);
            this.resetCloseBtn();
        }
        protected initTitle(str:string):void
        {
            if(this._title == null)
            {
                this._title = new TextField(100, 30);
                this.addChild(this._title);
                this._title.x = 20;
                this._title.y = -5;
            }
            this._title.text = str;
        }
        protected resetCloseBtn():void
        {
        	this.closeBtn.x = this._width - 40;
        	this.closeBtn.y = -5;
        }
        protected onCloseClick(event:EventBase):void
        {
        	this.hide();
        }
        public hide():void
        {
        	if(this.parent != null)
        	{
        		this.parent.removeChild(this);
        	}
        }
        public get width():number
        {
            return this._width;
        }
        public get height():number
        {
            return this._height;
        }
    }
}