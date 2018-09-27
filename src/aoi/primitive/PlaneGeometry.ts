module aoi {
    export class PlaneGeometry extends PrimitiveBase {
        static MIDDLE_M = 1;
        static LEFT_M = 2;
        static RIGHT_M = 3;

        static MIDDLE_T = 4;
        static LEFT_T = 5;
        static RIGHT_T = 6;

        static MIDDLE_B = 7;
        static LEFT_B = 8;
        static RIGHT_B = 9;

        public width:number;
        public height:number;
        public axis:string;
        public centerPoint:number;

        constructor(width:number = 100, height:number = 100, axis:string = "+xy", centerPoint:number = 1) {
            super();
            this.width = width == null ? 100 : width;
            this.height = height == null ? 100 : height;
            this.axis = axis == null ? Define.XY : axis;
            this.centerPoint = centerPoint == null ? PlaneGeometry.MIDDLE_M : centerPoint;
            this.m_vertexStride = 11;
        }

        public buildGeometry():void {
            var top = this.getTop(), left = this.getLeft(), stepU = this.getStepU(), stepV = this.getStepV();
            var vertexList:base.VectorArray = new base.VectorArray(1, 44);
            var indexList:base.VectorArray = new base.VectorArray(2, 6);
            var curVertex = this.getFirstVertex(top, left);
            var nextVertex, disU, disV, i = 0, j = 0;
            var uvRaw = [[1, 0], [1, 1], [0, 0], [0, 1]];
            for (i = 0; i < 2; i++) {
                disU = i * stepU;
                for (j = 0; j < 2; j++) {
                    disV = j * stepV;
                    nextVertex = this.getNextVertex(curVertex, disU, disV);
                    switch (this.centerPoint) {
                        case PlaneGeometry.MIDDLE_M:
                            vertexList.push(nextVertex.x, nextVertex.y, nextVertex.z);
                            break;
                        case PlaneGeometry.LEFT_M:
                            vertexList.push(nextVertex.x + this.width / 2, nextVertex.y, nextVertex.z);
                            break;
                        case PlaneGeometry.RIGHT_M:
                            vertexList.push(nextVertex.x - this.width / 2, nextVertex.y, nextVertex.z);
                            break;
                        case PlaneGeometry.MIDDLE_T:
                            vertexList.push(nextVertex.x, nextVertex.y - this.height / 2, nextVertex.z);
                            break;
                        case PlaneGeometry.LEFT_T:
                            vertexList.push(nextVertex.x + this.width / 2, nextVertex.y - this.height / 2, nextVertex.z);
                            break;
                        case PlaneGeometry.RIGHT_T:
                            vertexList.push(nextVertex.x - this.width / 2, nextVertex.y - this.height / 2, nextVertex.z);
                            break;
                        case PlaneGeometry.MIDDLE_B:
                            vertexList.push(nextVertex.x, nextVertex.y + this.height / 2, nextVertex.z);
                            break;
                        case PlaneGeometry.LEFT_B:
                            vertexList.push(nextVertex.x + this.width / 2, nextVertex.y + this.height / 2, nextVertex.z);
                            break;
                        case PlaneGeometry.RIGHT_B:
                            vertexList.push(nextVertex.x - this.width / 2, nextVertex.y + this.height / 2, nextVertex.z);
                            break;
                    }
                    vertexList.push(uvRaw[i * 2 + j][0], uvRaw[i * 2 + j][1]);
                    vertexList.push(0,0,1);
                    vertexList.push(0,0,-1);
                }
            }
            indexList.push(0, 2, 1, 3, 1, 2);
            this.buildNormalAndTrangent(vertexList, indexList);
            this.m_subGeometry.vertexRawData = vertexList.data.buffer;
            this.m_subGeometry.indexRawData = indexList.data.buffer;
        }

        public getStepU() {
            switch (this.axis) {
                case Define.XY:
                case Define.XZ:
                    return this.width;
                case Define.YZ:
                    return -this.width;
            }
            return 0;
        }

        public getStepV() {
            switch (this.axis) {
                case Define.YZ:
                case Define.XY:
                    return -this.height;
                case Define.XZ:
                    return this.height;
            }
            return 0;
        }

        public getTop() {
            switch (this.axis) {
                case Define.XY:
                    return this.height * 0.5;
                case Define.XZ:
                    return -this.height * 0.5;
                case Define.YZ:
                    return this.height * 0.5;
            }
            return 0;
        }

        public getLeft() {
            switch (this.axis) {
                case Define.XY:
                    return -this.width * 0.5;
                case Define.XZ:
                    return -this.width * 0.5;
                case Define.YZ:
                    return this.width * 0.5;
            }
            return 0;
        }

        public getFirstVertex(v, u) {
            var outPos = new math.Vector3D();
            switch (this.axis) {
                case Define.XY:
                    outPos.setTo(u, v, 0);
                    break;
                case Define.XZ:
                    outPos.setTo(u, 0, v);
                    break;
                case Define.YZ:
                    outPos.setTo(0, v, u);
                    break;
            }
            return outPos;
        }

        public getNextVertex(firstVector:math.Vector3D, disU:number, disV:number, outPos:math.Vector3D = null) {
            if (outPos == null)outPos = new math.Vector3D();
            switch (this.axis) {
                case Define.XY:
                    outPos.setTo(firstVector.x + disU, firstVector.y + disV, 0);
                    break;
                case Define.XZ:
                    outPos.setTo(firstVector.x + disU, 0, firstVector.z + disV);
                    break;
                case Define.YZ:
                    outPos.setTo(0, firstVector.y + disV, firstVector.z + disU);
                    break;
            }
            return outPos;
        }
    }
}