module aoi {
    export class ImageAsset extends AbstractAsset {
        private _img:HTMLImageElement;

        constructor() {
            super();
            this.needParser = 3;
        }

        public initData(loaderData:LoaderData):void {
            super.initData(loaderData);
            var temp = new Image();
            var s = this;
            temp.onload = function () {
                window.URL.revokeObjectURL(temp.src);
                s.dispatchEvent(new base.EventBase(base.EventBase.COMPLETE));
            };
            temp.src = window.URL.createObjectURL(loaderData.data);
            this._img = temp;
        }
        public get img():HTMLImageElement {
            return this._img;
        }
        public dispose():void {
            super.dispose();
            this._img = null;
        }
    }
}