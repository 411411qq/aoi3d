module aoi 
{
    export class SkyBox extends Mesh
    {
        private urls:Array<string>;
        private reses:Array<ImageAsset>;
        private loadedNum:number = 0;
        private cubeTexture:CubeTexture;
        private size:number;
        constructor(urls:Array<string>, size:number) {
            super(null, null, false);
            this.urls = urls;
            this.reses = [];
            this.size = size;
            this.loadImages();
        }
        private loadImages()
        {
            var len:number = this.urls.length;
            this.loadedNum = 0;
            for(var i:number = 0;i<len; i++)
            {
                AssetManager.instance.fetch(this.urls[i], AssetDefine.ASSET_IMG, this, this.onImageLoaded, i);
            }
        }
        private onImageLoaded(param:LoaderData, obj:Object)
        {
            var index:number = obj as number;
            var res:ImageAsset = AssetManager.instance.gain(param.path, "SkyBox") as ImageAsset;
            this.reses[index] = res;
            this.loadedNum ++;
            if(this.loadedNum == this.urls.length)
            {
                var imgs:Array<HTMLImageElement> = [];
                for(var i:number = 0; i<this.urls.length; i++)
                {
                    imgs.push(this.reses[i].img);
                }
                this.cubeTexture = new CubeTexture(imgs);
                this.setShowInCameraState(Define.CAM_NORMAL, true);
                this.geometry = new CubeGeometry(this.size,this.size,this.size);
                this.material = new Material(this.cubeTexture);
                this.addPlugin(new aoi.PlunginSkyBox());
                this.pluginCollector.setParamMode(PlunginDefine.NORMAL, false, true, true);
            }
        }
    }
}