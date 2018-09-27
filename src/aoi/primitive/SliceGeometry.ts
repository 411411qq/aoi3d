module aoi {
    export class SliceGeometry extends PrimitiveBase {
        private _width:number;
        private _height:number;
        private _top:number;
        private _bottom:number;
        private _left:number;
        private _right:number;
        private _uvWidth:number;
        private _uvHeight:number;

        constructor() {
            super();
        }

        public setSliceData(width:number, height:number, uvWidth:number, uvHeight:number,
                            top:number, bottom:number, left:number, right:number):void {
            this.dispose();
            this.m_subGeometry = new SubGeometryBase();
            this.addSubGeometry(this.m_subGeometry);
            this._width = Math.max(width, left + right);
            this._height = Math.max(height, top + bottom);
            this._uvWidth = uvWidth;
            this._uvHeight = uvHeight;
            this._top = top;
            this._bottom = bottom;
            this._left = left;
            this._right = right;
            this.invalidateGeometry();
            this.invalidateUVs();
        }

        public buildGeometry():void {
            var data:base.VectorArray = new base.VectorArray(1, 176);
            var indexData:base.VectorArray = new base.VectorArray(2, 54);

            data.push(0, 0, 0, 0,0, 0,0,0,0,0,0);
            data.push(this._left, 0, 0, this._left / this._uvWidth, 0, 0,0,0,0,0,0);
            data.push(this._width - this._right, 0, 0, (this._uvWidth - this._right) / this._uvWidth, 0, 0,0,0,0,0,0);
            data.push(this._width, 0, 0, 1, 0, 0,0,0,0,0,0);

            data.push(0, -this._top, 0, 0, this._top / this._uvHeight, 0,0,0,0,0,0);
            data.push(this._left, -this._top, 0, this._left / this._uvWidth, this._top / this._uvHeight, 0,0,0,0,0,0);
            data.push(this._width - this._right, -this._top, 0, (this._uvWidth - this._right) / this._uvWidth, this._top / this._uvHeight, 0,0,0,0,0,0);
            data.push(this._width, -this._top, 0, 1, this._top / this._uvHeight, 0,0,0,0,0,0);

            data.push(0, -(this._height - this._bottom), 0, 0, (this._uvHeight - this._bottom) / this._uvHeight, 0,0,0,0,0,0);
            data.push(this._left, -(this._height - this._bottom), 0, this._left / this._uvWidth, (this._uvHeight - this._bottom) / this._uvHeight, 0,0,0,0,0,0);
            data.push(this._width - this._right, -(this._height - this._bottom), 0, (this._uvWidth - this._right) / this._uvWidth, (this._uvHeight - this._bottom) / this._uvHeight, 0,0,0,0,0,0);
            data.push(this._width, -(this._height - this._bottom), 0, 1, (this._uvHeight - this._bottom) / this._uvHeight, 0,0,0,0,0,0);

            data.push(0, -this._height, 0, 0, 1, 0,0,0,0,0,0);
            data.push(this._left, -this._height, 0, this._left / this._uvWidth, 1, 0,0,0,0,0,0);
            data.push(this._width - this._right, -this._height, 0, (this._uvWidth - this._right) / this._uvWidth, 1, 0,0,0,0,0,0);
            data.push(this._width, -this._height, 0, 1, 1, 0,0,0,0,0,0);

            indexData.push(0,1,4,1,5,4);
            indexData.push(1,2,5,2,6,5);
            indexData.push(2,3,6,3,7,6);
            indexData.push(4,5,8,5,9,8);
            indexData.push(5,6,9,6,10,9);
            indexData.push(6,7,10,7,11,10);
            indexData.push(8,9,12,9,13,12);
            indexData.push(9,10,13,10,14,13);
            indexData.push(10,11,14,11,15,14);

            this.m_subGeometry.vertexRawData = data.data.buffer;
            this.m_subGeometry.indexRawData = indexData.data.buffer;
        }
    }
}