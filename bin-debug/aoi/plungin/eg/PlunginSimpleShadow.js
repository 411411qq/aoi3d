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
    /** 渲染灰度图 */
    var PlunginSimpleShadow = (function (_super) {
        __extends(PlunginSimpleShadow, _super);
        function PlunginSimpleShadow(precision) {
            if (precision === void 0) { precision = 2; }
            var _this = _super.call(this, precision) || this;
            _this._key = "simpleShadow";
            _this.limitNum = 1;
            _this.type = aoi.PlunginDefine.SIMPLE_SHADOW;
            _this.txtIndex = 0;
            _this.shadowVar = new math.Vector3D();
            _this._replaceType = aoi.PlunginDefine.REPLACE_MAIN;
            _this._replaceWeight = 2;
            return _this;
        }
        PlunginSimpleShadow.prototype.getAttArr = function () {
            var arr = _super.prototype.getAttArr.call(this);
            arr.push({ type: 2, name: "u_shadowVar" });
            return arr;
        };
        PlunginSimpleShadow.prototype.updateCode = function () {
            this._fragmentCode.push(new aoi.OpenGlCodeVo(30001, this, this.genFramentCode2_shadow));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(90000, this, this.genFramentCode_shadow));
        };
        PlunginSimpleShadow.prototype.active = function (gl, subGeo, target, camera, program, renderType) {
            _super.prototype.active.call(this, gl, subGeo, target, camera, program, renderType);
            gl.activeTexture(gl["TEXTURE" + this.txtIndex]);
            gl.bindTexture(gl.TEXTURE_2D, target.material.getTextures(gl));
            gl.uniform1i(program["u_Sampler"], this.txtIndex);
            gl.uniform4fv(program["u_Sampler_uv"], target.material.getOffsetData().elements);
            if (camera.projection.type == 1) {
                this.shadowVar.x = 1;
            }
            else {
                this.shadowVar.x = camera.projection.far;
            }
            gl.uniform4fv(program["u_shadowVar"], this.shadowVar.elements);
        };
        PlunginSimpleShadow.prototype.genFramentCode2_shadow = function () {
            var str = 'uniform vec4 u_shadowVar;\n';
            return str;
        };
        PlunginSimpleShadow.prototype.genFramentCode_shadow = function () {
            var str = "float mv = max(outcolor.x, outcolor.y);\n";
            str += "mv = max(mv, outcolor.z);\n";
            str += "if(mv > 1.0){\n";
            str += "outcolor.xyz = outcolor.xyz / mv;\n";
            str += "}\n";
            str += 'gl_FragColor = vec4(v_wpos.z / u_shadowVar.x, outcolor.w, v_wpos.z / u_shadowVar.x, 1.0);\n';
            str += '}\n';
            return str;
        };
        return PlunginSimpleShadow;
    }(aoi.PlunginSimpleBase));
    aoi.PlunginSimpleShadow = PlunginSimpleShadow;
    __reflect(PlunginSimpleShadow.prototype, "aoi.PlunginSimpleShadow");
})(aoi || (aoi = {}));
//# sourceMappingURL=PlunginSimpleShadow.js.map