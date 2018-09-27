module aoi {
    export interface ISubGeometry {
        getIndexBuffer(context:WebGLRenderingContext):WebGLBuffer;
        numIndex:number;
        getVertexBuffer(context:WebGLRenderingContext):WebGLBuffer;
        numVertices:number;
        vertexRawData:ArrayBuffer;
        indexRawData:ArrayBuffer;
        parentGeometry:Geometry;
        getVertexValue(index:number):number;
        getIndexValue(index:number):number;

        vertexStride:number;
        numTriangles:number;
        bytesPerEle:number;
    }
}