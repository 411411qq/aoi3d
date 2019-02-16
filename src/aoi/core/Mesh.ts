module aoi {
    import Matrix4 = math.Matrix4;
    export class Mesh extends Entity implements IRenderable {
        public geometry:Geometry;
        public material:IMaterial;
        private m_finalMatrix:Matrix4;
        private m_pluginRenders:Object;
        private m_animatorData:AnimatorPlayData;
        private m_cullState:number = -1;

        constructor(geo:Geometry, mat:IMaterial, buildBound:boolean = true) {
            super(buildBound);
            this.geometry = geo;
            this.material = mat;
            this.m_finalMatrix = new Matrix4();
            this.m_isRenderAble = true;
            this.m_pluginRenders = {};
            this.m_animatorData = null;
            this.m_mouseEnable = false;
        }
        public getCullState(context:WebGLRenderingContext):number
        {
            if(this.m_cullState != -1)
            {
                return this.m_cullState;
            }
            return context.BACK;
        }
        public setCullState(val:number):void
        {
            this.m_cullState = val;
        }
        public get canCheckMesh():boolean
        {
            return false;
        }

        public addPlugin(vo:IPlunginVo, renderType:number = 1):void {
            if(this.m_pluginRenders[renderType] == null)
            {
                this.m_pluginRenders[renderType] = new PlunginCollecter();
            }
            this.m_pluginRenders[renderType].addPlugin(vo);
        }

        public removePlugin(type:number, renderType:number = 1):void {
            this.m_pluginRenders[renderType].removePlugin(type);
        }

        public getPluginCollector(renderType:number = 1):PlunginCollecter {
            return this.m_pluginRenders[renderType] as PlunginCollecter;
        }

        public get animatorData():AnimatorPlayData {
            if (this.m_animatorData == null) {
                this.m_animatorData = new AnimatorPlayData();
            }
            return this.m_animatorData;
        }

        public createBound() {
            if (this._buildBound == true && this.geometry != null) {
                this.bound = this.geometry.bound;
            }
        }

        public get hasAlpha() {
            let norRender:PlunginCollecter = this.getPluginCollector();
            if(norRender == null)
            {
                return false;
            }
            if (norRender.mode == PlunginDefine.NORMAL && norRender.hAlpha == false) {
                return false;
            }
            else {
                return true;
            }
        }

        public render(gl:WebGLRenderingContext, cam:ICamera, renderType:number) {
            if (this.canRenderChack() == false) {
                return;
            }
            this.updateMatrix(cam);
            this.updateShader(gl, cam, renderType);
        }

        public updateMatrix(cam:ICamera) {
            this.m_finalMatrix.identity();
            this.m_finalMatrix.append(this.sceneTransform);
            this.m_finalMatrix.append(cam.viewProjection);
        }

        public updateShader(gl:WebGLRenderingContext, cam:ICamera, renderType:number) 
        {
            let norRender:PlunginCollecter = this.getPluginCollector(renderType);
            if(norRender == null)
            {
                return;
            }
            var shader:AoiShader = norRender.getShader();
            norRender.active(gl);
            shader.render(gl, this, cam, renderType);
        }

        public canRenderChack() {
            if (this.geometry == null || this.geometry.numSubGeometry == 0 || this.material == null) {
                return false;
            }
            return true;
        }

        public getFinalMatrix():Matrix4 {
            return this.m_finalMatrix;
        }
    }
}