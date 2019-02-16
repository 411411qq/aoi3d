module aoi {
    import Matrix4 = math.Matrix4;
    import Vector3D = math.Vector3D;
    export class Object3DContainer extends Object3D {
        protected m_isRoot:boolean;
        protected m_children:Array<Object3DContainer> = [];
        protected m_inverseSceneTransform:Matrix4 = new Matrix4();
        protected m_inverseSceneTransformDirty:boolean = true;

        protected m_parentVisible:boolean = true;
        protected m_parentMouseEnable:boolean = true;

        protected m_parent:Object3DContainer;
        protected m_sceneTransform:Matrix4 = new Matrix4();
        protected m_sceneTransformDirty:boolean = true;

        protected m_scenePositionDirty:boolean = true;
        protected m_scenePosition:Vector3D = new Vector3D();

        protected m_isRenderAble:boolean = false;

        public setParent(value:Object3DContainer):void {
            this.m_parent = value;
            this.notifySceneTransformChange();
            this.notifySceneChange();
        }

        private notifySceneTransformChange():void {
            if (this.m_sceneTransformDirty)
                return;

            this.invalidateSceneTransform();

            var i:number = 0;
            var len:number = this.m_children.length;

            while (i < len)
                this.m_children[i++].notifySceneTransformChange();
        }

        private notifySceneChange():void {
            this.notifySceneTransformChange();

            var i:number = 0;
            var len:number = this.m_children.length;
            while (i < len)
                this.m_children[i++].notifySceneChange();
        }

        public invalidateTransform():void {
            super.invalidateTransform();
            this.notifySceneTransformChange();
        }

        protected invalidateSceneTransform():void {
            this.m_sceneTransformDirty = true;
            this.m_inverseSceneTransformDirty = true;
            this.m_scenePositionDirty = true;
        }

        protected  updateSceneTransform():void {
            if (this.m_parent && !this.m_parent.m_isRoot) {
                this.m_sceneTransform.copyFrom(this.m_parent.sceneTransform);
                this.m_sceneTransform.prepend(this.transform);

            }
            else {
                this.m_sceneTransform.copyFrom(this.transform);
            }
            this.m_sceneTransformDirty = false;
        }

        public get sceneTransform():Matrix4 {
            if (this.m_sceneTransformDirty) {
                this.updateSceneTransform();
            }
            return this.m_sceneTransform;
        }

        public get inverseSceneTransform():Matrix4 {
            if (this.m_inverseSceneTransformDirty) {
                this.m_inverseSceneTransform.copyFrom(this.sceneTransform);
                this.m_inverseSceneTransform.invert();
                this.m_inverseSceneTransformDirty = false;
            }
            return this.m_inverseSceneTransform;
        }

        public get parent():Object3DContainer {
            return this.m_parent;
        }

        constructor(val:boolean) {
            super();
            this.m_isRoot = val;
        }


        public contains(child:Object3DContainer):boolean {
            return this.m_children.indexOf(child) >= 0;
        }

        public addChild(child:Object3DContainer):Object3DContainer {
            if (child == null)
                throw new Error("Parameter child cannot be null.");

            if (child.m_parent) {
                child.m_parent.removeChild(child);
            }
            child.setParent(this);
            child.notifySceneTransformChange();
            child.updateMouseChildren();
            child.updateImplicitVisibility();
            this.m_children.push(child);
            return child;
        }

        public updateMouseChildren():void {
            var obj:Object3DContainer, i:number = 0;
            for (i = 0; i < this.m_children.length; i++) {
                obj = this.m_children[i];
                obj.parentMouseEnable = this.m_parentMouseEnable;
            }
        }

        public  updateImplicitVisibility():void {
            var obj:Object3DContainer, i:number = 0;
            for (i = 0; i < this.m_children.length; i++) {
                obj = this.m_children[i];
                obj.parentVisible = this.m_parentVisible;
            }
        }

        public set parentVisible(value:boolean) {
            this.m_parentVisible = value;
        }

        public set visible(value:boolean) {
            this.m_visible = value;
            this.m_parentVisible = value;
            this.updateImplicitVisibility();
        }

        public get visible():boolean {
            return this.m_visible && this.m_parentVisible;
        }

        public set parentMouseEnable(value:boolean) {
            this.m_parentMouseEnable = value;
        }

        public set mouseEnable(value:boolean) {
            this.m_mouseEnable = value;
            this.m_parentMouseEnable = value;
            this.updateMouseChildren();
        }

        public get mouseEnable():boolean {
            return this.m_mouseEnable && this.m_parentMouseEnable;
        }

        public removeChild(child:Object3DContainer):void {
            if (child == null)
                throw new Error("Parameter child cannot be null");
            var childIndex:number = this.m_children.indexOf(child);
            if (childIndex == -1) throw new Error("Parameter is not a child of the caller");
            this.m_children.splice(childIndex, 1);
            child.setParent(null);
        }

        public getChildAt(index:number):Object3DContainer {
            return this.m_children[index];
        }

        public  get numChildren():number {
            return this.m_children.length;
        }

        public lookAt(target:Vector3D, upAxis:Vector3D = null):void {
            super.lookAt(target, upAxis);
            this.notifySceneTransformChange();
        }

        public dispose():void {
            super.dispose();
            this.m_parentVisible = true;
            this.m_parentMouseEnable = true;

            if (this.m_parent) this.m_parent.removeChild(this);
            this.removeAll();

            this.m_inverseSceneTransform.identity();
            this.m_sceneTransform.identity();
            this.m_scenePosition.setTo(0, 0, 0);
        }

        public removeAll():void {
            while (this.m_children.length > 0) {
                var child:Object3DContainer = this.m_children[0];
                child.dispose();
            }
        }

        public get isRoot():boolean {
            return this.m_isRoot;
        }

        public set isRoot(value:boolean) {
            this.m_isRoot = value;
        }

        public createRenderList(context:WebGLRenderingContext, camera:ICamera, renderType:number, renderList:RenderList, checkInFrustum:boolean = true):void {
            if (this.visible == false) {
                return;
            }
            var i:number = 0;
            var child:Object3DContainer;
            for (i = 0; i < this.m_children.length; i++) {
                child = this.m_children[i];
                if (child.m_isRenderAble
                    && (child as Mesh).getPluginCollector(renderType) != null) 
                {
                    renderList.addRender(child, camera, checkInFrustum);
                }
                child.createRenderList(context, camera, renderType, renderList, checkInFrustum);
            }
        }
        public get scenePosition():Vector3D {
            if (this.m_scenePositionDirty) {
                this.m_scenePosition = this.sceneTransform.position;
                this.m_scenePositionDirty = false;
            }
            return this.m_scenePosition;
        }

        public get alpha():number {
            if (this.m_parent != null) {
                return this.m_alpha * this.m_parent.alpha;
            }
            return this.m_alpha;
        }
    }
}