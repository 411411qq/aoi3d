module aoi {
    import EventBase = base.EventBase;
    export class AoiShader {
        private static cullState:number = -1;

        private m_program:WebGLProgram;
        private m_vertexStr:string;
        private m_fragmentStr:string;
        private m_vertexShader:WebGLShader;
        private m_fragmentShader:WebGLShader;
        private m_attArr:Array<Object>;
        public name:string;

        constructor(name:string) {
            GlobelConst.eventDispatcher.addEventListener(EventBase.CONTEXT_DISPOSE, this, this.onContextDispose);
            this.m_program = null;
            this.m_vertexShader = null;
            this.m_fragmentShader = null;
            this.m_vertexStr = "";
            this.m_fragmentStr = "";
            this.m_attArr = [];
            this.name = name;
        }

        private onContextDispose(event:EventBase):void {
            var gl:WebGLRenderingContext = GlobelConst.gl;
            if (!this.m_program) {
                gl.deleteProgram(this.m_program);
                this.m_program = null;
            }
            if (!this.m_vertexShader) {
                gl.deleteShader(this.m_vertexShader);
                this.m_vertexShader = null;
            }
            if (!this.m_fragmentShader) {
                gl.deleteShader(this.m_fragmentShader);
                this.m_fragmentShader = null;
            }
        }

        public dispose():void {
            this.onContextDispose(null);
            GlobelConst.eventDispatcher.removeEventListener(EventBase.CONTEXT_DISPOSE, this, this.onContextDispose);
        }

        private onPlunginCompare(a, b):number {
            return a.priority > b.priority ? 1 : -1;
        }

        public generateCode(pCollector:PlunginCollecter):void {
            var plunginList:Array<IPlunginVo> = pCollector.plunginList;
            var agalVertexVoList:Array<OpenGlCodeVo> = [], agalFragmentVoList:Array<OpenGlCodeVo> = [], len:number = plunginList.length;
            var i = 0, o, vc, fc;
            pCollector.buildTextureIndex();
            for (i = 0; i < len; i++) {
                vc = plunginList[i].getVertexCode();
                fc = plunginList[i].getFragmentCode();
                if (vc) {
                    agalVertexVoList = agalVertexVoList.concat(vc);
                }
                if (fc) {
                    agalFragmentVoList = agalFragmentVoList.concat(fc);
                }
                let attArr:Array<Object> = plunginList[i].getAttArr();
                if(attArr != null)
                {
                    this.m_attArr = this.m_attArr.concat(attArr);
                }
            }
            this.m_vertexStr = "";
            this.m_fragmentStr = "";
            agalVertexVoList = agalVertexVoList.sort(this.onPlunginCompare);
            agalFragmentVoList = agalFragmentVoList.sort(this.onPlunginCompare);
            for (i = 0; i < agalVertexVoList.length; i++) {
                o = agalVertexVoList[i];
                this.m_vertexStr += o.getCode();
            }
            for (i = 0; i < agalFragmentVoList.length; i++) {
                o = agalFragmentVoList[i];
                this.m_fragmentStr += o.getCode();
            }
        }

        public getProgram(gl:WebGLRenderingContext):WebGLProgram {
            if (!this.m_program) {
                var i:number = 0, len:number = this.m_attArr.length, o;
                this.m_program = this.createProgram(gl, this.m_vertexStr, this.m_fragmentStr);
                for (i = 0; i < len; i++) {
                    o = this.m_attArr[i];
                    if (o.type == 1) {
                        this.m_program[o.name] = gl.getAttribLocation(this.m_program, o.name);
                    }
                    else if (o.type == 2) {
                        this.m_program[o.name] = gl.getUniformLocation(this.m_program, o.name);
                    }
                }
            }
            return this.m_program;
        }

        private createProgram(gl:WebGLRenderingContext, vshader:string, fshader:string):WebGLProgram {
            this.m_vertexShader = CuonUtils.loadShader(gl, gl.VERTEX_SHADER, vshader);
            this.m_fragmentShader = CuonUtils.loadShader(gl, gl.FRAGMENT_SHADER, fshader);
            if (!this.m_vertexShader || !this.m_fragmentShader) {
                return null;
            }
            var program = gl.createProgram();
            if (!program) {
                return null;
            }
            gl.attachShader(program, this.m_vertexShader);
            gl.attachShader(program, this.m_fragmentShader);
            gl.linkProgram(program);
            var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (!linked) {
                var error = gl.getProgramInfoLog(program);
                console.log('Failed to link program: ' + error);
                gl.deleteProgram(program);
                gl.deleteShader(this.m_fragmentShader);
                gl.deleteShader(this.m_vertexShader);
                return null;
            }
            return program;
        }
        public render(gl:WebGLRenderingContext, target:IRenderable, camera:ICamera, renderType:number):void {
            var sub:ISubGeometry, i:number, j:number, subGeometries:Array<ISubGeometry> = target.geometry.subGeometries, len:number = target.geometry.numSubGeometry;
            let collects:Array<PlunginCollecter> = target.getPluginCollectorList(renderType);
            if(collects == null)
            {
                return;
            }
            for(j=0;j<collects.length; j++)
            {
                let collect:PlunginCollecter = collects[j];
                var cullState = collect.getCullState(gl);
                if(AoiShader.cullState != cullState)
                {
                    gl.cullFace(cullState);
                    AoiShader.cullState = cullState;
                }
                var program = this.getProgram(gl);
                for (i = 0; i < len; i++) {
                    gl.useProgram(program);
                    sub = subGeometries[i];
                    var indexBuffer:WebGLBuffer = sub.getIndexBuffer(gl);
                    collect.activeSub(gl, sub, target, camera, program, renderType);
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
                    gl.drawElements(gl.TRIANGLES, sub.numIndex, gl.UNSIGNED_SHORT, 0);
                    collect.disactiveSub(gl, program);
                }
            }
        }
    }
}