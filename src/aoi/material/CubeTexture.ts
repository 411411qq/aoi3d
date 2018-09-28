module aoi {
    export class CubeTexture extends TextureBase
    {
        private m_retry:boolean;
        public mimapType:number;
        public fiterType:number;
        public repreatType:number;
        public m_images:Array<HTMLImageElement>;

        constructor(images:Array<HTMLImageElement>) 
        {
            super();
            this.m_isReady = false;
            this.mimapType = 0;
            this.fiterType = 0;
            this.repreatType = 0;
            this.m_retry = false;
            this.m_images = images;
        }
        public getTextures(gl:WebGLRenderingContext):WebGLTexture 
        {
            if (this.texture == null || this.m_retry == true) 
            {
                if (this.texture != null)gl.deleteTexture(this.texture);
                this.texture = gl.createTexture();
                if (!this.texture) {
                    return null;
                }
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
                for( var i:number = 0; i < 6; i ++) 
                {
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.m_images[i]);
                }
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

                var err = gl.getError();
                this.m_retry = false;
                if (err != 0) {
                    this.m_retry = true;
                }
                else {
                    this.m_isReady = true;
                }
            }
            return this.texture;
        }
    }
}