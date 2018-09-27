module aoi {
    export class Material implements IMaterial
    {
        private texture:TextureBase; 
        private data:math.Vector3D;
        constructor(txt:TextureBase)
        {
            this.texture = txt;
            this.data = new math.Vector3D(1,1,0,0);
        }
        public setData(scale_x:number, scale_y:number, offset_x:number, offset_y:number):void
        {
            this.data.x = scale_x;
            this.data.y = scale_y;
            this.data.z = offset_x;
            this.data.w = offset_y;
        }
        public setTexture(texture:TextureBase):void
        {
            this.texture = texture;
        }
        public getOffsetData():math.Vector3D
        {
            return this.data;
        }
        public getTextures(gl:WebGLRenderingContext):WebGLTexture 
        {
            return this.texture.getTextures(gl);
        }
    }
}