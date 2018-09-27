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
    /** 天空盒渲染 */
    var PlunginSkyBox = (function (_super) {
        __extends(PlunginSkyBox, _super);
        function PlunginSkyBox() {
            var _this = _super.call(this) || this;
            _this.key = "skyBox";
            _this.limitNum = 1;
            _this.type = aoi.PlunginDefine.SKY_BOX;
            _this.txtIndex = 0;
            return _this;
        }
        PlunginSkyBox.prototype.updateCode = function (renderType) {
            this._vertexCode.push(new aoi.OpenGlCodeVo(0, this, this.genVertexCode1));
            this._vertexCode.push(new aoi.OpenGlCodeVo(30000, this, this.genVertexCode2));
            this._vertexCode.push(new aoi.OpenGlCodeVo(50000, this, this.genVertexCode3));
            this._vertexCode.push(new aoi.OpenGlCodeVo(70000, this, this.genVertexCode4));
            this._vertexCode.push(new aoi.OpenGlCodeVo(90000, this, this.genVertexCode5));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(0, this, this.genFramentCode1));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(30000, this, this.genFramentCode2));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(50000, this, this.genFramentCode3));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(70000, this, this.genFramentCode4));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(90000, this, this.genFramentCode_normal));
        };
        PlunginSkyBox.prototype.getAttArr = function () {
            var arr = [];
            arr.push({ type: 1, name: "a_Position" });
            arr.push({ type: 2, name: "u_MvpMatrix" });
            arr.push({ type: 2, name: "u_Sampler" });
            return arr;
        };
        PlunginSkyBox.prototype.active = function (gl, subGeo, target, camera, program, renderType) {
            var buffer = subGeo.getVertexBuffer(gl), FSIZE = subGeo.bytesPerEle, perLen = subGeo.vertexStride;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            this.initAttributeVariable(gl, program["a_Position"], buffer, 3, FSIZE * perLen, 0);
            gl.uniformMatrix4fv(program["u_MvpMatrix"], false, target.getFinalMatrix().elements);
            gl.activeTexture(gl["TEXTURE" + this.txtIndex]);
            gl.bindTexture(gl.TEXTURE_2D, target.material.getTextures(gl));
            gl.uniform1i(program["u_Sampler"], this.txtIndex);
        };
        PlunginSkyBox.prototype.disactive = function (gl, program) {
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.disableVertexAttribArray(program["a_Position"]);
        };
        PlunginSkyBox.prototype.genTextureIndex = function () {
            this.txtIndex = this.pColloct.getTextureObj();
        };
        PlunginSkyBox.prototype.genVertexCode1 = function () {
            var str = 'attribute vec3 a_Position;\n' +
                'uniform mat4 u_MvpMatrix;\n' +
                'varying vec2 v_TexCoord;\n';
            return str;
        };
        PlunginSkyBox.prototype.genVertexCode2 = function () {
            var str = 'void main() {\n' +
                'vec2 n_TexCoord = vec2(a_Position.x + 1.0, 1.0 - a_Position.y) / 2.0;\n' +
                'vec4 n_Position = vec4(a_Position,1.0);\n';
            return str;
        };
        PlunginSkyBox.prototype.genVertexCode3 = function () {
            var str = "";
            str += "vec4 endPos = u_MvpMatrix * n_Position;\n";
            str += "gl_Position = endPos;\n";
            return str;
        };
        PlunginSkyBox.prototype.genVertexCode4 = function () {
            var str = 'v_TexCoord = n_TexCoord;\n';
            return str;
        };
        PlunginSkyBox.prototype.genVertexCode5 = function () {
            var str = '}\n';
            return str;
        };
        PlunginSkyBox.prototype.genFramentCode1 = function () {
            var str = '#ifdef GL_ES\n' +
                'precision mediump float;\n' +
                '#endif\n';
            return str;
        };
        PlunginSkyBox.prototype.genFramentCode2 = function () {
            var str = 'varying vec2 v_TexCoord;\n' +
                'uniform sampler2D u_Sampler;\n';
            return str;
        };
        PlunginSkyBox.prototype.genFramentCode3 = function () {
            var str = 'void main() {\n';
            str += "vec2 texCoord = v_TexCoord;\n";
            return str;
        };
        PlunginSkyBox.prototype.genFramentCode4 = function () {
            var str = "";
            str += 'vec4 outcolor = texture2D(u_Sampler, texCoord);\n';
            return str;
        };
        PlunginSkyBox.prototype.genFramentCode_normal = function () {
            var str = 'gl_FragColor = outcolor;\n';
            str += '}\n';
            return str;
        };
        return PlunginSkyBox;
    }(aoi.PlunginVoBase));
    aoi.PlunginSkyBox = PlunginSkyBox;
    __reflect(PlunginSkyBox.prototype, "aoi.PlunginSkyBox");
})(aoi || (aoi = {}));
//# sourceMappingURL=PlunginSkyBox.js.map