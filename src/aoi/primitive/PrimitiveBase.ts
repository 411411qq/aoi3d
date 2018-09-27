module aoi {
    export class PrimitiveBase extends Geometry {
        protected m_geomDirty:Boolean = true;
        protected m_uvDirty:Boolean = true;
        protected m_vertexStride:number = 11;
        protected m_subGeometry:SubGeometryBase;
        protected m_normalOffset:number = 5;
        protected m_trangentOffset:number = 8;

        constructor() {
            super();
            this.m_subGeometry = new SubGeometryBase();
            this.addSubGeometry(this.m_subGeometry);
			this.m_subGeometry.vertexStride = 11;
        }
		public setVertexStride(val:number)
		{
			this.m_vertexStride = val;
		}
        public get subGeometry():SubGeometryBase {
            return this.m_subGeometry;
        }

        public get subGeometries():Array<ISubGeometry> {
            if (this.m_geomDirty == true) {
                this.updateGeometry();
            }
            if (this.m_uvDirty == true) {
                this.updateUVs();
            }
            return this._subGeometries;
        }

        protected buildGeometry(target:SubGeometryBase):void {
        }

        protected buildUVs(target:SubGeometryBase):void {
        }

        private updateGeometry():void {
            this.buildGeometry(this.m_subGeometry);
            this.m_geomDirty = false;
        }

        private updateUVs():void {
            this.buildUVs(this.m_subGeometry);
            this.m_uvDirty = false;
        }

        protected invalidateGeometry():void {
            this.m_geomDirty = true;
        }

        protected invalidateUVs():void {
            this.m_uvDirty = true;
        }
        public buildNormalAndTrangent(vectorList:base.VectorArray, indexList:base.VectorArray)
        {
            this.buildNormal(vectorList, indexList);
            this.buildTrangent(vectorList, indexList);
        }
        private buildNormal(vectorList:base.VectorArray, indexList:base.VectorArray):void
        {
            var i:number = 0, l:number = 0;
			var indexA:number, indexB:number, indexC:number;
			var len:number = indexList.data.length / 3;
			var x1:number, x2:number, x3:number;
			var y1:number, y2:number, y3:number;
			var z1:number, z2:number, z3:number;
			var dx1:number, dy1:number, dz1:number;
			var dx2:number, dy2:number, dz2:number;
			var cx:number, cy:number, cz:number;
			var d:number;
			var vertices:ArrayBuffer = vectorList.data;
			var posStride:number = this.m_vertexStride;
            while (i < len) {
				l = i * 3;
                indexA = indexList.data[l];
				x1 = vectorList.data[indexA * posStride];
				y1 = vectorList.data[indexA * posStride + 1];
				z1 = vectorList.data[indexA * posStride + 2];
				indexB = indexList.data[l+1];
				x2 = vectorList.data[indexB*posStride];
				y2 = vectorList.data[indexB*posStride + 1];
				z2 = vectorList.data[indexB*posStride + 2];
				indexC = indexList.data[l+2];
				x3 = vectorList.data[indexC*posStride];
				y3 = vectorList.data[indexC*posStride + 1];
				z3 = vectorList.data[indexC*posStride + 2];
				dx1 = x3 - x1;
				dy1 = y3 - y1;
				dz1 = z3 - z1;
				dx2 = x2 - x1;
				dy2 = y2 - y1;
				dz2 = z2 - z1;
				cx = dz1*dy2 - dy1*dz2;
				cy = dx1*dz2 - dz1*dx2;
				cz = dy1*dx2 - dx1*dy2;
				d = Math.sqrt(cx*cx + cy*cy + cz*cz);
				d = 1/d;
				vectorList.data[indexA*posStride + this.m_normalOffset] = cx * d;
				vectorList.data[indexA*posStride+this.m_normalOffset+1] = cy * d;
				vectorList.data[indexA*posStride+this.m_normalOffset+2] = cz * d;
				
				vectorList.data[indexB*posStride+ this.m_normalOffset] = cx * d;
				vectorList.data[indexB*posStride+this.m_normalOffset+1] = cy * d;
				vectorList.data[indexB*posStride+this.m_normalOffset+2] = cz * d;
				
				vectorList.data[indexC*posStride+ this.m_normalOffset] = cx * d;
				vectorList.data[indexC*posStride+this.m_normalOffset+1] = cy * d;
				vectorList.data[indexC*posStride+this.m_normalOffset+2] = cz * d;
				i ++;
			}
        }
        private buildTrangent(vectorList:base.VectorArray, indexList:base.VectorArray):void
        {
            var i:number = 0,l:number = 0;
			var indexA:number, indexB:number, indexC:number;
			var len:number = indexList.data.length / 3;
			var ui:number, vi:number;
			var v0:number;
			var dv1:number, dv2:number;
			var denom:number;
			var x0:number, y0:number, z0:number;
			var dx1:number, dy1:number, dz1:number;
			var dx2:number, dy2:number, dz2:number;
			var cx:number, cy:number, cz:number;
			var posStride:number = this.m_vertexStride;
			while (i < len) {
				l = i * 3;
				indexA = indexList.data[l];
				indexB = indexList.data[l+1];
				indexC = indexList.data[l+2];
				
				ui = indexA*posStride + 4;
                v0 = vectorList.data[ui];
				ui = indexB*posStride + 4;
				dv1 = vectorList.data[ui] - v0;
				ui = indexC*posStride + 4;
                dv2 = vectorList.data[ui] - v0;
				
				vi = indexA*posStride;
				x0 = vectorList.data[vi];
				y0 = vectorList.data[vi + 1];
				z0 = vectorList.data[vi + 2];
				vi = indexB*posStride;
                dx1 = vectorList.data[vi] - x0;
                dy1 = vectorList.data[vi + 1] - y0;
                dz1 = vectorList.data[vi + 2] - z0;
				vi = indexC*posStride;
                dx2 = vectorList.data[vi] - x0;
                dy2 = vectorList.data[vi + 1] - y0;
                dz2 = vectorList.data[vi + 2] - z0;
				
				cx = dv2*dx1 - dv1*dx2;
				cy = dv2*dy1 - dv1*dy2;
				cz = dv2*dz1 - dv1*dz2;
				denom = 1/Math.sqrt(cx*cx + cy*cy + cz*cz);
				
				vectorList.data[indexA*posStride+this.m_trangentOffset] += denom*cx;
				vectorList.data[indexA*posStride+this.m_trangentOffset+1] += denom*cy;
				vectorList.data[indexA*posStride+this.m_trangentOffset+2] += denom*cz;
				
				vectorList.data[indexB*posStride+this.m_trangentOffset] += denom*cx;
				vectorList.data[indexB*posStride+this.m_trangentOffset+1] += denom*cy;
				vectorList.data[indexB*posStride+this.m_trangentOffset+2] += denom*cz;
				
				vectorList.data[indexC*posStride+this.m_trangentOffset] += denom*cx;
				vectorList.data[indexC*posStride+this.m_trangentOffset+1] += denom*cy;
				vectorList.data[indexC*posStride+this.m_trangentOffset+2] += denom*cz;
				
				i ++;
			}
        }
    }
}