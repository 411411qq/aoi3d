module aoi {
    import Vector3D = math.Vector3D;
    import Quaternion = math.Quaternion;
    import EventBase = base.EventBase;
    import ByteArray = base.ByteArray;
    import Endian = base.Endian;
    import PrimitiveBase = aoi.PrimitiveBase;
    export class AbstractAsset extends AssetBase {
        
        protected _loaderData:LoaderData;
        public needParser:number;
        constructor() {
            super(null, null, 0);
            this._loaderData = null;
            this.needParser = 0;
        }

        public isReadyAsset():boolean {
            return true;
        }

        public initData(loaderData) {
            super.initData(loaderData);
            this._loaderData = loaderData;
            this.path = loaderData.path;
            this.type = loaderData.type;
            this.priority = loaderData.priority;
        }

        public getLoaderData() {
            return this._loaderData;
        }

        public parserDone():void {
            if (this._loaderData != null) {
                this._loaderData.invokeCallbacks();
                this._loaderData.emptyCallbacks();
            }
        }
        public dispose():void {
            this._loaderData = null;
        }
    }    
}