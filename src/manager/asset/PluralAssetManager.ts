module aoi {
    export class PluralAssetManager {
        static _instance:PluralAssetManager;
        static get instance() {
            if (PluralAssetManager._instance == null) {
                PluralAssetManager._instance = new PluralAssetManager();
            }
            return PluralAssetManager._instance;
        }
        private _loadingVec:Array<PluralAsset>;
        private _asset_map:Object;
        private _clsDic:Object;
        constructor() 
        {
            this._loadingVec = [];
            this._asset_map = {};
            this._clsDic = {};
            base.FrameTimerManager.instance.add("assetCheck", 60, 0, this, this.checkDispose);

            this.addAssetClass(AssetDefine.ASSET_SKYBOX, SkyBoxPluralAsset);
        }
        public fetch(paths:Array<string>, type:number, owner:Object, callback:Function = null, callbackParam:Object = null, priority:number = 10, lifeTime:number = 12000):void 
        {
            let key:string = PluralAsset.genKey(paths);

            let item:PluralAsset = this._asset_map[key];
            if(item != null)
            {
                if(callback != null && owner != null)
                {
                    callback.call(owner, key, callbackParam);
                }
                return;
            }
            item = this.getLoadingAsset(key);
            if(item != null)
            {
                item.pushCallback(owner, callback, callbackParam);
                return;
            }
            item = new this._clsDic[type](paths, type, priority);
            item.pushCallback(owner, callback, callbackParam);
            this._loadingVec.push(item);
        }
        public removeFetch(paths:Array<string>, owner:Object, callback:Function = null):void
        {
            let key:string = PluralAsset.genKey(paths);
            let item:PluralAsset = this.getLoadingAsset(key);
            if(item != null)
            {
                item.removeCallBack(owner, callback);
            }
        }
        public addAssetClass(type:number, cls):void
        {
            this._clsDic[type] = cls;
        }
        private getLoadingAsset(key:string):PluralAsset
        {
            let len:number = this._loadingVec.length;
            for(var i:number = 0; i < len; i++)
            {
                if(this._loadingVec[i].key == key)
                {
                    return this._loadingVec[i];
                }
            }
            return null;
        }
        public gain(key:string, charge:string):PluralAsset
        {
            return this._asset_map[key];
        }
        public checkDispose()
        {
            let len:number = this._loadingVec.length;
            for(var i:number = 0; i < len; i++)
            {
                let item:PluralAsset = this._loadingVec[i];
                if(item.isDone == true)
                {
                    this._loadingVec.splice(i, 1);
                    len --;
                    i --;
                    this._asset_map[item.key] = item;
                    item.invokeCallbacks();
                }
            }
            for (var key in this._asset_map) {
                var data = this._asset_map[key];
                if (data.canDispose()) {
                    data.dispose();
                    delete this._asset_map[key];
                }
            }
        }
    }
}