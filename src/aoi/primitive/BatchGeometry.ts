module aoi {
    export class BatchGeometry extends PrimitiveBase {
        private _vertexList:base.VectorArray;
        private _indexList:base.VectorArray;
        private _index:number = 0;
        private _verNum:number = 0;

        constructor() {
            super();
            this._vertexList = new base.VectorArray(1, 1500);
            this._indexList = new base.VectorArray(2, 500);
            this.m_vertexStride = 11;
        }

        public reset():void {
            this._vertexList.clear();
            this._indexList.clear();
            this.invalidateGeometry();
            this.invalidateUVs();
            this._index = 0;
            this._verNum = 0;
            var gl:WebGLRenderingContext = GlobelConst.gl;
            this.m_subGeometry.clearBuffer(gl);
        }

        public addMesh(mesh:IBase2D):void {
            var geo:Geometry = mesh.geometry;
            var sub:ISubGeometry = geo.subGeometries[0], i:number = 0, vec:math.Vector3D = new math.Vector3D(0, 0, 0);
            for (i = 0; i < sub.numVertices; i++) {
                var ci:number = i * 5;
                vec.setTo(sub.getVertexValue(ci), sub.getVertexValue(ci + 1), sub.getVertexValue(ci + 2));
                vec = mesh.sceneTransform.transformVector(vec);
                this._vertexList.push(vec.x, vec.y, vec.z);
                this._vertexList.push(sub.getVertexValue(ci + 3) * mesh.uvScaleX + mesh.uvOffsetX, sub.getVertexValue(ci + 4) * mesh.uvScaleY + mesh.uvOffsetY);
            }
            var len:number = sub.numIndex;
            for (i = 0; i < len; i++) {
                this._indexList.push(this._verNum + sub.getIndexValue(i));
            }
            this._verNum += sub.numVertices;
            this._index += len;
        }

        public buildGeometry():void {
            this.m_subGeometry.vertexRawData = this._vertexList.data.buffer.slice(0, this._verNum * 5 * 4);
            this.m_subGeometry.indexRawData = this._indexList.data.buffer.slice(0, this._index * 2);
        }
    }
}