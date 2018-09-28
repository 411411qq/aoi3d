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
    var CubeTexture = (function (_super) {
        __extends(CubeTexture, _super);
        function CubeTexture(images) {
            var _this = _super.call(this) || this;
            _this.m_isReady = false;
            _this.mimapType = 0;
            _this.fiterType = 0;
            _this.repreatType = 0;
            _this.m_retry = false;
            _this.m_images = images;
            return _this;
        }
        CubeTexture.prototype.getTextures = function (gl) {
            if (this.texture == null || this.m_retry == true) {
                if (this.texture != null)
                    gl.deleteTexture(this.texture);
                this.texture = gl.createTexture();
                if (!this.texture) {
                    return null;
                }
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
                for (var i = 0; i < 6; i++) {
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
        };
        return CubeTexture;
    }(aoi.TextureBase));
    aoi.CubeTexture = CubeTexture;
    __reflect(CubeTexture.prototype, "aoi.CubeTexture");
})(aoi || (aoi = {}));
//# sourceMappingURL=CubeTexture.js.map