module aoi {
    import Vector3D = math.Vector3D;
    import Quaternion = math.Quaternion;
    import EventBase = base.EventBase;
    import ByteArray = base.ByteArray;
    import Endian = base.Endian;
    import PrimitiveBase = aoi.PrimitiveBase;
    export class AbstractAsset extends AssetBase {
        public lastUseTime:number;
        public reference:Object;
        protected _loaderData:LoaderData;
        public needParser:number;
        public lifeTime:number;

        constructor() {
            super(null, null, 0);
            this.lastUseTime = 0;
            this.reference = {};
            this._loaderData = null;
            this.needParser = 0;
        }

        public isReadyAsset():boolean {
            return true;
        }

        public initData(loaderData) {
            this._loaderData = loaderData;
            this.path = loaderData.path;
            this.type = loaderData.type;
            this.lifeTime = loaderData.lifeTime;
            this.priority = loaderData.priority;
            this.lastUseTime = GlobelConst.nowTime;
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

        public haveEle():boolean {
            var key;
            for (key in this.reference) {
                return true;
            }
            return false;
        }

        public canDispose(checkTime):boolean {
            if (!this.haveEle()) {
                if (checkTime == false || GlobelConst.nowTime - this.lastUseTime > this.lifeTime) {
                    return true;
                }
            }
            return false;
        }

        public getOut(str:string):void {
            if (this.haveEle() == false) {
                this.workWhenFirstOneUse();
            }
            if (this.reference[str] == null) {
                this.reference[str] = 0;
            }
            var r_time = this.reference[str] + 1;
            this.reference[str] = r_time;
        }

        public returnTo(str:string):void {
            if (this.reference[str] == null) {
                return;
            }
            var r_time = this.reference[str] - 1;
            this.reference[str] = r_time;
            if (r_time == 0) {
                delete this.reference[str]
            }
            if (!this.haveEle()) {
                this.workWhenNoOneUse();
                this.lastUseTime = GlobelConst.nowTime;
            }
        }

        public workWhenFirstOneUse():void {
        }

        public workWhenNoOneUse():void {
        }

        public dispose():void {
            this._loaderData = null;
        }
    }    
}