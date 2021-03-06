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
    /** 粒子基础 */
    var PlunginParticleBase = (function (_super) {
        __extends(PlunginParticleBase, _super);
        function PlunginParticleBase(precision) {
            var _this = _super.call(this, precision) || this;
            _this.limitNum = 1;
            _this.txtIndex = 0;
            return _this;
        }
        PlunginParticleBase.prototype.getPrePlungin = function () {
            var arr = new Array();
            arr.push(new aoi.PlunginCaculateUV());
            return arr;
        };
        PlunginParticleBase.prototype.updateCode = function () {
            this._vertexCode.push(new aoi.OpenGlCodeVo(0, this, this.genVertexCode1));
            this._vertexCode.push(new aoi.OpenGlCodeVo(20000, this, this.genVertexCode2));
            this._vertexCode.push(new aoi.OpenGlCodeVo(30000, this, this.genVertexCode3));
            this._vertexCode.push(new aoi.OpenGlCodeVo(50000, this, this.genVertexCode4));
            this._vertexCode.push(new aoi.OpenGlCodeVo(70000, this, this.genVertexCode5));
            this._vertexCode.push(new aoi.OpenGlCodeVo(90000, this, this.genVertexCode6));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(0, this, this.genFramentCode1));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(30000, this, this.genFramentCode2));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(50000, this, this.genFramentCode3));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(70000, this, this.genFramentCode4));
        };
        PlunginParticleBase.prototype.disactive = function (gl, program) {
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.disableVertexAttribArray(program["a_Position"]);
            gl.disableVertexAttribArray(program["a_TexCoord"]);
            gl.disableVertexAttribArray(program["a_Time"]);
            gl.disableVertexAttribArray(program["a_Offset"]);
        };
        PlunginParticleBase.prototype.active = function (gl, subGeo, target, camera, program, renderType) {
            var buffer = subGeo.getVertexBuffer(gl), FSIZE = subGeo.bytesPerEle, perLen = subGeo.vertexStride;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            this.initAttributeVariable(gl, program["a_Position"], buffer, 4, FSIZE * perLen, 0);
            this.initAttributeVariable(gl, program["a_TexCoord"], buffer, 2, FSIZE * perLen, FSIZE * 4);
            this.initAttributeVariable(gl, program["a_Offset"], buffer, 3, FSIZE * perLen, FSIZE * 6);
            this.initAttributeVariable(gl, program["a_Time"], buffer, 3, FSIZE * perLen, FSIZE * 9);
            gl.uniformMatrix4fv(program["u_MvpMatrix"], false, target.getFinalMatrix().elements);
            var allPastTime = target.animatorData.pastTime * target.animatorData.playSpeed / 100;
            var an = target.geometry.animator;
            var pastTime;
            allPastTime += 0;
            if (an["reverse"] == true) {
                pastTime = (an["reverseTime"] - allPastTime) / 1000;
            }
            else {
                pastTime = allPastTime / 1000;
            }
            pastTime = pastTime % 500000;
            gl.uniform4f(program["u_nowTime"], 0.0, an["lifeTime"] * 1.0, pastTime, 1.0);
        };
        PlunginParticleBase.prototype.getAttArr = function () {
            var arr = [];
            arr.push({ type: 1, name: "a_Position" });
            arr.push({ type: 1, name: "a_TexCoord" });
            arr.push({ type: 1, name: "a_Time" });
            arr.push({ type: 1, name: "a_Offset" });
            arr.push({ type: 2, name: "u_MvpMatrix" });
            arr.push({ type: 2, name: "u_nowTime" });
            arr.push({ type: 2, name: "u_Sampler" });
            arr.push({ type: 2, name: "u_Sampler_uv" });
            return arr;
        };
        PlunginParticleBase.prototype.genTextureIndex = function () {
            this.txtIndex = this.pColloct.getTextureObj();
        };
        PlunginParticleBase.prototype.genVertexCode1 = function () {
            var str = 'attribute vec4 a_Position;\n' +
                'attribute vec2 a_TexCoord;\n' +
                'attribute vec4 a_q;\n' +
                'attribute vec3 a_Time;\n' +
                'attribute vec3 a_Offset;\n' +
                'uniform vec4 u_nowTime;\n' +
                'uniform mat4 u_MvpMatrix;\n' +
                'varying vec4 v_Time;\n' +
                'uniform vec4 u_Sampler_uv;\n' +
                'varying vec2 v_TexCoord;\n';
            return str;
        };
        PlunginParticleBase.prototype.genVertexCode2 = function () {
            //u_nowTime 整体时间相关 x:0,y:lifeTime,z:特效显示时间，w:1.0
            //a_Time 粒子时间相关, x:隐藏时间，y:显示时间，z:总周期
            //time 计算后时间相关, x:当前生命周期经过时间，y:当前显示之后经过时间, z:当前显示时间百分比,w:当前粒子是否显示
            var str = 'void main() {\n' +
                'vec2 n_TexCoord = calUvOffset(a_TexCoord, u_Sampler_uv);\n' +
                'vec4 n_Position = vec4(a_Position.xyz, 1.0);\n' +
                'float index = a_Position.w;\n' +
                'vec4 time = vec4(0,0,0,1);\n' +
                'time.x = fract(u_nowTime.z / a_Time.z);\n' +
                'time.x = time.x * a_Time.z;\n' +
                'time.y = time.x - a_Time.x;\n' +
                'time.z = time.y / a_Time.y;\n' +
                'if(time.x > a_Time.x && time.x < a_Time.z){\n' +
                'time.w = 1.0;\n' +
                '}else{\n' +
                'time.w = 0.0;\n' +
                '}\n';
            return str;
        };
        PlunginParticleBase.prototype.genVertexCode3 = function () {
            var str = 'n_Position.xyz = n_Position.xyz + a_Offset.xyz;\n';
            return str;
        };
        PlunginParticleBase.prototype.genVertexCode4 = function () {
            var str = "";
            str += "vec4 endPos = u_MvpMatrix * n_Position;\n";
            str += "gl_Position = endPos;\n";
            return str;
        };
        PlunginParticleBase.prototype.genVertexCode5 = function () {
            var str = '  v_TexCoord = n_TexCoord;\n' +
                'v_Time = time;\n';
            return str;
        };
        PlunginParticleBase.prototype.genVertexCode6 = function () {
            var str = '}\n';
            return str;
        };
        PlunginParticleBase.prototype.genFramentCode2 = function () {
            var str = 'varying vec2 v_TexCoord;\n' +
                'varying vec4 v_Time;\n' +
                'uniform sampler2D u_Sampler;\n';
            return str;
        };
        PlunginParticleBase.prototype.genFramentCode3 = function () {
            var str = 'void main() {\n';
            str += "float show = 1.0;\n";
            str += "vec2 texCoord = v_TexCoord;\n";
            return str;
        };
        PlunginParticleBase.prototype.genFramentCode4 = function () {
            var str = '  vec4 outcolor = texture2D(u_Sampler, texCoord);\n';
            return str;
        };
        return PlunginParticleBase;
    }(aoi.PlunginMainBase));
    aoi.PlunginParticleBase = PlunginParticleBase;
    __reflect(PlunginParticleBase.prototype, "aoi.PlunginParticleBase");
})(aoi || (aoi = {}));
//# sourceMappingURL=PlunginParticleBase.js.map