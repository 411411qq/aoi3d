module aoi {
    export class PlunginCollecter {
        private m_mode:number;
        private m_hAlpha:boolean;
        private m_wDepth:boolean;
        private m_depthMask:boolean;
        private m_blendDirty:boolean;
        private m_blendEnable:boolean;
        private m_plunginList:Array<IPlunginVo>;
        /** 插件字典 */
        private m_dic:Object;
        private m_blendSource:number;
        private m_blendDestination:number;
        private m_plunginNameDirty:boolean;
        private m_keyCamDic:Object;
        private m_textureIndex:number;
        /** shader字典 */
        private m_shaderDic:Object;

        constructor() {
            this.m_mode = PlunginDefine.NORMAL;
            this.m_hAlpha = false;
            this.m_wDepth = true;
            this.m_depthMask = true;
            this.m_blendSource = null;
            this.m_blendDestination = null;
            this.m_blendEnable = true;
            this.m_blendDirty = true;
            this.m_plunginList = [];
            this.m_plunginNameDirty = true;
            this.m_keyCamDic = {};
            this.m_shaderDic = {};
            this.m_textureIndex = 0;
            this.m_dic = {};
        }

        public get plunginList():Array<IPlunginVo> {
            return this.m_plunginList;
        }

        public get mode():number {
            return this.m_mode;
        }

        public get hAlpha():boolean {
            return this.m_hAlpha;
        }

        private updateBlendFun():void {
            this.m_blendDirty = false;
            var gl = GlobelConst.gl;
            switch (this.m_mode) {
                case PlunginDefine.NORMAL:
                    if (this.m_hAlpha == false) {
                        this.m_blendSource = gl.ONE;
                        this.m_blendDestination = gl.ZERO;
                        this.m_blendEnable = true;
                    }
                    else {
                        this.m_blendSource = gl.SRC_ALPHA;
                        this.m_blendDestination = gl.ONE_MINUS_SRC_ALPHA;
                        this.m_blendEnable = true;
                    }
                    break;
                case PlunginDefine.LAYER:
                    this.m_blendSource = gl.SRC_ALPHA;
                    this.m_blendDestination = gl.ONE_MINUS_SRC_ALPHA;
                    this.m_blendEnable = true;
                    break;
                case PlunginDefine.MULTIPLY:
                    this.m_blendSource = gl.ZERO;
                    this.m_blendDestination = gl.SRC_COLOR;
                    this.m_blendEnable = true;
                    break;
                case PlunginDefine.ADD:
                    this.m_blendSource = gl.SRC_ALPHA;
                    this.m_blendDestination = gl.ONE;
                    this.m_blendEnable = true;
                    break;
                case PlunginDefine.ALPHA:
                    this.m_blendSource = gl.ZERO;
                    this.m_blendDestination = gl.SRC_ALPHA;
                    this.m_blendEnable = true;
                    break;
                case PlunginDefine.SCREEN:
                    this.m_blendSource = gl.ONE;
                    this.m_blendDestination = gl.ONE_MINUS_SRC_COLOR;
                    this.m_blendEnable = true;
                    break;
                case PlunginDefine.NEW_BLEND_13:
                    this.m_blendSource = gl.SRC_COLOR;
                    this.m_blendDestination = gl.SRC_ALPHA;
                    this.m_blendEnable = true;
                    break;
                case PlunginDefine.NEW_BLEND_14:
                    this.m_blendSource = gl.SRC_COLOR;
                    this.m_blendDestination = gl.ONE_MINUS_SRC_COLOR;
                    this.m_blendEnable = true;
                    break;
                case PlunginDefine.NEW_BLEND_15:
                    this.m_blendSource = gl.SRC_COLOR;
                    this.m_blendDestination = gl.ONE;
                    this.m_blendEnable = true;
                    break;
            }
        }

        public setParamMode(mode:number, hAlpha:boolean, wDepth:boolean, depthMask:boolean = true):void {
            this.m_mode = mode;
            this.m_hAlpha = hAlpha;
            this.m_wDepth = wDepth;
            this.m_depthMask = depthMask;
            this.m_blendDirty = true;
        }

        public get blendEnable():boolean {
            if (this.m_blendDirty == true) {
                this.updateBlendFun();
            }
            return this.m_blendEnable;
        }

        public get blendSource():number {
            if (this.m_blendDirty == true) {
                this.updateBlendFun();
            }
            return this.m_blendSource;
        }

        public get blendTarget():number {
            if (this.m_blendDirty == true) {
                this.updateBlendFun();
            }
            return this.m_blendDestination;
        }

        public addPlugin(vo:IPlunginVo):void {
            var temp = [], i = 0, len = this.plunginList.length, index;
            for (i = 0; i < len; i++) {
                if (this.plunginList[i].type == vo.type) {
                    temp.push(this.plunginList[i]);
                }
            }
            if (temp.length >= vo.limitNum) {
                vo.index = temp[temp.length - 1].index + 1;
                index = this.plunginList.indexOf(temp[0]);
                this.plunginList[index].dispose();
                this.plunginList.splice(index, 1);
            }
            else {
                vo.index = temp.length;
            }
            this.m_dic[vo.type] = 1;

            var preArr:Array<IPlunginVo> = vo.getPrePlungin();
            if(preArr != null)
            {
                len = preArr.length;
                for(i = 0; i < len; i++)
                {
                    this.addPlugin(preArr[i]);
                }
            }

            this.invalidCollect();
            vo.pColloct = this;
            this.plunginList.push(vo);
        }
        public getPlugin(type:number):IPlunginVo
        {
            if(this.hasPlugin(type))
            {
                var i = 0, len = this.plunginList.length;
                for (var i = 0; i < len; i++) {
                    if (this.plunginList[i].type == type) {
                        return this.plunginList[i];
                    }
                }
            }
            return null;
        }

        public removePlugin(type:number):void {
            var i = 0, len = this.plunginList.length;
            for (var i = 0; i < len; i++) {
                if (this.plunginList[i].type == type) {
                    this.invalidCollect();
                    this.plunginList.splice(i, 1);
                    i--;
                    len --;
                }
            }
            this.m_dic[type] = 0;
        }
        public hasPlugin(type:number):boolean
        {
            return this.m_dic[type] == 1;
        }

        public buildTextureIndex():void {
            var i = 0, len = this.plunginList.length;
            this.m_textureIndex = 0;
            this.m_plunginList = this.plunginList.sort(this.onCompare);
            for (var i = 0; i < len; i++) {
                this.plunginList[i].genTextureIndex();
            }
        }

        private onCompare(a, b):number {
            return b.priority - a.priority;
        }

        public resetCount():void {
            this.m_textureIndex = 0;
        }

        public getTextureObj():number {
            var num = this.m_textureIndex;
            this.m_textureIndex++;
            return num;
        }

        public invalidCollect():void {
            this.m_keyCamDic = {};
            this.m_plunginNameDirty = true;
        }

        public getShader(renderType:number):AoiShader {
            if (this.m_keyCamDic[renderType] == null || this.m_shaderDic[renderType] == null) {
                this.buildTextureIndex();
                this.m_shaderDic[renderType] = ShaderManager.instance.getShader(this, renderType);
            }
            return this.m_shaderDic[renderType];
        }

        public getShaderKey(renderType:number):string {
            if (this.m_plunginNameDirty || this.m_keyCamDic[renderType] == null) 
            {
                var i = 0;
                this.m_plunginNameDirty = false;
                this.m_plunginList = this.plunginList.sort(this.onCompare);
                let m_shaderKey:string = "";
                for (i = 0; i < this.plunginList.length; i++) {
                    if(i == 0)
                    {
                        m_shaderKey += this.plunginList[i].type;
                    }
                    else
                    {
                        m_shaderKey += "" + this.plunginList[i].type;
                    }
                }
                m_shaderKey += "_" + renderType;
                this.m_keyCamDic[renderType] = m_shaderKey;
            }
            return this.m_keyCamDic[renderType];
        }

        public activeSub(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            var i = 0, pvo:IPlunginVo, len = this.plunginList.length;
            for (i = 0; i < len; i++) {
                pvo = this.plunginList[i];
                pvo.active(gl, subGeo, target, camera, program, renderType);
                pvo.endPlungin();
            }
        }

        public disactiveSub(gl:WebGLRenderingContext, program:WebGLProgram):void {
            var i = 0, pvo:IPlunginVo, len = this.plunginList.length;
            for (i = 0; i < len; i++) {
                pvo = this.plunginList[i];
                pvo.disactive(gl, program);
            }
        }

        public active(gl:WebGLRenderingContext):void {
            if (this.blendEnable == true) {
                gl.enable(gl.BLEND);
                gl.blendFunc(this.blendSource, this.blendTarget);
            }
            else
            {
                gl.disable(gl.BLEND);
            }
            if(this.m_wDepth == true)
            {
            	gl.enable(gl.DEPTH_TEST);
            }
            else
            {
            	gl.disable(gl.DEPTH_TEST);
            }
            gl.depthMask(this.m_depthMask);
        }
    }
}