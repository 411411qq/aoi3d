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
    /** 渲染扰动 */
    var PlunginSimplePerturbation = (function (_super) {
        __extends(PlunginSimplePerturbation, _super);
        function PlunginSimplePerturbation() {
            var _this = _super.call(this) || this;
            _this._key = "simplePertur";
            _this.limitNum = 1;
            _this.type = aoi.PlunginDefine.SIMPLE_PERTURBATION;
            _this.txtIndex = 0;
            _this._replaceType = aoi.PlunginDefine.REPLACE_MAIN;
            _this._replaceWeight = 2;
            return _this;
        }
        PlunginSimplePerturbation.prototype.active = function (gl, subGeo, target, camera, program, renderType) {
            _super.prototype.active.call(this, gl, subGeo, target, camera, program, renderType);
            var fbo = aoi.FrameBufferManager.instance.getFrameBufferObject(aoi.Define.FBO_PERTURBATION);
            gl.activeTexture(gl["TEXTURE" + this.txtIndex]);
            gl.bindTexture(gl.TEXTURE_2D, fbo.texture);
            gl.uniform1i(program["u_Sampler"], this.txtIndex);
            gl.uniform4fv(program["u_Sampler_uv"], target.material.getOffsetData().elements);
        };
        PlunginSimplePerturbation.prototype.updateCode = function () {
            _super.prototype.updateCode.call(this);
            this._fragmentCode.push(new aoi.OpenGlCodeVo(90000, this, this.genFramentCode_normal));
        };
        PlunginSimplePerturbation.prototype.genFramentCode_normal = function () {
            var str = "float mv = max(outcolor.x, outcolor.y);\n";
            str += "mv = max(mv, outcolor.z);\n";
            str += "if(mv > 1.0){\n";
            str += "outcolor.xyz = outcolor.xyz / mv;\n";
            str += "}\n";
            str += 'gl_FragColor = outcolor;\n';
            str += '}\n';
            return str;
        };
        return PlunginSimplePerturbation;
    }(aoi.PlunginSimpleBase));
    aoi.PlunginSimplePerturbation = PlunginSimplePerturbation;
    __reflect(PlunginSimplePerturbation.prototype, "aoi.PlunginSimplePerturbation");
})(aoi || (aoi = {}));
//# sourceMappingURL=PlunginSimplePerturbation.js.map