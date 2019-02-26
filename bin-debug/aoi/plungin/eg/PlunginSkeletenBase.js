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
    /** 骨骼动画基础 */
    var PlunginSkeletenBase = (function (_super) {
        __extends(PlunginSkeletenBase, _super);
        function PlunginSkeletenBase(skeleton, precision) {
            var _this = _super.call(this, precision) || this;
            _this.skeleton = skeleton;
            return _this;
        }
        PlunginSkeletenBase.prototype.getPrePlungin = function () {
            var arr = new Array();
            arr.push(new aoi.PlunginCaculateUV());
            arr.push(new aoi.PlunginDefaultTextureColor());
            return arr;
        };
        PlunginSkeletenBase.prototype.updateCode = function () {
            this._vertexCode.push(new aoi.OpenGlCodeVo(0, this, this.genVertexCode1));
            this._vertexCode.push(new aoi.OpenGlCodeVo(30000, this, this.genVertexCode2));
            this._vertexCode.push(new aoi.OpenGlCodeVo(50000, this, this.genVertexCode3));
            this._vertexCode.push(new aoi.OpenGlCodeVo(70000, this, this.genVertexCode4));
            this._vertexCode.push(new aoi.OpenGlCodeVo(90000, this, this.genVertexCode5));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(0, this, this.genFramentCode1));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(30000, this, this.genFramentCode2));
            this._fragmentCode.push(new aoi.OpenGlCodeVo(50000, this, this.genFramentCode3));
        };
        PlunginSkeletenBase.prototype.getSkeletonPos = function (value, animator) {
            return animator.getSkeletonPos(value);
        };
        PlunginSkeletenBase.prototype.disactive = function (gl, program) {
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.disableVertexAttribArray(program["a_Position"]);
            gl.disableVertexAttribArray(program["a_TexCoord"]);
            gl.disableVertexAttribArray(program["a_JointIndices"]);
            gl.disableVertexAttribArray(program["a_JointWeight"]);
        };
        PlunginSkeletenBase.prototype.active = function (gl, subGeo, target, camera, program, renderType) {
            var buffer = subGeo.getVertexBuffer(gl), FSIZE = subGeo.bytesPerEle, perLen = subGeo.vertexStride;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            var mjc = this.skeleton.maxJointCount;
            this.initAttributeVariable(gl, program["a_Position"], buffer, 3, FSIZE * perLen, 0);
            this.initAttributeVariable(gl, program["a_TexCoord"], buffer, 2, FSIZE * perLen, FSIZE * 3);
            this.initAttributeVariable(gl, program["a_JointIndices"], buffer, mjc, FSIZE * perLen, FSIZE * 11);
            this.initAttributeVariable(gl, program["a_JointWeight"], buffer, mjc, FSIZE * perLen, FSIZE * (11 + mjc));
            gl.activeTexture(gl["TEXTURE" + this.txtIndex]);
            gl.bindTexture(gl.TEXTURE_2D, target.material.getTextures(gl));
            gl.uniform1i(program["u_Sampler"], this.txtIndex);
            gl.uniformMatrix4fv(program["u_MvpMatrix"], false, target.getFinalMatrix().elements);
            gl.uniform1f(program["u_mjc"], mjc);
            gl.uniform4fv(program["u_Sampler_uv"], target.material.getOffsetData().elements);
            var i, rsSkeletonPos, curClip;
            if (target.animatorData.lastAction != -1) {
                var lastClip = target.geometry.animator.getAction(target.animatorData.lastAction);
            }
            if (target.animatorData.doSmooth == true
                && aoi.GlobelConst.nowTime < target.animatorData.startTime
                && lastClip != null) {
                curClip = target.geometry.animator.getAction(target.animatorData.action);
                var blendWeight = (target.animatorData.startTime - aoi.GlobelConst.nowTime) / target.animatorData.smoothTime;
                var skeletonPose = curClip.getFrame(0);
                var fromPose = lastClip.getFrameByPastTime(target.animatorData.lastActionOutTime, target.animatorData.playSpeed, this, target.animatorData.action);
                rsSkeletonPos = aoi.SkeletonPose.insertSkeletonPose(skeletonPose, fromPose, blendWeight);
                rsSkeletonPos.isTemp = true;
            }
            else {
                rsSkeletonPos = this.getSkeletonPos(target.animatorData, target.geometry.animator);
            }
            var len = this.skeleton.numJoints;
            var pos, index;
            if (rsSkeletonPos.isAllReady == false) {
                for (i = 0; i < len; i++) {
                    pos = rsSkeletonPos.jointPoses[i];
                    var joint = this.skeleton.joints[i];
                    if (joint.parentIndex < 0) {
                        pos.caculateJoint(joint, null);
                    }
                    else {
                        pos.caculateJoint(joint, this.skeleton.joints[joint.parentIndex]);
                    }
                }
                gl.uniformMatrix4fv(program["u_boneMatrix"], false, rsSkeletonPos.rsList.data);
                rsSkeletonPos.isAllReady = true;
            }
            else {
                gl.uniformMatrix4fv(program["u_boneMatrix"], false, rsSkeletonPos.rsList.data);
            }
            if (rsSkeletonPos.isTemp == true) {
                rsSkeletonPos.dispose();
                rsSkeletonPos = null;
            }
        };
        PlunginSkeletenBase.prototype.genVertexCode1 = function () {
            var str = 'attribute vec4 a_Position;\n' +
                'attribute vec4 a_JointIndices;\n' +
                'attribute vec4 a_JointWeight;\n' +
                'attribute vec2 a_TexCoord;\n' +
                'uniform vec4 u_Sampler_uv;\n' +
                'uniform float u_mjc;\n' +
                'uniform mat4 u_boneMatrix[60];\n' +
                'uniform mat4 u_MvpMatrix;\n' +
                'varying vec2 v_TexCoord;\n';
            return str;
        };
        PlunginSkeletenBase.prototype.genVertexCode2 = function () {
            var str = 'void main() {\n' +
                'vec2 n_TexCoord = calUvOffset(a_TexCoord, u_Sampler_uv);\n' +
                'vec4 n_Position = a_Position;\n';
            return str;
        };
        PlunginSkeletenBase.prototype.genVertexCode3 = function () {
            var str = 'vec4 rs = vec4(0,0,0,1);\n' +
                'vec4 pos;\n' +
                'pos = u_boneMatrix[int(a_JointIndices.x/2.0)] * a_Position;\n' +
                'rs = vec4(pos.xyz * a_JointWeight.x, 1.0);\n' +
                'if(u_mjc >= 1.0){\n' +
                'pos = u_boneMatrix[int(a_JointIndices.y/2.0)] * a_Position;\n' +
                'rs = vec4(rs.xyz + pos.xyz * a_JointWeight.y, 1.0);\n' +
                '}\n' +
                'if(u_mjc >= 2.0){\n' +
                'pos = u_boneMatrix[int(a_JointIndices.z/2.0)] * a_Position;\n' +
                'rs = vec4(rs.xyz + pos.xyz * a_JointWeight.z,1.0);\n' +
                '}\n' +
                'if(u_mjc >= 3.0){\n' +
                'pos = u_boneMatrix[int(a_JointIndices.w/2.0)] * a_Position;\n' +
                'rs = vec4(rs.xyz + pos.xyz * a_JointWeight.w, 1.0);\n' +
                '}\n';
            str += "n_Position = rs;\n";
            str += "vec4 endPos = u_MvpMatrix * n_Position;\n";
            str += "gl_Position = endPos;\n";
            return str;
        };
        PlunginSkeletenBase.prototype.genVertexCode4 = function () {
            var str = '  v_TexCoord = n_TexCoord;\n';
            return str;
        };
        PlunginSkeletenBase.prototype.genVertexCode5 = function () {
            var str = '}\n';
            return str;
        };
        PlunginSkeletenBase.prototype.genFramentCode2 = function () {
            var str = 'varying vec2 v_TexCoord;\n' +
                'uniform sampler2D u_Sampler;\n';
            return str;
        };
        PlunginSkeletenBase.prototype.genFramentCode3 = function () {
            var str = 'void main() {\n';
            str += "vec2 texCoord = v_TexCoord;\n";
            return str;
        };
        PlunginSkeletenBase.prototype.getAttArr = function () {
            var arr = [];
            arr.push({ type: 1, name: "a_Position" });
            arr.push({ type: 1, name: "a_TexCoord" });
            arr.push({ type: 1, name: "a_JointIndices" });
            arr.push({ type: 1, name: "a_JointWeight" });
            arr.push({ type: 2, name: "u_MvpMatrix" });
            arr.push({ type: 2, name: "u_boneMatrix" });
            arr.push({ type: 2, name: "u_mjc" });
            arr.push({ type: 2, name: "u_Sampler" });
            arr.push({ type: 2, name: "u_Sampler_uv" });
            return arr;
        };
        PlunginSkeletenBase.prototype.genTextureIndex = function () {
            this.txtIndex = this.pColloct.getTextureObj();
        };
        return PlunginSkeletenBase;
    }(aoi.PlunginMainBase));
    aoi.PlunginSkeletenBase = PlunginSkeletenBase;
    __reflect(PlunginSkeletenBase.prototype, "aoi.PlunginSkeletenBase");
})(aoi || (aoi = {}));
//# sourceMappingURL=PlunginSkeletenBase.js.map