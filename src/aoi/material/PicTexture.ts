module aoi {
    export class PicTexture extends TextureBase
    {
        private m_retry:boolean;
        public mimapType:number;
        public fiterType:number;
        public repreatType:number;
        public m_image:HTMLImageElement;

        constructor(image:HTMLImageElement) {
            super();
            this.m_isReady = false;
            this.mimapType = 0;
            this.fiterType = 0;
            this.repreatType = 0;
            this.m_retry = false;
            this.m_image = image;
        }

        public getTextures(gl:WebGLRenderingContext):WebGLTexture {
            if (this.texture == null || this.m_retry == true) {
                if (this.texture != null)gl.deleteTexture(this.texture);
                this.texture = gl.createTexture();
                if (!this.texture) {
                    return null;
                }
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                if (this.repreatType == 1) {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                }
                else {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                }
                if (this.mimapType == 0) {
                    if (this.fiterType == 0) {
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    }
                    else {
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                    }
                }
                else {
                    if (this.fiterType == 0) {
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST_MIPMAP_LINEAR);
                    }
                    else {
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                    }
                }
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.m_image);
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