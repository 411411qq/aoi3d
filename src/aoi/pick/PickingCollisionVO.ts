module aoi {
    import Vector3D = math.Vector3D;
    import MathUtil = math.MathUtil;
    export class PickingCollisionVO {
        public target:IMouseObj;
        public localPosition:Vector3D;
        public localNormal:Vector3D;
        public localRayPosition:Vector3D;
        public localRayDirection:Vector3D;
        public rayOriginIsInsideBounds:Boolean;
        public rayEntryDistance:number;

        constructor(t:IMouseObj) {
            this.target = t;
        }

        public testSubMeshCollision(sub:ISubGeometry):Boolean {
            var indexLen:number = sub.numTriangles;
            var p0:Vector3D = new Vector3D();
            var p1:Vector3D = new Vector3D();
            var p2:Vector3D = new Vector3D();
            var i0:number, i1:number, i2:number;
            var vertexStride:number = sub.vertexStride;
            for (var i:number = 0; i < indexLen; i++) {
                i0 = sub.getIndexValue(i * 3) * vertexStride;
                i1 = sub.getIndexValue(i * 3 + 1) * vertexStride;
                i2 = sub.getIndexValue(i * 3 + 2) * vertexStride;
                p0.setTo(sub.getVertexValue(i0), sub.getVertexValue(i0 + 1), sub.getVertexValue(i0 + 2));
                p1.setTo(sub.getVertexValue(i1), sub.getVertexValue(i1 + 1), sub.getVertexValue(i1 + 2));
                p2.setTo(sub.getVertexValue(i2), sub.getVertexValue(i2 + 1), sub.getVertexValue(i2 + 2));
                if (MathUtil.checkRayCollisionWithTriangle(p0, p1, p2, this.localRayPosition, this.localRayDirection) != null) {
                    return true;
                }
            }
            return false;
        }
    }
}