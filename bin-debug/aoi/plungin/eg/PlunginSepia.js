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
    var PlunginSepia = (function (_super) {
        __extends(PlunginSepia, _super);
        function PlunginSepia(amount) {
            if (amount === void 0) { amount = 0; }
            var _this = _super.call(this) || this;
            _this._key = "sepia";
            _this.limitNum = 1;
            _this.type = aoi.PlunginDefine.SEPIA;
            _this._amount = 0;
            return _this;
        }
        PlunginSepia.prototype.getAttArr = function () {
            var arr = [];
            arr.push({ type: 2, name: "u_sepiaamount" });
            return arr;
        };
        PlunginSepia.prototype.active = function (gl, subGeo, target, camera, program, renderType) {
            gl.uniform1f(program["u_sepiaamount"], this._amount);
        };
        PlunginSepia.prototype.updateCode = function () {
            this._fragmentCode.push(new aoi.OpenGlCodeVo(50, this, this.genFramentCode1));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(75003, this, this.genFramentCode2));
        };
        PlunginSepia.prototype.genFramentCode1 = function () {
            var str = 'uniform float u_sepiaamount;\n';
            return str;
        };
        PlunginSepia.prototype.genFramentCode2 = function () {
            var str = "";
            str += "float r1 = outcolor.r;\n";
            str += "float g1 = outcolor.g;\n";
            str += "float b1 = outcolor.b;\n";
            str += "outcolor.r = min(1.0, (r1 * (1.0 - (0.607 * u_sepiaamount))) + (g1 * (0.769 * u_sepiaamount)) + (b1 * (0.189 * u_sepiaamount)));\n";
            str += "outcolor.g = min(1.0, (r1 * 0.349 * u_sepiaamount) + (g1 * (1.0 - (0.314 * u_sepiaamount))) + (b1 * 0.168 * u_sepiaamount));\n";
            str += "outcolor.b = min(1.0, (r1 * 0.272 * u_sepiaamount) + (g1 * 0.534 * u_sepiaamount) + (b1 * (1.0 - (0.869 * u_sepiaamount))));\n";
            return str;
        };
        return PlunginSepia;
    }(aoi.PlunginVoBase));
    aoi.PlunginSepia = PlunginSepia;
    __reflect(PlunginSepia.prototype, "aoi.PlunginSepia");
})(aoi || (aoi = {}));
//# sourceMappingURL=PlunginSepia.js.map