module aoi {
    export class TxtTexture extends TextureBase{
        private _textCtx:CanvasRenderingContext2D;
        public mimapType:number;
        public fiterType:number;
        public repreatType:number;
        private m_retry:boolean;
        constructor()
        {
            super();
            this.m_isReady = false;
            this.mimapType = 0;
            this.fiterType = 0;
            this.repreatType = 0;
            this.m_retry = false;
        }
        public get isReady():boolean {
            if(this._textCtx == null)
            {
                return false;
            }
            return true;
        }
        public set textCtx(value:CanvasRenderingContext2D)
        {
            this._textCtx = value;
            if(this.texture != null) {
                var gl:WebGLRenderingContext = GlobelConst.gl;
                gl.deleteTexture(this.texture);
                this.texture = null;
            }
        }
        public getTextures(gl:WebGLRenderingContext):WebGLTexture {
            if(this.texture == null)
            {
                this.texture = gl.createTexture();
                
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                var textCanvas:HTMLCanvasElement = this._textCtx.canvas;
                if (this.repreatType == 0) {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                }
                else {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                }
                if (this.mimapType == 0) {
                    if (this.fiterType == 0) {
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                    }
                    else {
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    }
                }
                else {
                    if (this.fiterType == 0) {
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                    }
                    else {
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST_MIPMAP_LINEAR);
                    }
                }
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
            }
            return this.texture;
        }
    }
}