module aoi {
    import ByteArray = base.ByteArray;
    import EventBase = base.EventBase;
    import Endian = base.Endian;
    export class SubGeometryBase implements ISubGeometry, IDispose {
        protected m_vertexBuffer:WebGLBuffer;
        protected m_vertexRawData:ArrayBuffer;
        protected m_indexBuffer:WebGLBuffer;
        protected m_indexRawData:ArrayBuffer;
        protected m_bufferDirty:boolean = false;
        protected m_vertexStride:number;
        protected m_vertexBy:ByteArray;
        protected m_indexBy:ByteArray;
        public parentGeometry:Geometry;

        constructor() {
            this.m_vertexRawData = null;
            this.m_indexRawData = null;
            this.m_vertexBuffer = null;
            this.m_indexBuffer = null;
            this.m_bufferDirty = true;
            this.m_vertexStride = 13;
            GlobelConst.eventDispatcher.addEventListener(EventBase.CONTEXT_DISPOSE, this, this.onContextDispose);
        }

        public getIndexBuffer(gl:WebGLRenderingContext):WebGLBuffer {
            if (this.m_bufferDirty == true) {
                this.update(gl);
            }
            return this.m_indexBuffer;
        }

        public getVertexBuffer(gl:WebGLRenderingContext):WebGLBuffer {
            if (this.m_bufferDirty == true) {
                this.update(gl);
            }
            return this.m_vertexBuffer;
        }

        public set vertexRawData(value:ArrayBuffer) {
            this.m_vertexRawData = value;
            this.m_bufferDirty = true
        }

        public set indexRawData(value:ArrayBuffer) {
            this.m_indexRawData = value;
            this.m_bufferDirty = true
        }

        public get vertexStride():number {
            return this.m_vertexStride;
        }

        public set vertexStride(value:number) {
            this.m_vertexStride = value;
        }

        public get bytesPerEle():number {
            return 4;
        }

        public get indexBytesPerEle():number {
            return 2;
        }

        public get numIndex():number {
            return this.m_indexRawData.byteLength / this.indexBytesPerEle;
        }

        public get numVertices():number {
            return this.m_vertexRawData.byteLength / this.m_vertexStride / this.bytesPerEle;
        }

        public get numTriangles():number {
            return this.numIndex / 3;
        }

        public update(gl:WebGLRenderingContext):void {
            this.clearBuffer(gl);
            this.m_vertexBuffer = gl.createBuffer();
            if (!this.m_vertexBuffer) {
                console.log('Failed to create the buffer object');
                return;
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, this.m_vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.m_vertexRawData, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            this.m_indexBuffer = gl.createBuffer();
            if (!this.m_indexBuffer) {
                console.log('Failed to create the buffer object');
                return;
            }
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.m_indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.m_indexRawData, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

            this.m_bufferDirty = false;
        }
        public getVertexValue(index:number):number {
            if (this.m_vertexBy == null) {
                this.m_vertexBy = new ByteArray(this.m_vertexRawData, Endian.LITTLE_ENDIAN);
            }
            this.m_vertexBy.pos = index * this.bytesPerEle;
            return this.m_vertexBy.readFloat32();
        }

        public getIndexValue(index:number):number {
            if (this.m_indexBy == null) {
                this.m_indexBy = new ByteArray(this.m_indexRawData, Endian.LITTLE_ENDIAN);
            }
            this.m_indexBy.pos = index * this.indexBytesPerEle;
            return this.m_indexBy.readShort();
        }

        public clearBuffer(gl:WebGLRenderingContext):void {
            if (this.m_vertexBuffer != null) {
                gl.deleteBuffer(this.m_vertexBuffer);
                this.m_vertexBuffer = null;
            }
            if (this.m_indexBuffer != null) {
                gl.deleteBuffer(this.m_indexBuffer);
                this.m_indexBuffer = null;
            }
        }
        
        public onContextDispose(event:EventBase):void {
            var gl:WebGLRenderingContext = event.data as WebGLRenderingContext;
            this.clearBuffer(gl);
        }

        public dispose():void {
            GlobelConst.eventDispatcher.removeEventListener(EventBase.CONTEXT_DISPOSE, this, this.onContextDispose);
            var gl:WebGLRenderingContext = GlobelConst.gl;
            this.clearBuffer(gl);
            this.parentGeometry = null;
        }
    }
}