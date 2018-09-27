module aoi {
    import Vector3D = math.Vector3D;
    import Matrix4 = math.Matrix4;
    export class BoundingVolumeBase {
        public _min:Vector3D;
        public _max:Vector3D;
        public _aabbPoints:Array<number> = [];
        public _aabbPointsDirty:Boolean = true;
        protected _planeMidPoints:Array<Vector3D>;

        constructor() {
            this._min = new Vector3D();
            this._max = new Vector3D();
        }

        public get planeMidPoints():Array<Vector3D> {
            return this._planeMidPoints;
        }

        public get min():Vector3D {
            return this._min;
        }

        public get max():Vector3D {
            return this._max;
        }

        public get aabbPoints():Array<number> {
            if (this._aabbPointsDirty == true) {
                this.updateAABBPoints();
            }
            return this._aabbPoints;
        }

        protected updateAABBPoints():void {
            var maxX:number = this._max.x, maxY:number = this._max.y, maxZ:number = this._max.z;
            var minX:number = this._min.x, minY:number = this._min.y, minZ:number = this._min.z;
            this._aabbPoints[0] = minX;
            this._aabbPoints[1] = minY;
            this._aabbPoints[2] = minZ;
            this._aabbPoints[3] = maxX;
            this._aabbPoints[4] = minY;
            this._aabbPoints[5] = minZ;
            this._aabbPoints[6] = minX;
            this._aabbPoints[7] = maxY;
            this._aabbPoints[8] = minZ;
            this._aabbPoints[9] = maxX;
            this._aabbPoints[10] = maxY;
            this._aabbPoints[11] = minZ;
            this._aabbPoints[12] = minX;
            this._aabbPoints[13] = minY;
            this._aabbPoints[14] = maxZ;
            this._aabbPoints[15] = maxX;
            this._aabbPoints[16] = minY;
            this._aabbPoints[17] = maxZ;
            this._aabbPoints[18] = minX;
            this._aabbPoints[19] = maxY;
            this._aabbPoints[20] = maxZ;
            this._aabbPoints[21] = maxX;
            this._aabbPoints[22] = maxY;
            this._aabbPoints[23] = maxZ;
            this._aabbPointsDirty = false;
        }

        public fromExtremes(minX:number, minY:number, minZ:number, maxX:number, maxY:number, maxZ:number):void {
            this._min.x = minX;
            this._min.y = minY;
            this._min.z = minZ;
            this._max.x = maxX;
            this._max.y = maxY;
            this._max.z = maxZ;
            this._aabbPointsDirty = true;
        }

        public fromSphere(center:Vector3D, radius:number):void {
            this.fromExtremes(center.x - radius, center.y - radius, center.z - radius, center.x + radius, center.y + radius, center.z + radius);
        }

        public rayIntersection(position:Vector3D, direction:Vector3D, targetNormal:Vector3D):number {
            return -1;
        }

        public isInFrustum(camera:ICamera, checkObj:IBoundsOwner):Boolean {
            return false;
        }

        public fromGeometry(geo:Geometry):void {
            var subGeoms:Array<ISubGeometry> = geo.subGeometries;
            var numSubGeoms:number = subGeoms.length;
            if (numSubGeoms <= 0) {
                this.fromExtremes(0, 0, 0, 0, 0, 0);
                return;
            }
            var minX:number, minY:number, minZ:number;
            var maxX:number, maxY:number, maxZ:number;
            minX = minY = minZ = Number.POSITIVE_INFINITY;
            maxX = maxY = maxZ = Number.NEGATIVE_INFINITY;
            for (var i:number = 0; i < numSubGeoms; i++) {
                var sub:ISubGeometry = subGeoms[i];
                var len:number = sub.numVertices;
                var stride:number = sub.vertexStride;
                for (var j:number = 0; j < len; j ++) {
                    var index:number = j * stride;
                    var v:number = sub.getVertexValue(index);
                    if (v < minX) minX = v;
                    else if (v > maxX) maxX = v;
                    v = sub.getVertexValue(index + 1);
                    if (v < minY) minY = v;
                    else if (v > maxY) maxY = v;
                    v = sub.getVertexValue(index + 2);
                    if (v < minZ) minZ = v;
                    else if (v > maxZ) maxZ = v;
                }
            }
            this.fromExtremes(minX, minY, minZ, maxX, maxY, maxZ);
        }
    }
}