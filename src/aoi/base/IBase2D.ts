module aoi {
    import Rectangle = math.Rectangle;
    export interface IBase2D extends IRenderable {
        x:number;
        y:number;
        width:number;
        height:number;
        rect:Rectangle;
        uvOffsetX:number;
        uvOffsetY:number;
        uvScaleX:number;
        uvScaleY:number;
    }
}