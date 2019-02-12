module aoi {
    export class AssetManager {
        static _instance:AssetManager;
        static get instance() {
            if (AssetManager._instance == null) {
                AssetManager._instance = new AssetManager();
            }
            return AssetManager._instance;
        }

        private _asset_map:Object;
        private _asset_check_map:Object;
        private _assetWaitDic:Object;
        private _parserDic:Object;
        private _loadingVec:Array<any>;
        private _clsDic:Object;
        private _perFrameTime:number;
        private _asset_loader:Array<LoaderBase>;

        constructor() {
            var s = this;
            this._asset_map = {};
            this._asset_check_map = {};
            this._assetWaitDic = {};
            this._asset_loader = [new MediaLoader(), new TextLoader(), new ArrayBufferLoader()];
            this._parserDic = {};
            this._loadingVec = [];
            this._clsDic = {};
            this._perFrameTime = 3;
            var i = 0, len = this._asset_loader.length;
            for (i = 0; i < len; i++) {
                this._asset_loader[i].addEventListener(base.EventBase.LOADED, this, this.onComplete);
                this._asset_loader[i].addEventListener(base.EventBase.LOAD_ERROR, this, this.onError);
            }
            WorkerManager.instance.initWorker(WorkerDefine.ASSET_DECODE, "worker/AssetDecodeWorker.js");

            base.FrameTimerManager.instance.add("assetCheck", 60, 0, function () {
                s.checkDispose()
            });
        }
        public fetchPluralAsset(paths:Array<string>, type:number, owner:Object, callback:Function = null, callbackParam:Object = null, priority:number = 10, lifeTime:number = 12000):void 
        {
            
        }
        public fetch(path:string, type:number, owner:Object, callback:Function = null, callbackParam:Object = null, priority:number = 10, lifeTime:number = 12000):void {
            var loadData;
            if (this.hasAssets(path, type) == true)//检测资源是否在已经加载过
            {
                var assets = this.gain(path, "TEMP_CHARGER");
                if (assets.isReadyAsset() == true) {
                    if (callback != null) {
                        callback(assets.getLoaderData(), callbackParam);
                    }
                    this.returnAsset(assets, "TEMP_CHARGER");
                    return;
                }
                else {
                    loadData = assets.loaderData;
                    if (callback != null)loadData.pushCallback(owner, callback, callbackParam);
                    this.returnAsset(assets, "TEMP_CHARGER");
                    return
                }
            }
            loadData = this.getLoaderData(path, type);
            var isNew = false;
            if (loadData == null) {
                isNew = true;
                loadData = new LoaderData(path, type, priority);
                loadData.lifeTime = lifeTime;
            }
            loadData.priority = priority;
            if (callback != null)loadData.pushCallback(owner, callback, callbackParam);
            var lType = loadData.getLoaderType();
            if (isNew == true)//资源不在加载队列
            {
                if (this._assetWaitDic[lType] == null) {
                    this._assetWaitDic[lType] = [];
                }
                this._assetWaitDic[lType].push(loadData);
            }
            this._assetWaitDic[lType] = this._assetWaitDic[lType].sort(this.onCompare);
            this.startLoad(lType);
        }

        public onCompare(a, b):number {
            return a.priority - b.priority;
        }

        public removeFetch(path:string, type:number, callback:Function):void {
            var loadData;
            loadData = this.getLoaderData(path, type);
            if (loadData != null) {
                if (callback != null)loadData.removeCallBack(callback);
                if (loadData.hasCallBack() == false) {
                    if (this._assetWaitDic[type] != null) {
                        var arr = this._assetWaitDic[type];
                        var i = 0, len = arr.length;
                        for (i = 0; i < len; i++) {
                            if (arr[i] == loadData) {
                                arr.splice(i, 1);
                                break;
                            }
                        }
                    }
                }
            }
        }

        public getLoaderData(path:string, type:number):LoaderData {
            var i = 0, load_data, loaderType = LoaderData.getLoaderType(type), len, key;
            if (this._assetWaitDic[loaderType] != null) {
                len = this._assetWaitDic[loaderType].length;
                for (i = 0; i < len; i++) {
                    load_data = this._assetWaitDic[loaderType][i];
                    if (load_data.isSame(path, type)) {
                        return load_data;
                    }
                }
            }
            len = this._loadingVec.length;
            for (i = 0; i < len; i++) {
                load_data = this._loadingVec[i];
                if (load_data.isSame(path, type)) {
                    return load_data;
                }
            }
            for (key in this._parserDic) {
                load_data = this._parserDic[key].getLoaderData();
                if (load_data != null
                    && load_data.isSame(path, key, type)) {
                    return load_data;
                }
            }
            return null;
        }

        public startLoad(type:number):void {
            var arr = this._assetWaitDic[type];
            if (arr == null) {
                return;
            }
            if (arr.length > 0) {
                var iloader:LoaderBase = this._asset_loader[type];
                if (iloader != null && iloader.state == AssetDefine.LOAD_STATUS_IDLE) {
                    var loadData = arr.pop();
                    iloader.loadData(loadData);
                    this._loadingVec.push(loadData);
                }
            }
        }

        public onComplete(evt:base.EventBase):void {
            var s = AssetManager.instance;
            var curLoader:LoaderBase = evt.curTarget as LoaderBase;
            if (curLoader != null) {
                var loadData = curLoader.getData(), index = s._loadingVec.indexOf(loadData);
                s.addAsset(loadData);
                if (index != -1)s._loadingVec.splice(index, 1);
                var lt = loadData.getLoaderType();
                setTimeout(function () {
                    s.startLoad(lt);
                }, 50)

            }
        }

        public onError(evt:base.EventBase):void {
            var s = AssetManager.instance;
            var curLoader:LoaderBase = evt.curTarget as LoaderBase, loadData;
            if (curLoader != null) {
                loadData = curLoader.getData();
                var index = s._loadingVec.indexOf(loadData);
                if (index != -1) s._loadingVec.splice(index, 1);
                var lt = loadData.getLoaderType();
                setTimeout(function () {
                    s.startLoad(lt);
                }, 50)
            }
            s.dealWithErrorAsset(loadData);
        }

        public dealWithErrorAsset(loadData) {
            if (loadData == null) {
                return;
            }
            if (this._asset_check_map[loadData.path] == null
                || this._asset_check_map[loadData.path] < 3) {//加载重新尝试
                if (this._asset_check_map[loadData.path] == null) {
                    this._asset_check_map[loadData.path] = 0;
                }
                else {
                    this._asset_check_map[loadData.path]++;
                }
                var lt = loadData.getLoaderType();
                this._assetWaitDic[lt].push(loadData);
                (this._assetWaitDic[lt]).sort(this.onCompare);
            }
        }

        public hasAssets(path, type) {
            return this._asset_map[path] != null;
        }

        public addAsset(value) {
            var cls = this._clsDic[value.type];
            if (cls == null) {
                console.log("No such asset type: " + value.type);
                return;
            }
            var fullname = value.path;
            var asset = new cls();
            asset.initData(value);
            asset.lifeTime = value.lifeTime;
            if (asset.needParser == 0) {
                this._asset_map[fullname] = asset;
                asset.parserDone();
            }
            else if (asset.needParser == 1 || asset.needParser == 2) {
                this.addParserAssets(asset);
            }
            else 
            {
                asset.addEventListener(base.EventBase.COMPLETE, this, this.onAssetOk);
            }
        }

        public gain(path:string, changer:string) {
            var asset = this._asset_map[path];
            asset.getOut(changer);
            return asset;
        }

        public returnAsset(data, charger) {
            data.returnTo(charger);
        }

        public checkDispose() {
            for (var key in this._asset_map) {
                var data = this._asset_map[key];
                if (data.canDispose()) {
                    data.dispose();
                    delete this._asset_map[key];
                }
            }
        }

        public addAssetClass(type, cls) {
            this._clsDic[type] = cls;
        }
        private onDoParser(data)
        {
            if (this._parserDic[data.id] == null) {
                return;
            }
            var asset = this._parserDic[data.id];
            delete this._parserDic[data.id];
            if (asset.needParser == 1) {
                asset.initWorkerData(data);
                this._asset_map[asset.path] = asset;
                asset.parserDone();
            }
            else {
                asset.addListener(base.EventBase.COMPLETE, this, this.onAssetOk);
                asset.initWorkerData(data);
            }
        }
        private onAssetOk(event) 
        {
            let asset = event.curTarget;
            this._asset_map[asset.path] = asset;
            asset.parserDone();
            asset.removeEventListener(base.EventBase.COMPLETE, this, this.onAssetOk);
        }
        public addParserAssets(asset) {
            var s = this;
            var id = WorkerManager.instance.sendToWorker(WorkerDefine.ASSET_DECODE, asset.getWorkerData(), this, this.onDoParser);
            this._parserDic[id] = asset;
        }
    }
}