module aoi {
    export class BoundingSphere extends BoundingVolumeBase {
        private _centerX:number;
        private _centerY:number;
        private _centerZ:number;
        private _radius:number;

        constructor() {
            super();
        }


        public isInFrustum(camera:ICamera, checkObj:IBoundsOwner):Boolean {
            var m:math.Matrix4 = camera.viewProjection.clone();
            m.prepend(checkObj.transform);
            var raw:Float32Array = m.elements;
            var c11:number = raw[0], c12:number = raw[4], c13:number = raw[8], c14:number = raw[12];
            var c21:number = raw[1], c22:number = raw[5], c23:number = raw[9], c24:number = raw[13];
            var c31:number = raw[2], c32:number = raw[6], c33:number = raw[10], c34:number = raw[14];
            var c41:number = raw[3], c42:number = raw[7], c43:number = raw[11], c44:number = raw[15];
            var a:number, b:number, c:number, d:number;
            var dd:number, rr:number = this._radius;
            a = c41 + c11;
            b = c42 + c12;
            c = c43 + c13;
            d = c44 + c14;
            dd = a * this._centerX + b * this._centerY + c * this._centerZ;
            if (a < 0) a = -a;
            if (b < 0) b = -b;
            if (c < 0) c = -c;
            rr = (a + b + c) * this._radius;
            if (dd + rr < -d) return false;
            // right plane
            a = c41 - c11;
            b = c42 - c12;
            c = c43 - c13;
            d = c44 - c14;
            dd = a * this._centerX + b * this._centerY + c * this._centerZ;
            if (a < 0) a = -a;
            if (b < 0) b = -b;
            if (c < 0) c = -c;
            rr = (a + b + c) * this._radius;
            if (dd + rr < -d) return false;
            // bottom plane
            a = c41 + c21;
            b = c42 + c22;
            c = c43 + c23;
            d = c44 + c24;
            dd = a * this._centerX + b * this._centerY + c * this._centerZ;
            if (a < 0) a = -a;
            if (b < 0) b = -b;
            if (c < 0) c = -c;
            rr = (a + b + c) * this._radius;
            if (dd + rr < -d) return false;
            // top plane
            a = c41 - c21;
            b = c42 - c22;
            c = c43 - c23;
            d = c44 - c24;
            dd = a * this._centerX + b * this._centerY + c * this._centerZ;
            if (a < 0) a = -a;
            if (b < 0) b = -b;
            if (c < 0) c = -c;
            rr = (a + b + c) * this._radius;
            if (dd + rr < -d) return false;
            // near plane
            a = c31;
            b = c32;
            c = c33;
            d = c34;
            dd = a * this._centerX + b * this._centerY + c * this._centerZ;
            if (a < 0) a = -a;
            if (b < 0) b = -b;
            if (c < 0) c = -c;
            rr = (a + b + c) * this._radius;
            if (dd + rr < -d) return false;
            // far plane
            a = c41 - c31;
            b = c42 - c32;
            c = c43 - c33;
            d = c44 - c34;
            dd = a * this._centerX + b * this._centerY + c * this._centerZ;
            if (a < 0) a = -a;
            if (b < 0) b = -b;
            if (c < 0) c = -c;
            rr = (a + b + c) * this._radius;
            if (dd + rr < -d) return false;

            return true;
        }

        public fromExtremes(minX:number, minY:number, minZ:number, maxX:number, maxY:number, maxZ:number):void {
            this._centerX = (maxX - minX) * 0.5;
            this._centerY = (maxY - minY) * 0.5;
            this._centerZ = (maxZ - minZ) * 0.5;

            var d:number;
            var d_x:number = maxX - minX;
            var d_y:number = maxY - minY;
            var d_z:number = maxZ - minZ;
            this._radius = Math.min(d_x, d_y, d_z) / 2;
            super.fromExtremes(minX, minY, minZ, maxX, maxY, maxZ);
        }

        public containsPoint(position:math.Vector3D):Boolean {
            var px:number = position.x - this._centerX;
            var py:number = position.y - this._centerY;
            var pz:number = position.z - this._centerZ;
            var distance:number = Math.sqrt(px * px + py * py + pz * pz);
            return distance <= this._radius;
        }

        public rayIntersection(position:math.Vector3D, direction:math.Vector3D, targetNormal:math.Vector3D):number {
            if (this.containsPoint(position)) return 0;

            var px:number = position.x - this._centerX, py:number = position.y - this._centerY, pz:number = position.z - this._centerZ;
            var vx:number = direction.x, vy:number = direction.y, vz:number = direction.z;
            var rayEntryDistance:number;

            var a:number = vx * vx + vy * vy + vz * vz;
            var b:number = 2 * ( px * vx + py * vy + pz * vz );
            var c:number = px * px + py * py + pz * pz - this._radius * this._radius;
            var det:number = b * b - 4 * a * c;

            if (det >= 0) { // ray goes through sphere
                var sqrtDet:number = Math.sqrt(det);
                rayEntryDistance = ( -b - sqrtDet ) / ( 2 * a );
                if (rayEntryDistance >= 0) {
                    targetNormal.x = px + rayEntryDistance * vx;
                    targetNormal.y = py + rayEntryDistance * vy;
                    targetNormal.z = pz + rayEntryDistance * vz;
                    targetNormal.normalize();

                    return rayEntryDistance;
                }
            }
            return -1;
        }
    }
}