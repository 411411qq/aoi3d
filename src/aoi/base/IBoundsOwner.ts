module aoi {
    import Matrix4 = math.Matrix4;
    import Vector3D = math.Vector3D;
    export interface IBoundsOwner {
        bound:BoundingVolumeBase;
        updateBound():void;
        transform:Matrix4;
        position:Vector3D;
        sceneTransform:Matrix4;
        inverseSceneTransform:Matrix4;
    }
}