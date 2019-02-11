module aoi {
    export class GlobelConst {
        public static nowTime:number = 0;
        public static renderNum:number = 0;
        public static frameNum = 0;
        public static gl:WebGLRenderingContext = null;
        public static eventDispatcher:base.EventDispatcher = new base.EventDispatcher();
        public static view:View;

        public static tempValue:number = 0;
    }
}