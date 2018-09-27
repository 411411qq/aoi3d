module aoi {
    export class ImageAsset extends AbstractAsset {
        private blob:Blob;
        private _srcData:string;

        constructor() {
            super();
        }

        public initData(loaderData:LoaderData):void {
            super.initData(loaderData);
            this.blob = loaderData.data as Blob;
            this._srcData = window.URL.createObjectURL(loaderData.data);
        }

        public get srcData():string {
            return this._srcData;
        }

        public dispose():void {
            super.dispose();
            this.blob = null;
            this._srcData = null;
        }
    }
}