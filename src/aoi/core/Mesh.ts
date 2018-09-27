module aoi {
    import Matrix4 = math.Matrix4;
    export class Mesh extends Entity implements IRenderable {
        public geometry:Geometry;
        public material:IMaterial;
        private m_finalMatrix:Matrix4;
        private m_pluginCollector:PlunginCollecter;
        private m_animatorData:AnimatorPlayData;

        constructor(geo:Geometry, mat:IMaterial, buildBound:boolean = true) {
            super(buildBound);
            this.geometry = geo;
            this.material = mat;
            this.m_finalMatrix = new Matrix4();
            this.m_isRenderAble = true;
            this.m_pluginCollector = new PlunginCollecter();
            this.m_animatorData = null;
            this.m_mouseEnable = false;
        }

        public get canCheckMesh():boolean
        {
            return false;
        }

        public addPlugin(vo:IPlunginVo):void {
            this.m_pluginCollector.addPlugin(vo);
        }

        public removePlugin(type:number):void {
            this.m_pluginCollector.removePlugin(type);
        }

        public get pluginCollector():PlunginCollecter {
            return this.m_pluginCollector;
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
            if (this.m_pluginCollector.mode == PlunginDefine.NORMAL && this.m_pluginCollector.hAlpha == false) {
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

        public updateShader(gl:WebGLRenderingContext, cam:ICamera, renderType:number) {
            var shader:AoiShader = this.m_pluginCollector.getShader(renderType);
            this.m_pluginCollector.active(gl);
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