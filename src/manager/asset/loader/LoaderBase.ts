module aoi {
    export class LoaderBase extends base.EventDispatcher {
        protected event:base.EventBase;
        protected errorEvent:base.EventBase;
        protected loaderData:LoaderData;
        protected request:XMLHttpRequest;
        public state:number;

        constructor() {
            super();
            this.event = new base.EventBase(base.EventBase.LOADED);
            this.errorEvent = new base.EventBase(base.EventBase.LOAD_ERROR);
            this.loaderData = null;
            this.request = new XMLHttpRequest();
            this.state = AssetDefine.LOAD_STATUS_IDLE;
        }

        public loadData(data) {
            var s = this;
            this.request.abort();
            this.request.onreadystatechange = function () {
                if (s.request.readyState == 4 && s.request.status == 200) {
                    s.loaderData.data = this.response;
                    s.event.data = s.loaderData;
                    s.state = AssetDefine.LOAD_STATUS_IDLE;
                    s.dispatchEvent(s.event);
                }
                else if (s.request.readyState == 4 && s.request.status != 200) {
                    s.errorEvent.data = s.loaderData;
                    s.state = AssetDefine.LOAD_STATUS_IDLE;
                    s.dispatchEvent(s.errorEvent);
                }
            };
            this.state = AssetDefine.LOAD_STATUS_BUSY;
            this.setLoaderType();
            this.loaderData = data;
            this.request.open('GET', data.path, true);
            this.request.send();
        }

        protected setLoaderType() {

        }

        public getData() {
            return this.loaderData;
        }
    }
    export class ArrayBufferLoader extends LoaderBase {
        constructor()
        {
            super();
        }
        protected setLoaderType() {
            this.request.responseType = "arraybuffer";
        }
    }
    export class TextLoader extends LoaderBase {
        constructor()
        {
            super();
        }
        protected setLoaderType() {
            this.request.responseType = "text";
        }
    }
    export class MediaLoader extends LoaderBase {
        constructor()
        {
            super();
        }
        protected setLoaderType() {
            this.request.responseType = "blob";
        }
    }
}