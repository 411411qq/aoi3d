module aoi {
    export class ParticleSubGeometry extends SubGeometryBase {
        private hasBezier:boolean = false;
        private vertexNum:number = 0;
        private indexNum:number = 0;
        constructor(vertexNum:number, indexNum:number) {
            super();
            this.hasBezier = false;
            this.vertexStride = 16;
            this.vertexNum = vertexNum;
            this.indexNum = indexNum;
        }

        private posList:base.VectorArray;
        public addVertexPos(px:number, py:number, pz:number, index:number):void
        {
            if(this.posList == null)
            {
                this.posList = new base.VectorArray(1, this.vertexNum * 4);
            }
            this.posList.push(px, py, pz, index);
        }

        private posOffsetList:base.VectorArray;
        public addVertexOffsetPos(px:number, py:number, pz:number):void
        {
            if(this.posOffsetList == null)
            {
                this.posOffsetList = new base.VectorArray(1, this.vertexNum * 3);
            }
            this.posOffsetList.push(px, py, pz);
        }

        private uvList:base.VectorArray;
        public addVertexUv(u:number, v:number):void
        {
            if(this.uvList == null)
            {
                this.uvList = new base.VectorArray(1, this.vertexNum * 2);
            }
            this.uvList.push(u, v);
        }

        private timeList:base.VectorArray;
        public addVertexOffsetTime(lifeTime:number, hideTime:number):void
        {
            if(this.timeList == null)
            {
                this.timeList = new base.VectorArray(1, this.vertexNum * 3);
            }
            this.timeList.push(hideTime, lifeTime - hideTime,lifeTime);
        }

        private spdList:base.VectorArray;
        public addVertexSpeed(sx:number, sy:number, sz:number, rotSpeed:number):void
        {
            if(this.spdList == null)
            {
                this.spdList = new base.VectorArray(1, this.vertexNum * 4);
            }
            this.spdList.push(sx, sy, sz, rotSpeed);
        }

        private indexList:base.VectorArray;
        public addIndex(p1:number, p2:number, p3:number):void
        {
            if(this.indexList == null)
            {
                this.indexList = new base.VectorArray(2, this.indexNum);
            }
            this.indexList.push(p1, p2, p3);
        }

        public buildGeometry():void
        {
            let vertexList:base.VectorArray = new base.VectorArray(1, this.vertexStride * this.vertexNum);
            for(var i:number = 0; i<this.vertexNum; i++)
            {
                vertexList.push(this.posList.data[i*4], this.posList.data[i*4 + 1], this.posList.data[i*4 + 2], this.posList.data[i*4 + 3]);
                vertexList.push(this.uvList.data[i*2], this.uvList.data[i*2 + 1]);
                vertexList.push(this.posOffsetList.data[i*3], this.posOffsetList.data[i*3 + 1], this.posOffsetList.data[i*3 + 2]);
                vertexList.push(this.timeList.data[i*3], this.timeList.data[i*3 + 1], this.timeList.data[i*3 + 2]);
                vertexList.push(this.spdList.data[i*4], this.spdList.data[i*4 + 1], this.spdList.data[i*4 + 2], this.spdList.data[i*4 + 3]);
            }
            this.vertexRawData = vertexList.data.buffer;
            this.indexRawData = this.indexList.data.buffer;
        }
    }
}