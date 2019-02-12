module aoi 
{
    export class PluralAsset extends ReferenceBase
    {
        private _paths:Array<string>;
        private _type:number = 0;
        private _loadedNum:number = 0;
        private _priority:number = 0;
        private _key:string;
        private _isDone:boolean = false;
        protected _reses:Array<AbstractAsset>;

        private callbacks:Array<base.Callback>;

        constructor(paths:Array<string>, type:number, priority:number) {
            super();
            this._paths = paths;
            this._type = type;
            this._priority = priority;
            this._reses = [];

            this.callbacks = [];
            this.initLoadRes();
        }
        protected getAssetTypeList():Array<number>
        {
            return null;
        }
        private initLoadRes():void
        {
            this._isDone = false;
            this._loadedNum = 0;
            let typeList:Array<number> = this.getAssetTypeList();
            if(typeList.length != this._paths.length)
            {   
                throw new Error("not match res");
            }
            let len = this._paths.length;
            for(let i:number = 0; i<len; i++)
            {
                AssetManager.instance.fetch(this._paths[i], typeList[i], this, this.onAssetLoaded, i, this._priority);
            }
        }
        private onAssetLoaded(param:LoaderData, obj:Object)
        {
            var index:number = obj as number;
            var res:AbstractAsset = AssetManager.instance.gain(param.path, "PluralAsset");
            this._reses[index] = res;
            this._loadedNum ++;
            if(this._loadedNum == this._paths.length)
            {
                this.doWhenAllAssetLoaded();
                this._isDone = true;
            }
        }
        protected doWhenAllAssetLoaded():void
        {

        }
        public get isDone():boolean
        {
            return this._isDone;
        }
        public pushCallback(owner:Object, callback:Function, callbackParam:Object) :void {
            var isIn:boolean = false, i:number = 0, len:number = this.callbacks.length;
            for (i = 0; i < len; i++) {
                if (this.callbacks[i].isSame(owner, callback) == true) {
                    isIn = true;
                    break;
                }
            }
            if (isIn == false)this.callbacks.push(new base.Callback(owner, callback, callbackParam));
        }

        public removeCallBack(owner:Object, callback:Function):void {
            var i:number = 0, len:number = this.callbacks.length;
            for (i = 0; i < len; i++) {
                if (this.callbacks[i].isSame(owner, callback) == true) {
                    this.callbacks.splice(i, 1);
                    return;
                }
            }
        }

        public hasCallBack():boolean {
            return this.callbacks.length > 0;
        }

        public invokeCallbacks():void {
            var i:number = 0, len:number = this.callbacks.length;
            for (i = 0; i < len; i++) {
                this.callbacks[i].exec(this.key);
            }
        }

        public emptyCallbacks():void {
            this.callbacks.length = 0;
        }
        public get key():string
        {
            if(this._key == null)
            {
                this._key = PluralAsset.genKey(this._paths);
            }
            return this._key;
        }
        public static genKey(paths:Array<string>):string
        {
            let str:string = "";
            for(let i:number = 0; i < paths.length; i++)
            {
                str += paths[i];
            }
            return base.MD5.hex_md5(str);
        }
        public dispose():void
        {
            this.emptyCallbacks();
            let len = this._paths.length;
            let i:number = 0;
            let typeList:Array<number> = this.getAssetTypeList();
            for(i = 0; i<len; i++)
            {
                AssetManager.instance.removeFetch(this._paths[i], typeList[i], this, this.onAssetLoaded);
            }
            for(i = 0; i<len; i++)
            {
                if(this._reses[i] != null)
                {
                    AssetManager.instance.returnAsset(this._reses[i], "PluralAsset");
                }
            }
        }
    }
}