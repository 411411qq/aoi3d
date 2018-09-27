module aoi {
    export class AxisAlignedBoundingBox extends BoundingVolumeBase {
        public _centerX:number;
        public _centerY:number;
        public _centerZ:number;
        public _halfExtentsX:number;
        public _halfExtentsY:number;
        public _halfExtentsZ:number;

        public _width:number;
        public _height:number; 
        public _depth:number;

        public _radiu:number;

        constructor() {
            super();
        }

        public buildFromObj(val:any):void {
            this._centerX = val.centerX;
            this._centerY = val.centerY;
            this._centerZ = val.centerZ;
            this._halfExtentsX = val.halfExtentsX;
            this._halfExtentsY = val.halfExtentsY;
            this._halfExtentsZ = val.halfExtentsZ;
            this._width = val.width;
            this._height = val.height;
            this._depth = val.depth;
            this._radiu = val.radiu;
            this.min.setTo(val.min.x, val.min.y, val.min.z);
            this.max.setTo(val.max.x, val.max.y, val.max.z);
            this._aabbPointsDirty = true;
        }

        public get planeMidPoints():Array<math.Vector3D> {
            if (this._planeMidPoints == null) {
                this._planeMidPoints = [];
                var cx:number = (this._max.x + this._min.x) / 2;
                var cy:number = (this._max.y + this._min.y) / 2;
                var cz:number = (this._max.z + this._min.z) / 2;
                this._planeMidPoints[0] = new math.Vector3D(this._max.x, this._max.y, this._max.z);
                this._planeMidPoints[1] = new math.Vector3D(this._min.x, this._min.y, this._min.z);

                this._planeMidPoints[2] = new math.Vector3D(this._max.x, this._min.y, this._min.z);
                this._planeMidPoints[3] = new math.Vector3D(this._min.x, this._max.y, this._max.z);
            }
            return this._planeMidPoints;
        }

        public containsPoint(position:math.Vector3D):Boolean {
            var px:number = position.x - this._centerX, py:number = position.y - this._centerY, pz:number = position.z - this._centerZ;
            return px <= this._halfExtentsX && px >= -this._halfExtentsX &&
                py <= this._halfExtentsY && py >= -this._halfExtentsY &&
                pz <= this._halfExtentsZ && pz >= -this._halfExtentsZ;
        }

        public fromExtremes(minX:number, minY:number, minZ:number, maxX:number, maxY:number, maxZ:number):void {
            this._centerX = (maxX + minX) * 0.5;
            this._centerY = (maxY + minY) * 0.5;
            this._centerZ = (maxZ + minZ) * 0.5;
            this._halfExtentsX = (maxX - minX) * 0.5;
            this._halfExtentsY = (maxY - minY) * 0.5;
            this._halfExtentsZ = (maxZ - minZ) * 0.5;
            this._width = Math.abs(maxX - minX);
            this._height = Math.abs(maxY - minY);
            this._depth = Math.abs(maxZ - minZ);
            this._radiu = Math.sqrt(this._halfExtentsX * this._halfExtentsX + this._halfExtentsY * this._halfExtentsY + this._halfExtentsZ * this._halfExtentsZ);
            this._planeMidPoints = null;
            super.fromExtremes(minX, minY, minZ, maxX, maxY, maxZ);
        }

        private pointPlaneDistance(point:math.Vector3D, plane:math.Vector3D):number {
            return (plane.w + (point.x * plane.x + point.y * plane.y + point.z * plane.z));
        }

        public isInFrustum(camera:ICamera, checkObj:IBoundsOwner):Boolean {
            var m:math.Matrix4 = camera.viewProjection.clone();
            m.prepend(checkObj.sceneTransform);
            var raw:Float32Array = m.elements;
            var c11:number = raw[0], c12:number = raw[4], c13:number = raw[8], c14:number = raw[12];
            var c21:number = raw[1], c22:number = raw[5], c23:number = raw[9], c24:number = raw[13];
            var c31:number = raw[2], c32:number = raw[6], c33:number = raw[10], c34:number = raw[14];
            var c41:number = raw[3], c42:number = raw[7], c43:number = raw[11], c44:number = raw[15];
            var a:number, b:number, c:number, d:number;
            var dd:number, rr:number;

            a = c41 + c11;
            b = c42 + c12;
            c = c43 + c13;
            d = c44 + c14;
            dd = a * this._centerX + b * this._centerY + c * this._centerZ + d;
            if (a < 0) a = -a;
            if (b < 0) b = -b;
            if (c < 0) c = -c;
            rr = a * this._halfExtentsX + b * this._halfExtentsY + c * this._halfExtentsZ;
            if (dd < -rr) return false;
            a = c41 - c11;
            b = c42 - c12;
            c = c43 - c13;
            d = c44 - c14;
            dd = a * this._centerX + b * this._centerY + c * this._centerZ + d;
            if (a < 0) a = -a;
            if (b < 0) b = -b;
            if (c < 0) c = -c;
            rr = a * this._halfExtentsX + b * this._halfExtentsY + c * this._halfExtentsZ;
            if (dd < -rr) return false;
            a = c41 + c21;
            b = c42 + c22;
            c = c43 + c23;
            d = c44 + c24;
            dd = a * this._centerX + b * this._centerY + c * this._centerZ + d;
            if (a < 0) a = -a;
            if (b < 0) b = -b;
            if (c < 0) c = -c;
            rr = a * this._halfExtentsX + b * this._halfExtentsY + c * this._halfExtentsZ;
            if (dd < -rr) return false;
            a = c41 - c21;
            b = c42 - c22;
            c = c43 - c23;
            d = c44 - c24;
            dd = a * this._centerX + b * this._centerY + c * this._centerZ + d;
            if (a < 0) a = -a;
            if (b < 0) b = -b;
            if (c < 0) c = -c;
            rr = a * this._halfExtentsX + b * this._halfExtentsY + c * this._halfExtentsZ;
            if (dd < -rr) return false;
            a = c31;
            b = c32;
            c = c33;
            d = c34;
            dd = a * this._centerX + b * this._centerY + c * this._centerZ + d;
            if (a < 0) a = -a;
            if (b < 0) b = -b;
            if (c < 0) c = -c;
            rr = a * this._halfExtentsX + b * this._halfExtentsY + c * this._halfExtentsZ;
            if (dd < -rr) return false;
            a = c41 - c31;
            b = c42 - c32;
            c = c43 - c33;
            d = c44 - c34;
            dd = a * this._centerX + b * this._centerY + c * this._centerZ + d;
            if (a < 0) a = -a;
            if (b < 0) b = -b;
            if (c < 0) c = -c;
            rr = a * this._halfExtentsX + b * this._halfExtentsY + c * this._halfExtentsZ;
            if (dd < -rr) return false;
            return true;
        }

        public rayIntersection(position:math.Vector3D, direction:math.Vector3D, targetNormal:math.Vector3D):number {
            if (this.containsPoint(position) == true) {
                return 0;
            }

            var px:number = position.x - this._centerX, py:number = position.y - this._centerY, pz:number = position.z - this._centerZ;
            var vx:number = direction.x, vy:number = direction.y, vz:number = direction.z;
            var ix:number, iy:number, iz:number;
            var rayEntryDistance:number;

            var intersects:Boolean;
            if (vx < 0) {
                rayEntryDistance = ( this._halfExtentsX - px ) / vx;
                if (rayEntryDistance > 0) {
                    iy = py + rayEntryDistance * vy;
                    iz = pz + rayEntryDistance * vz;
                    if (iy > -this._halfExtentsY && iy < this._halfExtentsY && iz > -this._halfExtentsZ && iz < this._halfExtentsZ) {
                        if (targetNormal != null) {
                            targetNormal.x = 1;
                            targetNormal.y = 0;
                            targetNormal.z = 0;
                        }

                        intersects = true;
                    }
                }
            }
            if (!intersects && vx > 0) {
                rayEntryDistance = ( -this._halfExtentsX - px ) / vx;
                if (rayEntryDistance > 0) {
                    iy = py + rayEntryDistance * vy;
                    iz = pz + rayEntryDistance * vz;
                    if (iy > -this._halfExtentsY && iy < this._halfExtentsY && iz > -this._halfExtentsZ && iz < this._halfExtentsZ) {
                        if (targetNormal != null) {
                            targetNormal.x = -1;
                            targetNormal.y = 0;
                            targetNormal.z = 0;
                        }
                        intersects = true;
                    }
                }
            }
            if (!intersects && vy < 0) {
                rayEntryDistance = ( this._halfExtentsY - py ) / vy;
                if (rayEntryDistance > 0) {
                    ix = px + rayEntryDistance * vx;
                    iz = pz + rayEntryDistance * vz;
                    if (ix > -this._halfExtentsX && ix < this._halfExtentsX && iz > -this._halfExtentsZ && iz < this._halfExtentsZ) {
                        if (targetNormal != null) {
                            targetNormal.x = 0;
                            targetNormal.y = 1;
                            targetNormal.z = 0;
                        }
                        intersects = true;
                    }
                }
            }
            if (!intersects && vy > 0) {
                rayEntryDistance = ( -this._halfExtentsY - py ) / vy;
                if (rayEntryDistance > 0) {
                    ix = px + rayEntryDistance * vx;
                    iz = pz + rayEntryDistance * vz;
                    if (ix > -this._halfExtentsX && ix < this._halfExtentsX && iz > -this._halfExtentsZ && iz < this._halfExtentsZ) {
                        if (targetNormal != null) {
                            targetNormal.x = 0;
                            targetNormal.y = -1;
                            targetNormal.z = 0;
                        }
                        intersects = true;
                    }
                }
            }
            if (!intersects && vz < 0) {
                rayEntryDistance = ( this._halfExtentsZ - pz ) / vz;
                if (rayEntryDistance > 0) {
                    ix = px + rayEntryDistance * vx;
                    iy = py + rayEntryDistance * vy;
                    if (iy > -this._halfExtentsY && iy < this._halfExtentsY && ix > -this._halfExtentsX && ix < this._halfExtentsX) {
                        if (targetNormal != null) {
                            targetNormal.x = 0;
                            targetNormal.y = 0;
                            targetNormal.z = 1;
                        }
                        intersects = true;
                    }
                }
            }
            if (!intersects && vz > 0) {
                rayEntryDistance = ( -this._halfExtentsZ - pz ) / vz;
                if (rayEntryDistance > 0) {
                    ix = px + rayEntryDistance * vx;
                    iy = py + rayEntryDistance * vy;
                    if (iy > -this._halfExtentsY && iy < this._halfExtentsY && ix > -this._halfExtentsX && ix < this._halfExtentsX) {
                        if (targetNormal != null) {
                            targetNormal.x = 0;
                            targetNormal.y = 0;
                            targetNormal.z = -1;
                        }
                        intersects = true;
                    }
                }
            }

            return intersects ? rayEntryDistance : -1;
        }

        public get width():number {
            return this._width;
        }

        public get height():number {
            return this._height;
        }

        public get depth():number {
            return this._depth;
        }
    }
}