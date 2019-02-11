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
    /** todo */
    var PlunginDenoise = (function (_super) {
        __extends(PlunginDenoise, _super);
        function PlunginDenoise(strength) {
            var _this = _super.call(this) || this;
            _this.key = "dnoise";
            _this.limitNum = 1;
            _this.type = aoi.PlunginDefine.DNOISE;
            _this._strength = strength;
            return _this;
        }
        PlunginDenoise.prototype.getAttArr = function () {
            var arr = [];
            arr.push({ type: 2, name: "u_noiseStrength" });
            return arr;
        };
        PlunginDenoise.prototype.getPrePlungin = function () {
            var arr = new Array();
            arr.push(new aoi.PlunginTextureSize());
            return arr;
        };
        PlunginDenoise.prototype.active = function (gl, subGeo, target, camera, program, renderType) {
            gl.uniform1f(program["u_noiseStrength"], this._strength);
        };
        PlunginDenoise.prototype.updateCode = function (renderType) {
            this._fragmentCode.push(new aoi.OpenGlCodeVo(51, this, this.genFramentCode1));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(74000, this, this.genFramentCode2));
        };
        PlunginDenoise.prototype.genFramentCode1 = function () {
            var str = 'uniform float u_noiseStrength;\n';
            return str;
        };
        PlunginDenoise.prototype.genFramentCode2 = function () {
            var str = "";
            return str;
        };
        return PlunginDenoise;
    }(aoi.PlunginVoBase));
    aoi.PlunginDenoise = PlunginDenoise;
    __reflect(PlunginDenoise.prototype, "aoi.PlunginDenoise");
})(aoi || (aoi = {}));
//# sourceMappingURL=PlunginDenoise.js.map