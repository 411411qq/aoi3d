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
    var PlunginSimpleBase = (function (_super) {
        __extends(PlunginSimpleBase, _super);
        function PlunginSimpleBase(precision) {
            var _this = _super.call(this, precision) || this;
            _this._key = "";
            _this.limitNum = 1;
            _this.type = aoi.PlunginDefine.SIMPLE;
            _this.txtIndex = 0;
            return _this;
        }
        PlunginSimpleBase.prototype.updateCode = function () {
            this._vertexCode.push(new aoi.OpenGlCodeVo(0, this, this.genVertexCode1));
            this._vertexCode.push(new aoi.OpenGlCodeVo(30000, this, this.genVertexCode2));
            this._vertexCode.push(new aoi.OpenGlCodeVo(50000, this, this.genVertexCode3));
            this._vertexCode.push(new aoi.OpenGlCodeVo(70000, this, this.genVertexCode4));
            this._vertexCode.push(new aoi.OpenGlCodeVo(90000, this, this.genVertexCode5));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(0, this, this.genFramentCode1));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(30000, this, this.genFramentCode2));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(50000, this, this.genFramentCode3));
        };
        PlunginSimpleBase.prototype.genVertexCode1 = function () {
            var str = 'attribute vec4 a_Position;\n' +
                'attribute vec2 a_TexCoord;\n' +
                'uniform mat4 u_MvpMatrix;\n' +
                'uniform vec4 u_Sampler_uv;\n' +
                'varying vec2 v_TexCoord;\n';
            return str;
        };
        PlunginSimpleBase.prototype.genVertexCode2 = function () {
            var str = 'void main() {\n' +
                'vec2 n_TexCoord = calUvOffset(a_TexCoord, u_Sampler_uv);\n' +
                'vec4 n_Position = a_Position;\n';
            return str;
        };
        PlunginSimpleBase.prototype.genVertexCode3 = function () {
            var str = "";
            str += "vec4 endPos = u_MvpMatrix * n_Position;\n";
            str += "gl_Position = endPos;\n";
            return str;
        };
        PlunginSimpleBase.prototype.genVertexCode4 = function () {
            var str = 'v_TexCoord = n_TexCoord;\n';
            return str;
        };
        PlunginSimpleBase.prototype.genVertexCode5 = function () {
            var str = '}\n';
            return str;
        };
        PlunginSimpleBase.prototype.genFramentCode2 = function () {
            var str = 'varying vec2 v_TexCoord;\n' +
                'uniform sampler2D u_Sampler;\n';
            return str;
        };
        PlunginSimpleBase.prototype.genFramentCode3 = function () {
            var str = 'void main() {\n';
            str += "vec2 texCoord = v_TexCoord;\n";
            return str;
        };
        PlunginSimpleBase.prototype.getPrePlungin = function () {
            var arr = new Array();
            arr.push(new aoi.PlunginCaculateUV());
            arr.push(new aoi.PlunginDefaultTextureColor());
            return arr;
        };
        PlunginSimpleBase.prototype.getAttArr = function () {
            var arr = [];
            arr.push({ type: 1, name: "a_Position" });
            arr.push({ type: 1, name: "a_TexCoord" });
            arr.push({ type: 2, name: "u_MvpMatrix" });
            arr.push({ type: 2, name: "u_Sampler" });
            arr.push({ type: 2, name: "u_Sampler_uv" });
            return arr;
        };
        PlunginSimpleBase.prototype.genTextureIndex = function () {
            this.txtIndex = this.pColloct.getTextureObj();
        };
        PlunginSimpleBase.prototype.active = function (gl, subGeo, target, camera, program, renderType) {
            var buffer = subGeo.getVertexBuffer(gl), FSIZE = subGeo.bytesPerEle, perLen = subGeo.vertexStride;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            this.initAttributeVariable(gl, program["a_Position"], buffer, 3, FSIZE * perLen, 0);
            this.initAttributeVariable(gl, program["a_TexCoord"], buffer, 2, FSIZE * perLen, FSIZE * 3);
            gl.uniformMatrix4fv(program["u_MvpMatrix"], false, target.getFinalMatrix().elements);
        };
        PlunginSimpleBase.prototype.disactive = function (gl, program) {
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.disableVertexAttribArray(program["a_Position"]);
            gl.disableVertexAttribArray(program["a_TexCoord"]);
        };
        return PlunginSimpleBase;
    }(aoi.PlunginMainBase));
    aoi.PlunginSimpleBase = PlunginSimpleBase;
    __reflect(PlunginSimpleBase.prototype, "aoi.PlunginSimpleBase");
})(aoi || (aoi = {}));
//# sourceMappingURL=PlunginSimpleBase.js.map