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
    var PlungingZoomBlur = (function (_super) {
        __extends(PlungingZoomBlur, _super);
        function PlungingZoomBlur(centerx, centery, strength) {
            var _this = _super.call(this) || this;
            _this.key = "ZoomBlur";
            _this.limitNum = 1;
            _this.type = aoi.PlunginDefine.ZOOM_BLUR;
            _this._zoomData = new Float32Array(2);
            _this.setData(centerx, centery, strength);
            return _this;
        }
        PlungingZoomBlur.prototype.getPrePlungin = function () {
            var arr = new Array();
            arr.push(new aoi.PlunginTextureSize());
            return arr;
        };
        PlungingZoomBlur.prototype.setData = function (centerx, centery, strength) {
            this._zoomData[0] = centerx;
            this._zoomData[1] = centery;
            this._zoomData[2] = strength;
        };
        PlungingZoomBlur.prototype.getAttArr = function () {
            var arr = [];
            arr.push({ type: 2, name: "u_zoomData" });
            return arr;
        };
        PlungingZoomBlur.prototype.active = function (gl, subGeo, target, camera, program, renderType) {
            gl.uniform3fv(program["u_zoomData"], this._zoomData);
        };
        PlungingZoomBlur.prototype.updateCode = function (renderType) {
            this._fragmentCode.push(new aoi.OpenGlCodeVo(50, this, this.genFramentCode1));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(75004, this, this.genFramentCode2));
        };
        PlungingZoomBlur.prototype.genFramentCode1 = function () {
            var str = 'uniform vec3 u_zoomData;\n';
            return str;
        };
        PlungingZoomBlur.prototype.genFramentCode2 = function () {
            var str = "";
            str += "";
            return str;
        };
        return PlungingZoomBlur;
    }(aoi.PlunginVoBase));
    aoi.PlungingZoomBlur = PlungingZoomBlur;
    __reflect(PlungingZoomBlur.prototype, "aoi.PlungingZoomBlur");
})(aoi || (aoi = {}));
//# sourceMappingURL=PlungingZoomBlur.js.map