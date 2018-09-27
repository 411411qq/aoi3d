module math
{
    export class MathUtil {
        public static TEMP_VEC1 = new Vector3D();
        public static TEMP_VEC2 = new Vector3D();
        public static TEMP_MATRIX = new Matrix4();
        public static RAW_DATA_CONTAINER = new Float32Array(16);

        public static add(vec1:Vector3D, vec2:Vector3D, result:Vector3D):Vector3D {
            if (result == null)result = new Vector3D();
            result.x = vec1.x + vec2.x;
            result.y = vec1.y + vec2.y;
            result.z = vec1.z + vec2.z;
            return result;
        }

        public static clamp(val:number, min:number, max:number):number
        {
            if(val < min)
            {
                return min;
            }
            else if(val > max)
            {
                return max;
            }
            return val;
        }

        public static crossProduct(vec1:Vector3D, vec2:Vector3D, result:Vector3D):Vector3D {
            if (!result) result = new Vector3D();
            var x1 = vec1.x;
            var y1 = vec1.y;
            var z1 = vec1.z;
            var x2 = vec2.x;
            var y2 = vec2.y;
            var z2 = vec2.z;
            result.x = y1 * z2 - z1 * y2;
            result.y = z1 * x2 - x1 * z2;
            result.z = x1 * y2 - y1 * x2;
            return result;
        }

        public static subtract(vec1:Vector3D, vec2:Vector3D, result:Vector3D):Vector3D {
            if (!result) result = new Vector3D();
            result.x = vec1.x - vec2.x;
            result.y = vec1.y - vec2.y;
            result.z = vec1.z - vec2.z;
            return result;
        }

        public static getBoxMuller():number {
            var a = Math.random();
            var b = Math.random();
            var r = Math.sqrt(-2 * Math.log(b));
            return r * Math.cos(2 * Math.PI * a);
        }

        public static getBezerLen(s:Vector3D, c:Vector3D, e:Vector3D, per:number = 0.01):number {
            var len = 1 / per;
            var p = new Vector3D();
            var lp = s.clone();
            var rs = 0, i = 0;
            for (i = 0; i < len; i++) {
                var time = i * per;
                var f = 1 - time;
                p.x = s.x * f * f + c.x * 2 * time * f + e.x * time * time;
                p.y = s.y * f * f + c.y * 2 * time * f + e.y * time * time;
                p.z = s.z * f * f + c.z * 2 * time * f + e.z * time * time;
                rs += Vector3D.distance(p, lp);
                lp.x = p.x;
                lp.y = p.y;
                lp.z = p.z;
            }
            return rs;
        }

        public static getLineToPlaneProjection(lineA:Vector3D, lineB:Vector3D, nor:Vector3D, aLineA:Vector3D, aLineB:Vector3D) {
            var nline:Vector3D = lineA.subtract(lineB);
            var nnor:Vector3D = Vector3D.crossProduct(nline, nor);
            var rs = MathUtil.getLineCrossPlane(aLineA, aLineA.subtract(aLineB), nnor, lineB, false);
            return rs;
        }

        public static getLineCrossPlane(lineStart:Vector3D, lineDir:Vector3D, planeNormal:Vector3D, planePoint:Vector3D, dirCheck:boolean = true):Vector3D {
            var t = (Vector3D.dotProduct(planeNormal, planePoint) - Vector3D.dotProduct(planeNormal, lineStart)) / Vector3D.dotProduct(planeNormal, lineDir);
            if (t >= 0 || dirCheck) {
                var vec = new Vector3D();
                vec.setTo(lineStart.x + lineDir.x * t, lineStart.y + lineDir.y * t, lineStart.z + lineDir.z * t);
                return vec;
            }
            return null;
        }

        public static calClosePoint(point:Vector3D, orgin:Vector3D, edage:Line3d, result:Vector3D):void {
            var opx = point.x - orgin.x;
            var opy = point.y - orgin.y;
            var opz = point.z - orgin.z;
            var dot = opx * edage.x + opy * edage.y + opz * edage.z;
            if (dot < 0) {
                result.x = orgin.x;
                result.y = orgin.y;
                result.z = orgin.z;
            }
            else {
                var edageLenSquared = edage.lengthSquared;
                if (dot < edageLenSquared) {
                    var t = dot / edageLenSquared;
                    result.x = orgin.x + t * edage.x;
                    result.y = orgin.y + t * edage.y;
                    result.z = orgin.z + t * edage.z;
                }
                else {
                    result.x = orgin.x + edage.x;
                    result.y = orgin.y + edage.y;
                    result.z = orgin.z + edage.z;
                }
            }
        }

        public static getLenSquared(start:Vector3D, end:Vector3D):number {
            var ax = end.x - start.x;
            var ay = end.y - start.y;
            var az = end.z - start.z;
            return ax * ax + ay * ay + az * az;
        }

        public static getRandomNumberBetween(max:number, min:number):number
        {
            return Math.random() * (max - min) + min
        }

        public static getLowestRoot(a:number, b:number, c:number):number {
            if (a == 0) {
                return -1;
            }
            var determinant = b * b - 4 * a * c;
            if (determinant < 0) {
                return -1;
            }
            var sqrt = Math.sqrt(determinant);
            var r1 = (-b - sqrt) / (2 * a);
            var r2 = (-b + sqrt) / (2 * a);
            var min = r1;
            var max = r2;
            if (r1 > r2) {
                min = r2;
                max = r1;
            }
            if (min >= 0) {
                return min;
            }
            if (max >= 0) {
                return max;
            }
            return -1;
        }

        public static checkClockSide(p1:Vector3D, p2:Vector3D, checkPoint:Vector3D, normal:Vector3D):number {
            var t1 = MathUtil.TEMP_VEC1;
            var t2 = MathUtil.TEMP_VEC2;
            t1.setTo(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
            t2.setTo(checkPoint.x - p1.x, checkPoint.y - p1.y, checkPoint.z - p1.z);
            return MathUtil.checkClockSide2(t1, t2, normal);
        }

        public static checkClockSide2(line0:Vector3D, line1:Vector3D, normal:Vector3D):number {
            var dd = Vector3D.crossProduct(line0, line1), def;
            def = Vector3D.dotProduct(dd, normal);
            if (def == 0) {
                return 0;
            }
            else {
                return def > 0 ? 1 : -1;
            }
        }

        public static checkSide(pos:Vector3D, normal:Vector3D, distance:number):number {
            var dis = Vector3D.dotProduct(pos, normal) - distance;
            if (dis > PlaneClassification.EPSILON) {
                return PlaneClassification.FRONT;
            }
            else if (dis < -PlaneClassification.EPSILON) {
                return PlaneClassification.BACK;
            }
            else {
                return PlaneClassification.COINCIDING;
            }
        }

        public static getRayPosition(planeNormal:Vector3D, planeDis:number, start:Vector3D, dir:Vector3D):Vector3D {
            var det = Vector3D.dotProduct(planeNormal, dir);
            if (det != 0) {
                var t = (planeDis - Vector3D.dotProduct(start, planeNormal)) / det;
                var result = new Vector3D();
                result.copyFrom(dir);
                result.scaleBy(t);
                result.add(start);
                return result;
            }
            else {
                return null;
            }
        }

        public static checkRayCollisionWithTriangle(p0:Vector3D, p1:Vector3D, p2:Vector3D, rayPos:Vector3D, rayDir:Vector3D):Object {
            var tri:Triangle = new Triangle(p0, p1, p2);
            var hitPoint:Vector3D = MathUtil.getRayPosition(tri.normal, tri.distance, rayPos, rayDir);
            if (hitPoint == null) {
                return null;
            }
            if (tri.pointInPoly(hitPoint) == true) {
                return {pos: hitPoint, nor: tri.normal};
            }
            return null;
        }
    }
}