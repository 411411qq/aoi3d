var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var aoi;
(function (aoi) {
    var FrameBufferTexture = (function (_super) {
        __extends(FrameBufferTexture, _super);
        function FrameBufferTexture(w, h) {
            var _this = _super.call(this) || this;
            _this._width = w;
            _this._height = h;
            _this._renderBufferWidth = -1;
            _this._renderBufferHeight = -1;
            return _this;
        }
        FrameBufferTexture.prototype.getTextures = function (gl) {
            return this.texture;
        };
        FrameBufferTexture.prototype.createFrameBuffer = function (gl) {
            if (this._frameBuffer != null || this.texture != null || this._renderBuffer != null) {
                return;
            }
            this._frameBuffer = gl.createFramebuffer();
            if (this._frameBuffer == null) {
                console.log('Failed to create frame buffer object');
                return;
            }
            this.texture = gl.createTexture();
            if (this.texture == null) {
                console.log('Failed to create texture object');
                return;
            }
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._width, this._height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            this._renderBuffer = gl.createRenderbuffer();
            if (!this._renderBuffer) {
                console.log('Failed to create renderbuffer object');
                return;
            }
            gl.bindRenderbuffer(gl.RENDERBUFFER, this._renderBuffer);
            if (this._width != this._renderBufferWidth || this._height != this._renderBufferHeight) {
                this._renderBufferWidth = this._width;
                this._renderBufferHeight = this._height;
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this._width, this._height);
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._renderBuffer);
            var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
            if (gl.FRAMEBUFFER_COMPLETE !== e) {
                console.log('Frame buffer object is incomplete: ' + e.toString());
                return;
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        };
        FrameBufferTexture.prototype.beforeDraw = function (gl) {
            this.createFrameBuffer(gl);
            gl.bindRenderbuffer(gl.RENDERBUFFER, this._renderBuffer);
            if (this._width != this._renderBufferWidth || this._height != this._renderBufferHeight) {
                this._renderBufferWidth = this._width;
                this._renderBufferHeight = this._height;
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this._width, this._height);
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._renderBuffer);
        };
        FrameBufferTexture.prototype.afterDraw = function (gl) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        };
        FrameBufferTexture.prototype.onContextDispose = function (event) {
            _super.prototype.onContextDispose.call(this, event);
            var gl = aoi.GlobelConst.gl;
            if (this._frameBuffer != null) {
                gl.deleteFramebuffer(this._frameBuffer);
                this._frameBuffer = null;
            }
            if (this._renderBuffer != null) {
                gl.deleteRenderbuffer(this._renderBuffer);
                this._renderBuffer = null;
            }
        };
        return FrameBufferTexture;
    }(aoi.TextureBase));
    aoi.FrameBufferTexture = FrameBufferTexture;
    __reflect(FrameBufferTexture.prototype, "aoi.FrameBufferTexture");
})(aoi || (aoi = {}));
//# sourceMappingURL=FrameBufferTexture.js.map