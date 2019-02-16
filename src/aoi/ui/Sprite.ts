module aoi
{
    import Mesh = aoi.Mesh;
    import PlaneGeometry = aoi.PlaneGeometry;
    import SliceGeometry = aoi.SliceGeometry;
    import Altas = aoi.Altas;
    import AltasData = aoi.AltasData;
    import PlunginUvOffset = aoi.PlunginUvOffset;
    import Rectangle = math.Rectangle;
    import EventBase = base.EventBase;
    import Vector3D = math.Vector3D;
    import TextAltas = aoi.TextAltas;
    import VectorArray = base.VectorArray;
    export class Sprite extends Mesh implements IBase2D
    {
        protected _width:number;
        protected _height:number;
        protected _altas:Altas;
        protected _ad:AltasData;
        protected _altasName:string = "";
        protected _rect:Rectangle;
        protected geo:Geometry;
        constructor(width:number, height:number)
        {
            super(null, null, true);
            this._rect = new Rectangle(0,0,width,height);
            this._rect.y = - height;
            this.width = width;
            this.height = height;
            let collect:PlunginCollecter = this.getPluginCollector(Define.CAM_2D);
            collect.addPlugin(new PlunginSimple())
            collect.setParamMode(PlunginDefine.NORMAL, true, true);
            this.setShowInCameraState(Define.CAM_2D, true);
        }
        public get rect():Rectangle
        {
            return this._rect;
        }
        public createRenderList(context:WebGLRenderingContext, camera:ICamera, renderType:number, renderList:RenderList, checkInFrustum:boolean = true):void
        {
            if(this._ad != null && this.geo == null)
            {
                if(this._ad.isNine == 1)
                {
                    if(this.geo == null)
                    {
                        this.geo = new SliceGeometry();
                    }
                    (this.geo as SliceGeometry).setSliceData(this._width, this._height, this._ad.width, this._ad.height,
                        this._ad.top, this._ad.bottom, this._ad.left, this._ad.right);
                    this.geometry = this.geo;
                }
                else
                {
                    if(this.geo == null)
                    {
                        this.geo = new PlaneGeometry(this._width, this._height, Define.XY, PlaneGeometry.LEFT_T);
                    }
                    this.geometry = this.geo;
                }
            }
			super.createRenderList(context, camera, renderType, renderList, checkInFrustum);
        }
        protected invalidGeo()
        {
            if(this.geo != null)
            {
                this.geo.dispose();
                this.geo = null;
            }
            this.geometry = null;
        }
        public set width(value:number)
        {
            this._width = value;
            this._rect.width = value;
            this.invalidGeo();
        }
        public get width():number
        {
            return this._width;
        }
        public set height(value:number)
        {
            this._height = value;
            this._rect.height = value;
            this._rect.y = - value;
            this.invalidGeo();
        }
        public get height():number
        {
            return this._height;
        }
        public set altas(value:Altas)
        {
            this._altas = value;
            this.material = value.material;
            this.initMaterial();
        }
        public set altasName(value:string)
        {
            this._altasName = value;
            this.initMaterial();
        }
        public get uvOffsetX():number
        {
            return this._ad.uvOffsetX;
        }
        public get uvOffsetY():number
        {
            return this._ad.uvOffsetY;
        }
        public get uvScaleX():number
        {
            return this._ad.uvScaleX;
        }
        public get uvScaleY():number
        {
            return this._ad.uvScaleY;
        }
        protected initMaterial():void
        {
            if(this._altas != null)
            {
                this._ad = this._altas.getAltasData(this._altasName);
                if(this._ad != null)
                {
                    let collect:PlunginCollecter = this.getPluginCollector(Define.CAM_2D);
                    var  puv:PlunginUvOffset = new PlunginUvOffset();
                    puv.setData(this._ad.uvOffsetX, this._ad.uvOffsetY, this._ad.uvScaleX, this._ad.uvScaleY);
                    collect.addPlugin(puv);
                }
            }
        }
        public dispose()
        {
            super.dispose();
            if(this.geo != null)
            {
                this.geo.dispose();
                this.geo = null;
            }
        }
    }
    export class Button extends Sprite {
        private _normal:string;
        private _horver:string;
        private _clicked:string;
        private _enable:boolean;
        private _label:TextField;

        constructor(width:number, height:number, labelTxt:string = "") {
            super(width, height);
            this.mouseEnable = true;
            var s = this;
            this.addEventListener(EventBase.MOUSE_OVER, this, this.onMouseOver);
            this.addEventListener(EventBase.MOUSE_OUT, this, this.onMouseOut);
            this.addEventListener(EventBase.MOUSE_DOWN, this, this.onMouseDown);
            this.addEventListener(EventBase.MOUSE_UP, this, this.onMouseUp);
            this._label = new TextField(width,height);
            this._label.align = TextField.CENTER;
            this._label.text = labelTxt;
            this.addChild(this._label);
        }

        private onMouseOver(event:EventBase):void {
            this.altasName = this._horver;
        }

        private onMouseOut(event:EventBase):void {
            this.altasName = this._normal;
        }

        private onMouseDown(event:EventBase):void {
            this.altasName = this._clicked;
        }

        private onMouseUp(event:EventBase):void {
            var vec:Vector3D = new Vector3D(GlobelConst.view.mouseX, GlobelConst.view.mouseY, 0);
            vec = this.inverseSceneTransform.transformVector(vec);
            if (this.rect.containPoint2(vec.x, vec.y) == true) {
                this.altasName = this._horver;
            }
            else {
                this.altasName = this._normal;
            }

        }

        public set enable(value:boolean) {
            this._enable = value;
        }

        public get enable():boolean {
            return this._enable;
        }

        public set normal(value:string) {
            this._normal = value;
            this.altasName = this._normal;
        }

        public set horver(value:string) {
            this._horver = value;
        }

        public set clicked(value:string) {
            this._clicked = value;
        }
    }
    export class TextField extends Mesh implements IBase2D
    {
        static LEFT:number = 1;
        static CENTER:number = 2;
        static RIGHT:number = 3;

        private _text:string;
        private _width:number;
        private _height:number;
        private _rect:Rectangle;
        public uvOffsetX:number = 0;
        public uvOffsetY:number = 0;
        public uvScaleX:number = 1;
        public uvScaleY:number = 1;
        private geo:PrimitiveBase;
        private _align:number = 1;
        private _txtMat:Material;
        constructor(width:number, height:number)
        {
            super(null, null, true);
            this._rect = new Rectangle(0,0,width,height);
            this.width = width;
            this.height = height;
            let collect:PlunginCollecter = this.getPluginCollector(Define.CAM_2D);
            collect.addPlugin(new PlunginSimple())
            collect.setParamMode(PlunginDefine.NORMAL, true, true);
            this.setShowInCameraState(Define.CAM_2D, true);
        }
        public get rect():Rectangle
        {
            return this._rect;
        }
        public set width(value:number)
        {
            this._width = value;
            this._rect.width = value;
        }
        public get width():number
        {
            return this._width;
        }
        public set height(value:number)
        {
            this._height = value;
            this._rect.height = value;
            this._rect.y = - value;
        }
        public get height():number
        {
            return this._height;
        }
        public set align(value:number)
        {
            this._align = value;
        }
        public set text(value:string)
        {
            if(value == null || value.length == 0)
            {
                this.visible = false;
                return;
            }
            this.visible = true;
            var obj:Object = TextAltasManager.instance.getTxtRect(value, 16);
            var ta:TextAltas = obj["ta"];
            var rs:Array<TextItem> = obj["rs"], i:number, len:number;
            if(this.geo != null)
            {
                this.geo.dispose();
            }
            this.geo = new PrimitiveBase();
            var data:VectorArray = new VectorArray(1, 20*rs.length);
            var indexData:VectorArray = new VectorArray(2, 6*rs.length);
            var curWidth:number = 0;
            var maxWidth:number = 0;
            var curIndex:number = 0;
            var item:TextItem;
            len = rs.length;
            if(this._align != TextField.LEFT)
            {
                for(i = 0; i<len; i++)
                {
                    item = rs[i];
                    maxWidth += item.rect.width;
                }
                if(this._align == TextField.CENTER)
                {
                    curWidth = - maxWidth / 2 + this._width / 2;
                }
                else if(this._align == TextField.RIGHT)
                {
                    curWidth = - maxWidth + this._width;;
                }
            }
            for(i = 0; i<len; i++)
            {
                item = rs[i];
                data.push(curWidth, - item.rect.height, 0,
                    item.rectUv.x, item.rectUv.y + item.rectUv.height);
                data.push(curWidth + item.rect.width, - item.rect.height, 0,
                    item.rectUv.x + item.rectUv.width, item.rectUv.y + item.rectUv.height);
                data.push(curWidth, 0, 0,
                    item.rectUv.x, item.rectUv.y);
                data.push(curWidth + item.rect.width, 0, 0,
                    item.rectUv.x + item.rectUv.width, item.rectUv.y);
                indexData.push(curIndex, curIndex + 1, curIndex + 2);
                indexData.push(curIndex + 1, curIndex + 3, curIndex + 2);
                curIndex += 4;
                curWidth += item.rect.width;
            }
            this.geo.subGeometry.vertexRawData = data.data.buffer;
            this.geo.subGeometry.indexRawData = indexData.data.buffer;

            this.geometry = this.geo;
            if(this._txtMat == null)
            {
                this._txtMat = new Material(null);
            }
            this._txtMat.setTexture(ta.texture);
            this.material = this._txtMat;
        }
    }
}