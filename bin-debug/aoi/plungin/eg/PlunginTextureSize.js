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
    /** 贴图尺寸 */
    var PlunginTextureSize = (function (_super) {
        __extends(PlunginTextureSize, _super);
        function PlunginTextureSize(type, alpha) {
            if (type === void 0) { type = 0; }
            if (alpha === void 0) { alpha = 0; }
            var _this = _super.call(this) || this;
            _this._key = "t_size";
            _this.limitNum = 1;
            _this.type = aoi.PlunginDefine.TEXTURE_SIZE;
            _this._size = new Float32Array(2);
            return _this;
        }
        PlunginTextureSize.prototype.getAttArr = function () {
            var arr = [];
            arr.push({ type: 2, name: "u_textureSize" });
            return arr;
        };
        PlunginTextureSize.prototype.active = function (gl, subGeo, target, camera, program, renderType) {
            var vec = target.material.getSize();
            this._size[0] = vec.x;
            this._size[1] = vec.y;
            gl.uniform2fv(program["u_textureSize"], this._size);
        };
        PlunginTextureSize.prototype.updateCode = function () {
            this._fragmentCode.push(new aoi.OpenGlCodeVo(51, this, this.genFramentCode1));
        };
        PlunginTextureSize.prototype.genFramentCode1 = function () {
            var str = 'uniform vec2 u_textureSize;\n';
            return str;
        };
        return PlunginTextureSize;
    }(aoi.PlunginVoBase));
    aoi.PlunginTextureSize = PlunginTextureSize;
    __reflect(PlunginTextureSize.prototype, "aoi.PlunginTextureSize");
})(aoi || (aoi = {}));
//# sourceMappingURL=PlunginTextureSize.js.map