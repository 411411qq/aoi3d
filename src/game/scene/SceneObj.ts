module aoi {
    export class SceneObj extends Object3DContainer
    {
        private sky:SkyBox;
        constructor() {
            super(false);
        }
        public initFromAsset(sa:SceneAsset)
        {
            var list = sa.getObjList();
            this.buildSceneTarget(list, this, sa);
        }
        private buildSceneTarget(list:Object, p:Object3DContainer, sa:SceneAsset)
        {
            var o:Object3DContainer;
            if(list["geoName"] == null)
            {
                o = new Object3DContainer(false);
            }
            else
            {
                o = new SceneThing(sa.getGeo(list["geoName"]), list["textureName"]);
                (o as Mesh).addPlugin(new aoi.PlunginSimple());
                (o as Mesh).addPlugin(new aoi.PlunginKillAlpha(0,0.7));
                let fog:aoi.PlunginFog = new aoi.PlunginFog();
                fog.setFogColor(0,0,0);
                fog.setFogData(20, 150);
                (o as Mesh).addPlugin(fog);
                (o as Mesh).getPluginCollector(Define.CAM_NORMAL).setParamMode(PlunginDefine.NORMAL, true, true, true);
            }
            o.name = list["name"];
            o.x = list["px"];
            o.y = list["py"];
            o.z = list["pz"];

            o.rotationX = list["rx"];
            o.rotationY = list["ry"];
            o.rotationZ = list["rz"];

            o.scaleX = list["sx"];
            o.scaleY = list["sx"];
            o.scaleZ = list["sx"];
            var childNum = list["children"]["length"];
            for(var i:number = 0; i<childNum; i++)
            {
                this.buildSceneTarget(list["children"][i], o, sa);
            }
            p.addChild(o);
        }
    }
    export class SceneThing extends Mesh
    {
        private _textureName:string;
        private _fullPath:string;
        private _textureRes:TextureAsset;
        constructor(geo:Geometry, textureName:string) {
            super(geo, null, false);
            this._textureName = textureName;
            this._fullPath = "res/scene/xinshoucun/"+textureName+".png";
            AssetManager.instance.fetch(this._fullPath, AssetDefine.ASSET_TEXTURE, this, this.onImgLoaded);
        }
        private onImgLoaded(param:LoaderData)
        {
            this._textureRes = AssetManager.instance.gain(param.path, "scene") as TextureAsset;
            this.material = new aoi.Material(this._textureRes.texture);
        }
        public dispose():void
        {
            if(this._textureRes != null)
            {
                AssetManager.instance.returnAsset(this._textureRes, "scene");
                this._textureRes = null;
            }
            AssetManager.instance.removeFetch(this._fullPath, AssetDefine.ASSET_TEXTURE, this, this.onImgLoaded);
            super.dispose();
        }
    }
}