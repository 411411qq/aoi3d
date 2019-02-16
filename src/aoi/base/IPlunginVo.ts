module aoi {
    export interface IPlunginVo extends IDispose {
        key:string;
        limitNum:number;
        type:number;
        index:number;
        pColloct:PlunginCollecter;
        genTextureIndex():void;
        active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void;
        disactive(gl:WebGLRenderingContext, program:WebGLProgram);
        getVertexCode():Array<OpenGlCodeVo>;
        getFragmentCode():Array<OpenGlCodeVo>;
        getAttArr():Array<any>;
        endPlungin():void;
        getPrePlungin():Array<IPlunginVo>;
        getReplaceType():number;
        getReplaceWeight():number;
    }
}