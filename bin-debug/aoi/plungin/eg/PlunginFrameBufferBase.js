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
    var PlunginFrameBufferBase = (function (_super) {
        __extends(PlunginFrameBufferBase, _super);
        function PlunginFrameBufferBase(precision) {
            if (precision === void 0) { precision = 2; }
            var _this = _super.call(this, precision) || this;
            _this._key = "fbb";
            _this.type = aoi.PlunginDefine.FRAMEOBJEC_BASE;
            _this.limitNum = 1;
            _this.txtIndex = 0;
            _this._replaceType = aoi.PlunginDefine.REPLACE_MAIN;
            _this._replaceWeight = 3;
            return _this;
        }
        PlunginFrameBufferBase.prototype.getPrePlungin = function () {
            var arr = new Array();
            arr.push(new aoi.PlunginDefaultTextureColor());
            return arr;
        };
        PlunginFrameBufferBase.prototype.getAttArr = function () {
            var arr = [];
            arr.push({ type: 1, name: "a_Position" });
            arr.push({ type: 2, name: "u_Sampler" });
            return arr;
        };
        PlunginFrameBufferBase.prototype.active = function (gl, subGeo, target, camera, program, renderType) {
            _super.prototype.active.call(this, gl, subGeo, target, camera, program, renderType);
            var buffer = subGeo.getVertexBuffer(gl), FSIZE = subGeo.bytesPerEle, perLen = subGeo.vertexStride;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            this.initAttributeVariable(gl, program["a_Position"], buffer, 3, FSIZE * perLen, 0);
            gl.activeTexture(gl["TEXTURE" + this.txtIndex]);
            gl.bindTexture(gl.TEXTURE_2D, target.material.getTextures(gl));
            gl.uniform1i(program["u_Sampler"], this.txtIndex);
        };
        PlunginFrameBufferBase.prototype.updateCode = function () {
            this._vertexCode.push(new aoi.OpenGlCodeVo(0, this, this.genVertexCode1));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(0, this, this.genFramentCode1));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(30000, this, this.genFramentCode2));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(50000, this, this.genFramentCode3));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(90000, this, this.genFramentCode_normal));
        };
        PlunginFrameBufferBase.prototype.disactive = function (gl, program) {
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.disableVertexAttribArray(program["a_Position"]);
        };
        PlunginFrameBufferBase.prototype.genVertexCode1 = function () {
            var str = "";
            str += 'attribute vec4 a_Position;\n';
            str += "varying vec2 v_TexCoord;\n";
            str += "void main() {\n";
            str += "v_TexCoord = a_Position.xy * 0.5 + 0.5;\n";
            str += "gl_Position = vec4(a_Position.xyz, 1.0);\n";
            str += "}\n";
            return str;
        };
        PlunginFrameBufferBase.prototype.genFramentCode2 = function () {
            var str = 'varying vec2 v_TexCoord;\n' +
                'uniform sampler2D u_Sampler;\n';
            return str;
        };
        PlunginFrameBufferBase.prototype.genFramentCode3 = function () {
            var str = 'void main() {\n';
            str += "vec2 texCoord = v_TexCoord;\n";
            return str;
        };
        PlunginFrameBufferBase.prototype.genFramentCode_normal = function () {
            var str = "float mv = max(outcolor.x, outcolor.y);\n";
            str += "mv = max(mv, outcolor.z);\n";
            str += "if(mv > 1.0){\n";
            str += "outcolor.xyz = outcolor.xyz / mv;\n";
            str += "}\n";
            str += 'gl_FragColor = outcolor;\n';
            str += '}\n';
            return str;
        };
        return PlunginFrameBufferBase;
    }(aoi.PlunginMainBase));
    aoi.PlunginFrameBufferBase = PlunginFrameBufferBase;
    __reflect(PlunginFrameBufferBase.prototype, "aoi.PlunginFrameBufferBase");
})(aoi || (aoi = {}));
//# sourceMappingURL=PlunginFrameBufferBase.js.map