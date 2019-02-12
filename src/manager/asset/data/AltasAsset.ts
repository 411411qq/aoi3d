module aoi {
    export class AltasAsset extends AbstractAsset {
        private _altas:Altas;
        private tmAss:TextureAsset;

        constructor() {
            super();
            this.needParser = 3;
        }

        public get altas():Altas {
            return this._altas;
        }

        public initData(loaderData:LoaderData):void {
            super.initData(loaderData);
            this._altas = new Altas();
            var by:base.ByteArray = new base.ByteArray(loaderData.data as ArrayBuffer, base.Endian.BIG_ENDIAN);
            this._altas.width = by.readShort();
            this._altas.height = by.readShort();
            var len:number = by.readShort(), i:number = 0;
            for (i = 0; i < len; i++) {
                var ad:AltasData = new AltasData();
                ad.isNine = by.readByte();
                ad.name = by.readString();
                ad.x = by.readShort();
                ad.y = by.readShort();
                ad.width = by.readShort();
                ad.height = by.readShort();

                ad.top = by.readShort();
                ad.bottom = by.readShort();
                ad.left = by.readShort();
                ad.right = by.readShort();

                ad.setUvData(this._altas.width, this._altas.height);
                this._altas.setAltasData(ad);
            }
            var s = this;
            var path:string = loaderData.path.replace("ual", "png");
            AssetManager.instance.fetch(path, AssetDefine.ASSET_TEXTURE, this, this.onImgLoaded);
        }

        private onImgLoaded(param:LoaderData):void {
            this.tmAss = AssetManager.instance.gain(param.path, "AltasAsset") as TextureAsset;
            this._altas.material = new Material(this.tmAss.texture);
            this.dispatchEvent(new base.EventBase(base.EventBase.COMPLETE));
        }

        public dispose():void {
            super.dispose();
            if (this.tmAss != null) {
                AssetManager.instance.returnAsset(this.tmAss, "AltasAsset");
                this.tmAss = null;
            }
        }
    }
}