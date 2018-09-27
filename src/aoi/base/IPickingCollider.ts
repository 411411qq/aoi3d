module aoi {
    import Vector3D = math.Vector3D;
    export interface IPickingCollider {
        setLocalRay(localPosition:Vector3D, localDirection:Vector3D):void;
        testSubMeshCollision(subGeom:ISubGeometry, pickingCollisionVO:PickingCollisionVO, shortestCollisionDistance:number, ignoreFacesLookingAway:boolean):boolean;
    }
}