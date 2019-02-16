module aoi 
{
    export class SkyBox extends Mesh
    {
        private urls:Array<string>;
        private reses:Array<ImageAsset>;
        private loadedNum:number = 0;
        private cubeTexture:CubeTexture;
        private size:number;

        private skyRes:SkyBoxPluralAsset;

        constructor(urls:Array<string>, size:number) {
            super(null, null, false);
            this.urls = urls;
            this.reses = [];
            this.size = size;
            PluralAssetManager.instance.fetch(this.urls, AssetDefine.ASSET_SKYBOX, this, this.onImageLoaded);
        }

        private onImageLoaded(key:string, obj:Object)
        {
            this.skyRes = PluralAssetManager.instance.gain(key, "SkyBox") as SkyBoxPluralAsset;
            this.cubeTexture = this.skyRes.cubeTexture;
            this.setShowInCameraState(Define.CAM_NORMAL, true);
            this.geometry = new CubeGeometry(this.size,this.size,this.size);
            this.material = new Material(this.cubeTexture);
            this.addPlugin(new aoi.PlunginSkyBox());
            this.getPluginCollector(Define.CAM_NORMAL).setParamMode(PlunginDefine.NORMAL, false, true, true);
        }
        public dispose():void
        {
            super.dispose();
            if(this.urls != null)
            {
                PluralAssetManager.instance.removeFetch(this.urls, this, this.onImageLoaded);
                this.urls = null;
            }
            if(this.skyRes != null)
            {
                PluralAssetManager.instance.returnAsset(this.skyRes, "SkyBox");
                this.skyRes = null;
            }
        }
    }
}