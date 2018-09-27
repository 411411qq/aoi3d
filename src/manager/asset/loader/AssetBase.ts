module aoi {
    export class AssetBase extends base.EventDispatcher {
        public path:string;
        public type:number;
        private _priority:number;

        constructor(path:string, type:number, priority:number) {
            super();
            this.path = path;
            this.type = type;
            this._priority = priority;
        }

        public set priority(value:number) {
            this._priority = value;
        }

        public get priority():number {
            return this._priority;
        }
    }
    export class LoaderData extends AssetBase {
        private callbacks:Array<base.Callback>;
        public data:Blob|ArrayBuffer|string;
        constructor(path:string, type:number, priority:number) {
            super(path, type, priority);
            this.callbacks = [];
        }

        public pushCallback(owner:Object, callback:Function, callbackParam:Object) :void {
            var isIn:boolean = false, i:number = 0, len:number = this.callbacks.length;
            for (i = 0; i < len; i++) {
                if (this.callbacks[i].isSame(owner, callback, callbackParam) == true) {
                    isIn = true;
                    break;
                }
            }
            if (isIn == false)this.callbacks.push(new base.Callback(owner, callback, callbackParam));
        }

        public removeCallBack(owner:Object, callback:Function, callbackParam:Object):void {
            var i:number = 0, len:number = this.callbacks.length;
            for (i = 0; i < len; i++) {
                if (this.callbacks[i].isSame(owner, callback, callbackParam) == true) {
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
                this.callbacks[i].exec(this);
            }
        }

        public emptyCallbacks():void {
            this.callbacks.length = 0;
        }

        public isSame(p, t):boolean {
            return this.path == p && this.type == t;
        }

        public getLoaderType():number {
            return LoaderData.getLoaderType(this.type);
        }

        static getLoaderType(type:number):number {
            var rs = 0;
            switch (type) {
                case AssetDefine.ASSET_IMG:
                case AssetDefine.ASSET_TEXTURE:
                    rs = 0;
                    break;
                case AssetDefine.ASSET_EGD:
                case AssetDefine.ASSET_OBJ_BY:
                case AssetDefine.ASSET_MD5ANIM_BY:
                case AssetDefine.ASSET_MD5MESH_BY:
                case AssetDefine.ASSET_MC3:
                case AssetDefine.ASSET_BSP:
                case AssetDefine.ASSET_ALTAS:
                case AssetDefine.ASSET_SCENE:
                    rs = 2;
                    break;
            }
            return rs;
        }
    }
}