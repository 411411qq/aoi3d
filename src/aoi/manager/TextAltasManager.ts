module aoi {
    import Rectangle = math.Rectangle;
    import Util = base.Util;
    export class TextAltasManager {
        static _instatnce:TextAltasManager;

        static get instance():TextAltasManager {
            if (TextAltasManager._instatnce == null) {
                TextAltasManager._instatnce = new TextAltasManager()
            }
            return TextAltasManager._instatnce;
        }

        private _obj:Object;

        constructor() {
            this._obj = {};
        }

        public getTxtRect(str:string, size:number):Object {
            if (this._obj[size] == null) {
                this._obj[size] = new TextAltas(size);
            }
            var ta:TextAltas = this._obj[size];
            var rs:Array<TextItem> = [], len:number = str.length, i:number;
            for (i = 0; i < len; i++) {
                rs.push(ta.getTxtRect(str.charAt(i)));
            }
            return {ta: ta, rs: rs};
        }
    }
    export class TextAltas {
        static T_WIDTH:number = 512;
        static T_HEIGHT:number = 512;
        private _textCtx:CanvasRenderingContext2D;
        private _perSize:number;
        private _objDic:Object;
        private _pos:number;
        private _texture:TxtTexture;

        constructor(size:number) {
            if (this._textCtx == null) {
                this._textCtx = this.makeTextCanvas(TextAltas.T_WIDTH, TextAltas.T_HEIGHT);
            }
            this._perSize = size;
            this._objDic = {};
            this._pos = 0;
            this._texture = new TxtTexture();
        }

        public get texture():TxtTexture {
            return this._texture;
        }

        private makeTextCanvas(width:number, height:number):CanvasRenderingContext2D {
            this._textCtx = document.createElement("canvas").getContext("2d");
            this._textCtx.canvas.width = width;
            this._textCtx.canvas.height = height;
            this._textCtx.font = "14px monospace";
            this._textCtx.textAlign = "center";
            this._textCtx.textBaseline = "middle";
            this._textCtx.fillStyle = "black";
            this._textCtx.clearRect(0, 0, 0, 0);
            return this._textCtx;
        }

        public getTxtRect(str:string):TextItem {
            if (this._objDic[str] == null) {
                var isChinese:boolean = Util.isChineseChar(str);
                var offset:number = isChinese == true ? 0 : 4;
                var offset_w:number = isChinese == true ? 16 : 8;
                var posX:number = 16 * Math.floor(this._pos / 32);
                var posY:number = 16 * (this._pos % 32);
                this._textCtx.clearRect(posX, posY, 16, 16);
                this._textCtx.fillText(str, posX + 8, posY + 8);

                var item:TextItem = new TextItem();
                item.value = str;
                item.rect = new Rectangle(posX + offset, posY, offset_w, 16);
                item.rectUv = new Rectangle((posX + offset) / TextAltas.T_WIDTH, posY / TextAltas.T_HEIGHT, offset_w / TextAltas.T_WIDTH, 16 / TextAltas.T_HEIGHT);

                this._texture.textCtx = this._textCtx;

                this._pos++;
                this._objDic[str] = item;
            }
            return this._objDic[str];
        }
    }
    export class TextItem {
        public value:string;
        public rect:Rectangle;
        public rectUv:Rectangle;
        public lastTime:number;
    }
}