module aoi {
    export interface IMaterial {
        getTextures(gl:WebGLRenderingContext):Object;
        getOffsetData():math.Vector3D;
        setData(scale_x:number, scale_y:number, offset_x:number, offset_y:number):void;
    }
}