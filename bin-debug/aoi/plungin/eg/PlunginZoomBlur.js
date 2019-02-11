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
    var PlunginZoomBlur = (function (_super) {
        __extends(PlunginZoomBlur, _super);
        function PlunginZoomBlur(centerx, centery, strength, runNum) {
            if (runNum === void 0) { runNum = 10; }
            var _this = _super.call(this) || this;
            _this._runNum = "";
            var r = Math.floor(runNum);
            _this._key = "ZB" + r;
            _this._runNum = r + ".0";
            _this.limitNum = 1;
            _this.type = aoi.PlunginDefine.ZOOM_BLUR;
            _this._replaceType = aoi.PlunginDefine.REPLACE_TEXTURE_COLOR;
            _this._replaceWeight = 2;
            _this._zoomData = new Float32Array(3);
            _this.setData(centerx, centery, strength);
            return _this;
        }
        PlunginZoomBlur.prototype.getPrePlungin = function () {
            var arr = new Array();
            arr.push(new aoi.PlunginTextureSize());
            arr.push(new aoi.PlunginRandom());
            return arr;
        };
        PlunginZoomBlur.prototype.setData = function (centerx, centery, strength) {
            this._zoomData[0] = centerx;
            this._zoomData[1] = centery;
            this._zoomData[2] = strength;
        };
        PlunginZoomBlur.prototype.getAttArr = function () {
            var arr = [];
            arr.push({ type: 2, name: "u_zoomData" });
            return arr;
        };
        PlunginZoomBlur.prototype.active = function (gl, subGeo, target, camera, program, renderType) {
            gl.uniform3fv(program["u_zoomData"], this._zoomData);
        };
        PlunginZoomBlur.prototype.updateCode = function (renderType) {
            this._fragmentCode.push(new aoi.OpenGlCodeVo(50, this, this.genFramentCode1));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(70000, this, this.genFramentCode2));
        };
        PlunginZoomBlur.prototype.genFramentCode1 = function () {
            var str = 'uniform vec3 u_zoomData;\n';
            return str;
        };
        PlunginZoomBlur.prototype.genFramentCode2 = function () {
            var str = "";
            str += "vec4 outcolor = vec4(0.0);\n";
            str += "float total = 0.0;\n";
            str += "vec2 toCenter = u_zoomData.xy - texCoord * u_textureSize;\n";
            str += "float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n";
            str += "for (float t = 0.0; t <= " + this._runNum + "; t++) {\n";
            str += "float percent = (t + offset) / " + this._runNum + ";\n";
            str += "float weight = 4.0 * (percent - percent * percent);\n";
            str += "vec4 sample = texture2D(u_Sampler, texCoord + toCenter * percent * u_zoomData.z / u_textureSize);\n";
            str += "sample.rgb *= sample.a;\n";
            str += "outcolor += sample * weight;\n";
            str += "total += weight;\n";
            str += "}\n";
            str += "outcolor = outcolor / total;\n";
            return str;
        };
        return PlunginZoomBlur;
    }(aoi.PlunginVoBase));
    aoi.PlunginZoomBlur = PlunginZoomBlur;
    __reflect(PlunginZoomBlur.prototype, "aoi.PlunginZoomBlur");
})(aoi || (aoi = {}));
//# sourceMappingURL=PlunginZoomBlur.js.map