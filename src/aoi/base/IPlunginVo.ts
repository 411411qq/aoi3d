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
        getVertexCode(renderType:number):Array<OpenGlCodeVo>;
        getFragmentCode(renderType:number):Array<OpenGlCodeVo>;
        getAttArr():Array<any>;
        getPrePlungin():Array<IPlunginVo>;
    }
}