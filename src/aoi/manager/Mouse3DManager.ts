module aoi {
    import EventBase = base.EventBase;
    export class Mouse3DManager {
        private _pre_objs:Array<IMouseObj>;
        private _lastOverObj:IMouseObj;
        private _cur_obj:IMouseObj;
        private _mousePicker:RaycastPicker;
        private _uiMousePicker:UiMousePicker;
        private _fun:Function;
        private _type:number = 0;

        public lastCheckTime:number;

        constructor() {
            this._uiMousePicker = new UiMousePicker();
            this.lastCheckTime = 0;
            this._cur_obj = null;
            this._pre_objs = [];
            this._lastOverObj = null;
        }

        public init(view:View, meshDataCheck:boolean = false):void {
            this._mousePicker = new RaycastPicker();
            this.meshDataCheck = meshDataCheck;
        }

        public set meshDataCheck(value:boolean) {
            this._mousePicker.meshDataCheck = value;
        }

        public updateCollider(view:View, rootList:RenderList, root2dList:RenderList):void {
            var nObj;
            nObj = this._uiMousePicker.getViewCollision(view.mouseX, view.mouseY, view, root2dList);
            if(nObj == null)
            {
                nObj = this._mousePicker.getViewCollision(view.mouseX, view.mouseY, view, rootList);
            }
            if(nObj != null)
            {
                if (nObj != this._cur_obj)
                {
                    if(this._cur_obj != null)this._pre_objs.push(this._cur_obj);
                    this._cur_obj = nObj;
                }
            }
            else
            {
                if(this._cur_obj != null)this._pre_objs.push(this._cur_obj);
                this._cur_obj = null;
            }
        }

        public enableMouseListeners():void {
            var s = this;
            if(this._fun == null)
            {
                this._fun = function(evt){s.onDispatchEvent(evt);}
                GlobelConst.eventDispatcher.addEventListener(EventBase.MOUSE_ACT, this, this._fun);
            }
        }

        public disableMouseListeners():void {
            if(this._fun != null)
            {
                GlobelConst.eventDispatcher.removeEventListener(EventBase.MOUSE_ACT,this, this._fun);
            }

        }

        private onDispatchEvent(evt:EventBase):void {
            this.dispatchMouseOutEvent();
            if (this._cur_obj == null) {
                this._lastOverObj = null;
                return;
            }
            if (this._lastOverObj != this._cur_obj) {
                this._lastOverObj = this._cur_obj;
                this._cur_obj.dispatchEvent(new EventBase(EventBase.MOUSE_OVER));
                return;
            }
            var type:string;
            switch (evt.data["type"]) {
                case "click":
                case "touch":
                    type = EventBase.CLICK;
                    break;
                case "mousedown":
                case "touchstart":
                    type = EventBase.MOUSE_DOWN;
                    break;
                case "mousemove":
                case "touchmove":
                    type = EventBase.MOUSE_MOVE;
                    break;
                case "mouseup":
                case "touchcancel":
                    type = EventBase.MOUSE_UP;
                    break;
            }
            this._cur_obj.dispatchEvent(new EventBase(type));
        }

        private dispatchMouseOutEvent():void {
            var i = 0, len = this._pre_objs.length;
            for (i = 0; i < len; i++) {
                this._pre_objs[i].dispatchEvent(new EventBase(EventBase.MOUSE_OUT));
            }
            this._pre_objs.length = 0;
        }
    }
}