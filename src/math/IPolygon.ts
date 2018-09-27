module math {
    export interface IPolygon {
        pointInPoly(p:Vector3D):Boolean;
        position:Vector3D;
        normal:Vector3D;
        centre:Vector3D;
        distance:number;
        edageLenSquaredList:Array<Number>;
        edageList:Array<Line3d>;
        pointList:Array<Vector3D>;
        calEdageClosePoint(point:Vector3D, result:Vector3D):Vector3D;
        checkRayCollision(pos:Vector3D, dir:Vector3D):Vector3D;
        caculatePointDis(p:Vector3D):Number;
        pointNum:number;
        caculatePolygonSide(poly:IPolygon):number;
    }
}