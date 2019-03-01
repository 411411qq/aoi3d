module aoi {
    export class FrameBufferTexture extends TextureBase {
        protected _width:number;
        protected _height:number;
        protected _frameBuffer:WebGLFramebuffer;
        protected _renderBuffer:WebGLRenderbuffer;
        private _renderBufferWidth:number;
        private _renderBufferHeight:number;
        constructor(w:number, h:number) 
        {
            super();
            this._width = w;
            this._height = h;
            this._renderBufferWidth = -1;
            this._renderBufferHeight = -1;
        }
        public getTextures(gl:WebGLRenderingContext):WebGLTexture {
            return this.texture;
        }
        protected createFrameBuffer(gl:WebGLRenderingContext):void
        {
            if(this._frameBuffer != null || this.texture != null || this._renderBuffer != null)
            {
                return;
            }
            this._frameBuffer = gl.createFramebuffer();
            if(this._frameBuffer == null)
            {
                console.log('Failed to create frame buffer object');
                return;
            }
            this.texture = gl.createTexture();
            if (this.texture == null) 
            {
                console.log('Failed to create texture object');
                return;
            }
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._width, this._height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            
            this._renderBuffer = gl.createRenderbuffer();
            if (!this._renderBuffer)
            {
                console.log('Failed to create renderbuffer object');
                return;
            }
            gl.bindRenderbuffer(gl.RENDERBUFFER, this._renderBuffer);
            if (this._width != this._renderBufferWidth || this._height != this._renderBufferHeight) 
            {
                this._renderBufferWidth = this._width;
                this._renderBufferHeight = this._height;
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this._width, this._height);
            }

            gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._renderBuffer);

            var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
            if (gl.FRAMEBUFFER_COMPLETE !== e)
            {
                console.log('Frame buffer object is incomplete: ' + e.toString());
                return;
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        }
        protected beforeDraw(gl:WebGLRenderingContext):void
        {
            this.createFrameBuffer(gl);
            gl.bindRenderbuffer(gl.RENDERBUFFER, this._renderBuffer);
            if (this._width != this._renderBufferWidth || this._height != this._renderBufferHeight) 
            {
                this._renderBufferWidth = this._width;
                this._renderBufferHeight = this._height;
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this._width, this._height);
            }

            gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._renderBuffer);

        }
        protected afterDraw(gl:WebGLRenderingContext):void
        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        }
        protected onContextDispose(event:base.EventBase):void {
            super.onContextDispose(event);
            var gl:WebGLRenderingContext = GlobelConst.gl;
            if(this._frameBuffer != null)
            {
                gl.deleteFramebuffer(this._frameBuffer);
                this._frameBuffer = null;
            }
            if(this._renderBuffer != null)
            {
                gl.deleteRenderbuffer(this._renderBuffer);
                this._renderBuffer = null;
            }
        }
    }
}