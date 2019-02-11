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
    var PlunginRandom = (function (_super) {
        __extends(PlunginRandom, _super);
        function PlunginRandom() {
            var _this = _super.call(this) || this;
            _this._key = "Random";
            _this.limitNum = 1;
            _this.type = aoi.PlunginDefine.RONDOM_FUN;
            return _this;
        }
        PlunginRandom.prototype.updateCode = function (renderType) {
            this._fragmentCode.push(new aoi.OpenGlCodeVo(101, this, this.genFramentCode1));
        };
        PlunginRandom.prototype.genFramentCode1 = function () {
            var str = "";
            str += "float random(vec3 scale, float seed) {\n";
            str += "return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n";
            str += "}\n";
            return str;
        };
        return PlunginRandom;
    }(aoi.PlunginVoBase));
    aoi.PlunginRandom = PlunginRandom;
    __reflect(PlunginRandom.prototype, "aoi.PlunginRandom");
})(aoi || (aoi = {}));
//# sourceMappingURL=PlunginRandom.js.map