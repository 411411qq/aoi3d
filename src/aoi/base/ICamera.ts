module aoi {
    import Vector3D = math.Vector3D;
    import Matrix4 = math.Matrix4;
    export interface ICamera {
        position:Vector3D;
        viewProjection:Matrix4;
        unproject(mX:number, mY:number, mZ:number):Vector3D;
        lookAt(target:Vector3D, upAxis:Vector3D):void;
        lightOfSight:Vector3D;
        rotationX:number;
        rotationY:number;
        rotationZ:number;
        invertTransform:Matrix4;
        transform:Matrix4;
        projection:ProjectionBase;
        faceCamTransform:Matrix4;
        targetPos:Vector3D;
        x:number;
        y:number;
        z:number;
    }
}