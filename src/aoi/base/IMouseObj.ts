module aoi {
    import Matrix4 = math.Matrix4;
    import Vector3D = math.Vector3D;
    import EventBase = base.EventBase;
    export interface IMouseObj {
        visible:boolean;
        mouseEnable:boolean;
        transform:Matrix4;
        pickingCollisionVO:PickingCollisionVO;
        collidesBefore(shortestCollisionDistance:number, findClosest:boolean):boolean;
        bound:BoundingVolumeBase;
        pickingCollider:IPickingCollider;
        inverseSceneTransform:Matrix4;
        getMousePosition(x:number, y:number, view:View):Vector3D;
        dispatchEvent(evt:EventBase):void;
    }
}