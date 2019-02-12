module aoi {
    export class SkyBoxPluralAsset extends PluralAsset {
        private _cubeTexture:CubeTexture;
        private _imgs:Array<HTMLImageElement>;
        constructor(paths:Array<string>, type:number, priority:number) {
            super(paths, type, priority);
        }
        protected getAssetTypeList():Array<number>
        {
            return [AssetDefine.ASSET_IMG,AssetDefine.ASSET_IMG,AssetDefine.ASSET_IMG,AssetDefine.ASSET_IMG,AssetDefine.ASSET_IMG,AssetDefine.ASSET_IMG];
        }
        protected doWhenAllAssetLoaded():void
        {
            this._imgs = [];
            for(var i:number = 0; i<6; i++)
            {
                this._imgs.push((this._reses[i] as ImageAsset).img);
            }
        }
        public get cubeTexture():CubeTexture
        {
            if(this._cubeTexture == null)
            {
                if(this._imgs == null)
                {
                    return null;
                }
                this._cubeTexture = new CubeTexture(this._imgs);
            }
            return this._cubeTexture;
        }
        public dispose():void
        {
            super.dispose();
            if(this._cubeTexture != null)
            {
                this._cubeTexture.dispose();
                this._cubeTexture = null;
            }
        }
    }
}