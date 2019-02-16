module aoi
{
    import EventBase = base.EventBase;
    import Util = base.Util;
    import Vector3D = math.Vector3D;
    import TextField = aoi.TextField;
    export class ComponenetBase extends UiConainer
    {
        protected ass:AltasAsset;
        protected _width:number;
        protected _height:number;
        constructor(width:number, height:number)
        {
            super(false);
            this.ass = AssetManager.instance.gain(UIDefine.DEFAULT, "Componenet") as AltasAsset;
            this._width = width;
            this._height = height;
            this.buildItem();
        }
        protected buildItem():void
        {

        }
        public dispose():void
        {
            super.dispose();
            if(this.ass != null)
            {
                AssetManager.instance.returnAsset(this.ass, "Componenet");
            }
        }
    }
    export class TextInput extends ComponenetBase
    {
        private bg:Sprite;
        private text:TextField;
        private input:HTMLInputElement;
        private inputTime:number;
        private _fun:Function;
        private _str:string = "";
        constructor(width:number, height:number)
        {
            super(width, height);
        }
        public dispose():void
        {
            super.dispose();
            this.bg.dispose();
            this.text.dispose();
        }
        public set str(value:string)
        {
            this._str = value;
            this.text.text = this._str;
        }
        public get str():string
        {
            return this._str;
        }
        protected buildItem():void
        {
            this.bg = new Sprite(this._width, this._height);
            this.bg.altas = this.ass.altas;
            this.bg.altasName = "input_bg";
            this.bg.mouseEnable = true;
            var s = this;
            this.bg.addEventListener(EventBase.MOUSE_DOWN, this, this.onMouseDown);
            this.addChild(this.bg);

            this.text = new TextField(this._width - 10, this._height - 4);
            this.text.x = 5;
            this.text.y = - 2;
            this.text.text = this._str;
            this.addChild(this.text);

            let collect:PlunginCollecter = this.text.getPluginCollector(Define.CAM_2D);
            var pmm:PlunginModelMatrix = new PlunginModelMatrix();
            collect.addPlugin(pmm);
            var pm:PlunginMask = new PlunginMask();
            pm.setRect(0,-this._height,this._width - 10,this._height, this.text);
            collect.addPlugin(pm);
        }
        protected onMouseDown(event:EventBase)
        {
            var v:Vector3D = new Vector3D();
            v.setTo(0, 0, 0);
            v = this.sceneTransform.transformVector(v);
            this.input = Util.showTextInput(this._str, GlobelConst.view.width / 2 + v.x + 5, GlobelConst.view.height / 2 - v.y, this._width, this._height);
            var s = this;
            this._fun = function (event:EventBase) {
                s.onMouseAct(event);
            }
            this.text.visible = false;
            if(this._fun != null)GlobelConst.eventDispatcher.addEventListener(EventBase.MOUSE_ACT, this, this._fun);
            this.inputTime = GlobelConst.nowTime;
        }
        protected onMouseAct(evt:EventBase)
        {
            if(evt.data["type"] == "click" && GlobelConst.nowTime - this.inputTime > 200)
            {
                GlobelConst.eventDispatcher.removeEventListener(EventBase.MOUSE_ACT, this, this._fun);
                this._fun = null;
                this.str = this.input.value;
                this.text.visible = true;
                Util.hideTextInput();
            }
        }
    }
    export class CheckBox extends ComponenetBase
    {
        private cbox:Sprite;
        private text:TextField;
        private _selected:boolean;
        constructor(width:number, height:number)
        {
            super(width, height);
            this._width = Math.max(this._width, 50);
            this._height = Math.max(this._height, 50);
            this._selected = false;
        }
        public dispose():void
        {
            super.dispose();
            this.cbox.dispose();
            this.text.dispose();
        }
        protected buildItem():void
        {
            this.cbox = new Sprite(23,23);
            this.cbox.name = "CBox";
            this.cbox.altas = this.ass.altas;
            this.cbox.altasName = "checkbox_not";
            this.cbox.mouseEnable = true;
            this.cbox.addEventListener(EventBase.MOUSE_DOWN, this, this.onMouseDown);
            this.addChild(this.cbox);

            this.text = new TextField(this._width - 23,16);
            this.text.name = "CLabel";
            this.text.x = 20;
            this.text.y = 0;
            this.text.mouseEnable = true;
            this.text.addEventListener(EventBase.MOUSE_DOWN, this, this.onTxtMouseDown);
            this.addChild(this.text);
        }
        public setLabel(str:string):void
        {
            this.text.text = str;
        }
        public get selected():boolean
        {
            return this._selected;
        }
        public set selected(value:boolean)
        {
            this._selected = value;
            if(this._selected == true)
            {
                this.cbox.altasName = "checkbox_selected";
            }
            else
            {
                this.cbox.altasName = "checkbox_not";
            }
        }
        private onMouseDown(event:EventBase):void
        {
            this.selected = !this._selected;
            console.log("onMouseDown");
        }
        private onTxtMouseDown(event:EventBase):void
        {
            this.selected = !this._selected;
            console.log("onTxtMouseDown");
        }
        public set enable(value:boolean)
        {
            this.cbox.mouseEnable = value;
        }
    }
    export class DrawList extends ComponenetBase
    {
        private _data:Array<any>;
        private _items:Array<ListItem>;
        private _rowNum:number;
        private _rowInterval:number;
        private _colInterval:number;
        private _perWidth:number;
        private _perHeight:number;
        constructor(width:number, height:number)
        {
            super(width, height);
            this._items = [];
        }
        public initLayoutData(rowNum:number, rowInterval:number, colInterval:number, perWidth:number, perHeight:number)
        {
            this._rowNum = rowNum;
            this._rowInterval = rowInterval;
            this._colInterval = colInterval;
            this._perWidth = perWidth;
            this._perHeight = perHeight;
        }
        public set data(value:Array<any>)
        {
            this._data = value;
            this.clearItems();
            var i:number = 0, len:number = this._data.length;
            for(i = 0; i<len; i++)
            {
                var item:ListItem = new aoi.ListItem(this._perWidth, this._perHeight);
                item.data = this._data[i];
                var xindex:number = i % this._rowNum;
                var yindex:number = Math.floor(i / this._rowNum);
                item.x = xindex * this._colInterval;
                item.y = - this._rowInterval * yindex;
                this.addChild(item);
                this._items.push(item);
            }

        }
        private clearItems():void
        {
            while(this._items.length > 0)
            {
                this._items[0].dispose();
                this._items.shift();
            }
        }
    }
    export class ListItem extends ComponenetBase
    {
        private _data:any;
        private txt:TextField;
        constructor(width:number, height:number)
        {
            super(width, height);
        }
        protected buildItem():void
        {
            this.txt = new aoi.TextField(100,30);
            this.addChild(this.txt);
        }
        public set data(value:Object)
        {
            this._data = value;
            this.txt.text = value.toString();
        }
    }
    export class InputItem extends ComponenetBase
    {
        private label:TextField;
        private input:TextInput;
        constructor(width:number, height:number)
        {
            super(width, height);
        }
        protected buildItem():void
        {
            this.label = new TextField(50,30);
            this.addChild(this.label);
            this.input = new TextInput(100,30);
            this.input.x = 60;
            this.addChild(this.input);
        }
        public setLabel(value:string):void
        {
            this.label.text = value;
        }
    }
}