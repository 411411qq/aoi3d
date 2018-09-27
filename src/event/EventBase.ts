module base {
    export class EventBase {
        public type:string;
        public data:Object;
        public curTarget:EventDispatcher;

        constructor(type:string, data:Object = null) {
            this.data = data;
            this.type = type;
        }

        static CHANGES:string = "EVNT_CHANGE";
        static CONTEXT_DISPOSE:string = "EVNT_CONTEXT_DISPOSE";
        static ENTER_FRAME:string = "EVNT_ENTER_FRAME";
        static LOADED:string = "EVNT_LOADED";
        static LOAD_ERROR:string = "EVNT_ERROR";
        static COMPLETE:string = "EVENT_COMPLETE";
        static ACTION_END:string = "EVENT_ACTION_END";
        static ACTION_START:string = "EVENT_ACTION_START";
        static MOUSE_ACT:string = "EVENT_MOUSE_ACT";
        static CLICK:string = "MouseEvent3D_click";
        static MOUSE_UP:string = "MouseEvent3D_up";
        static MOUSE_DOWN:string = "MouseEvent3D_down";
        static MOUSE_MOVE:string = "MouseEvent3D_move";
        static MOUSE_OVER:string = "MouseEvent3D_over";
        static MOUSE_OUT:string = "MouseEvent3D_out";
        static MOUSE_WHEEL:string = "MouseEvent3D_mouse_wheel";
        static WIN_RESIZE:string = "EVENT_WIN_RESIZE";
    }
}