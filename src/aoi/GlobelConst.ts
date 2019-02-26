module aoi {
    export class GlobelConst {
        public static nowTime:number = 0;
        public static renderNum:number = 0;
        public static frameNum = 0;
        public static gl:WebGLRenderingContext = null;
        public static eventDispatcher:base.EventDispatcher = new base.EventDispatcher();
        public static view:View;

        public static tempValue:number = 0;

        public static canUseFloatingPointLinearFiltering():boolean
        {
            return !!GlobelConst.gl.getExtension('OES_texture_float_linear');
        }
        public static canUseHalfFloatingPointLinearFiltering():boolean
        {
            return !!GlobelConst.gl.getExtension('OES_texture_half_float_linear');
        }
    }
}