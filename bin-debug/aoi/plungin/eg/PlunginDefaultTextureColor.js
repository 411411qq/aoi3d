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
    var PlunginDefaultTextureColor = (function (_super) {
        __extends(PlunginDefaultTextureColor, _super);
        function PlunginDefaultTextureColor() {
            var _this = _super.call(this) || this;
            _this._key = "TColor";
            _this.limitNum = 1;
            _this.type = aoi.PlunginDefine.DEFAULT_COLOR;
            _this._replaceType = aoi.PlunginDefine.REPLACE_TEXTURE_COLOR;
            return _this;
        }
        PlunginDefaultTextureColor.prototype.updateCode = function (renderType) {
            this._fragmentCode.push(new aoi.OpenGlCodeVo(70000, this, this.genFramentCode4));
        };
        PlunginDefaultTextureColor.prototype.genFramentCode4 = function () {
            var str = "";
            str += 'vec4 outcolor = texture2D(u_Sampler, texCoord);\n';
            return str;
        };
        return PlunginDefaultTextureColor;
    }(aoi.PlunginVoBase));
    aoi.PlunginDefaultTextureColor = PlunginDefaultTextureColor;
    __reflect(PlunginDefaultTextureColor.prototype, "aoi.PlunginDefaultTextureColor");
})(aoi || (aoi = {}));
//# sourceMappingURL=PlunginDefaultTextureColor.js.map