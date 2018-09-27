module aoi {
    export class SphereGeometry extends PrimitiveBase {
        private radius:number;
        private slices:number;
        private stacks:number;

        constructor(radius:number, slices:number, stacks:number) {
            super();
            this.radius = radius;
            this.slices = slices;
            this.stacks = stacks;
        }

        public buildGeometry():void {
            var m_stepTheta:number = (2.0 * Math.PI) / this.slices, m_stepPhi:number = Math.PI / this.stacks,
                m_stepU:number = 1.0 / this.slices, m_stepV:number = 1.0 / this.stacks;
            var m_verticesPerStack:number = this.slices + 1;
            var m_numVertices:number = m_verticesPerStack * (this.stacks + 1);

            var vertexList:base.VectorArray = new base.VectorArray(1, m_numVertices * this.m_vertexStride);
            var indexList:base.VectorArray = new base.VectorArray(2, this.slices * this.stacks * 6);

            var halfCosThetas = [], halfSinThetas = [];
            var curTheta:number = 0, i:number, j:number;
            for (i = 0; i < m_verticesPerStack; ++i) {
                halfCosThetas[i] = Math.cos(curTheta) * this.radius;
                halfSinThetas[i] = Math.sin(curTheta) * this.radius;
                curTheta += m_stepTheta;
            }
            var curV:number = 1.0, curPhi:number = Math.PI, texCoordIndex:number, curU:number, curY:number, sinCurPhi:number;
            for (i = 0; i < this.stacks + 1; ++i) {
                curU = 1.0;
                curY = Math.cos(curPhi) * this.radius;
                sinCurPhi = Math.sin(curPhi);
                for (j = 0; j < m_verticesPerStack; ++j) {
                    vertexList.push(halfCosThetas[j] * sinCurPhi, curY, halfSinThetas[j] * sinCurPhi, curU, curV, 0,0,0,0,0,0);
                    curU -= m_stepU;
                }
                curV -= m_stepV;
                curPhi -= m_stepPhi;
            }
            var lastStackFirstVertexIndex:number = 0, curStackFirstVertexIndex:number = m_verticesPerStack, triIndex:number;
            for (i = 0; i < this.stacks; ++i) {
                for (j = 0; j < this.slices; ++j) {
                    indexList.push(lastStackFirstVertexIndex + j, lastStackFirstVertexIndex + j + 1, curStackFirstVertexIndex + j);
                    indexList.push(curStackFirstVertexIndex + j + 1, curStackFirstVertexIndex + j, lastStackFirstVertexIndex + j + 1);
                }

                lastStackFirstVertexIndex += m_verticesPerStack;
                curStackFirstVertexIndex += m_verticesPerStack;
            }
            this.buildNormalAndTrangent(vertexList, indexList);
            this.m_subGeometry.vertexRawData = vertexList.data.buffer;
            this.m_subGeometry.indexRawData = indexList.data.buffer;
        }
    }
}