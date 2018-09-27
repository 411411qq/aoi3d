module aoi {
    export interface IPicker {
        getViewCollision(x:number, y:number, view:View, renderList:RenderList):IMouseObj;
    }
}