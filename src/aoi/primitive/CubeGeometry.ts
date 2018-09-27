module aoi {
    export class CubeGeometry extends PrimitiveBase {
        private width:number;
        private height:number;
        private depth:number;

        constructor(width:number = 100, height:number = 100, depth:number = 100) {
            super();
            this.width = width;
            this.height = height;
            this.depth = depth;
            this.m_vertexStride = 11;
        }

        public buildGeometry():void {
            var data:base.VectorArray = new base.VectorArray(1, 264);
            var indexData:base.VectorArray = new base.VectorArray(2, 36);
            var h_width = this.width / 2, h_height = this.height / 2, h_depth = this.depth / 2;
            data.push(-h_width, -h_height, h_depth, 0, 1, 0,0,0,0,0,0);
            data.push(h_width, -h_height, h_depth, 1, 1, 0,0,0,0,0,0);
            data.push(h_width, -h_height, -h_depth, 1, 0, 0,0,0,0,0,0);
            data.push(-h_width, -h_height, -h_depth, 0, 0, 0,0,0,0,0,0);
            indexData.push(0, 1, 3, 1, 2, 3);
            //back
            data.push(-h_width, h_height, h_depth, 0, 1, 0,0,0,0,0,0);
            data.push(h_width, h_height, h_depth, 1, 1, 0,0,0,0,0,0);
            data.push(h_width, h_height, -h_depth, 1, 0, 0,0,0,0,0,0);
            data.push(-h_width, h_height, -h_depth, 0, 0, 0,0,0,0,0,0);
            indexData.push(4, 7, 5, 5, 7, 6);
            //top
            data.push(-h_width, h_height, h_depth, 0, 1, 0,0,0,0,0,0);
            data.push(h_width, h_height, h_depth, 1, 1, 0,0,0,0,0,0);
            data.push(h_width, -h_height, h_depth, 1, 0, 0,0,0,0,0,0);
            data.push(-h_width, -h_height, h_depth, 0, 0, 0,0,0,0,0,0);
            indexData.push(8, 9, 11, 9, 10, 11);
            //bottom
            data.push(-h_width, h_height, -h_depth, 0, 1, 0,0,0,0,0,0);
            data.push(h_width, h_height, -h_depth, 1, 1, 0,0,0,0,0,0);
            data.push(h_width, -h_height, -h_depth, 1, 0, 0,0,0,0,0,0);
            data.push(-h_width, -h_height, -h_depth, 0, 0, 0,0,0,0,0,0);
            indexData.push(12, 15, 13, 13, 15, 14);
            //left
            data.push(-h_width, h_height, h_depth, 0, 1, 0,0,0,0,0,0);
            data.push(-h_width, -h_height, h_depth, 1, 1, 0,0,0,0,0,0);
            data.push(-h_width, -h_height, -h_depth, 1, 0, 0,0,0,0,0,0);
            data.push(-h_width, h_height, -h_depth, 0, 0, 0,0,0,0,0,0);
            indexData.push(16, 17, 18, 16, 18, 19);
            //right
            data.push(h_width, h_height, h_depth, 0, 1, 0,0,0,0,0,0);
            data.push(h_width, -h_height, h_depth, 1, 1, 0,0,0,0,0,0);
            data.push(h_width, -h_height, -h_depth, 1, 0, 0,0,0,0,0,0);
            data.push(h_width, h_height, -h_depth, 0, 0, 0,0,0,0,0,0);
            indexData.push(20, 22, 21, 20, 23, 22);
            this.buildNormalAndTrangent(data, indexData);
            this.m_subGeometry.vertexRawData = data.data.buffer;
            this.m_subGeometry.indexRawData = indexData.data.buffer;
        }
    }
}