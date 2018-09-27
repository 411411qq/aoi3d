module aoi {
    export class TextureAsset extends AbstractAsset {
        public tm:PicTexture;

        constructor() {
            super();
            this.needParser = 3;
            this.tm = null;
        }

        public get texture():PicTexture {
            return this.tm;
        }

        public initData(loaderData:LoaderData):void {
            super.initData(loaderData);
            var img:HTMLImageElement = new Image();
            var s = this;
            img.onload = function () {
                s.tm = new PicTexture(img);
                s.tm.repreatType = 0;
                s.tm.fiterType = 1;
                window.URL.revokeObjectURL(img.src);
                s.dispatchEvent(new base.EventBase(base.EventBase.COMPLETE));
            };
            img.src = window.URL.createObjectURL(loaderData.data);
        }

        public dispose():void {
            super.dispose();
            if (this.tm != null) {
                this.tm.dispose();
                this.tm = null;
            }
        }
    }
}