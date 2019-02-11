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
    var PlunginDenoise = (function (_super) {
        __extends(PlunginDenoise, _super);
        function PlunginDenoise(strength, exponent) {
            var _this = _super.call(this) || this;
            _this._key = "dnoise";
            _this.limitNum = 1;
            _this.type = aoi.PlunginDefine.DNOISE;
            _this._replaceType = aoi.PlunginDefine.REPLACE_TEXTURE_COLOR;
            _this._replaceWeight = 2;
            _this._strength = strength;
            _this._exponent = exponent;
            return _this;
        }
        PlunginDenoise.prototype.getAttArr = function () {
            var arr = [];
            arr.push({ type: 2, name: "u_dnoiseData" });
            return arr;
        };
        PlunginDenoise.prototype.getPrePlungin = function () {
            var arr = new Array();
            arr.push(new aoi.PlunginTextureSize());
            return arr;
        };
        PlunginDenoise.prototype.active = function (gl, subGeo, target, camera, program, renderType) {
            gl.uniform2f(program["u_dnoiseData"], this._strength, this._exponent);
        };
        PlunginDenoise.prototype.updateCode = function (renderType) {
            this._fragmentCode.push(new aoi.OpenGlCodeVo(51, this, this.genFramentCode1));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(70000, this, this.genFramentCode2));
        };
        PlunginDenoise.prototype.genFramentCode1 = function () {
            var str = 'uniform vec2 u_dnoiseData;\n';
            return str;
        };
        PlunginDenoise.prototype.genFramentCode2 = function () {
            var str = "";
            str += "vec4 center = texture2D(u_Sampler, texCoord);\n";
            str += "vec4 outcolor = vec4(0.0);\n";
            str += "float total = 0.0;\n";
            str += "for (float x = -4.0; x <= 4.0; x += 1.0) {\n";
            str += "for (float y = -4.0; y <= 4.0; y += 1.0) {\n";
            str += "vec4 sample = texture2D(u_Sampler, texCoord + vec2(x, y) / u_textureSize);\n";
            str += "float weight = 1.0 - abs(dot(sample.rgb - center.rgb, vec3(0.25)));\n";
            str += "weight = pow(weight, u_dnoiseData.y);\n";
            str += "outcolor += sample * weight;\n";
            str += "total += weight;}}\n";
            str += "outcolor = outcolor / total;\n";
            return str;
        };
        return PlunginDenoise;
    }(aoi.PlunginVoBase));
    aoi.PlunginDenoise = PlunginDenoise;
    __reflect(PlunginDenoise.prototype, "aoi.PlunginDenoise");
})(aoi || (aoi = {}));
//# sourceMappingURL=PlunginDenoise.js.map