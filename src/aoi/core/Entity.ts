module aoi {
    import Vector3D = math.Vector3D;
    export class Entity extends Object3DContainer implements IBoundsOwner,IMouseObj {
        static MAX_DEPTH:number = 30000;
        static tempDepthVec:Vector3D = new Vector3D();
        protected m_bound:BoundingVolumeBase;
        protected m_pickingCollisionVO:PickingCollisionVO;
        protected m_pickingCollider:IPickingCollider;
        protected m_renderDepth:number = 0;
        protected m_addRenderDepth:number = 0;
        protected _buildBound:boolean = true;

        protected m_depthOffsetX:number = 0;
        protected m_depthOffsetY:number = 0;
        protected m_depthOffsetZ:number = 0;

        constructor(buildBound:boolean = true) {
            super(false);
            this._buildBound = buildBound;
        }

        public get bound():BoundingVolumeBase {
            if (this._buildBound = true && this.m_bound == null) {
                this.updateBound();
            }
            return this.m_bound;
        }

        public set bound(value:BoundingVolumeBase) {
            this.m_bound = value;
        }

        public updateBound():void {
            if (this._buildBound == true) {
                if (this.m_bound == null) {
                    this.createBound();
                }
            }
        }

        protected createBound():void {

        }

        public get pickingCollisionVO():PickingCollisionVO {
            if (this.m_pickingCollisionVO == null) {
                this.m_pickingCollisionVO = new PickingCollisionVO(this);
            }

            return this.m_pickingCollisionVO;
        }

        public collidesBefore(shortestCollisionDistance:number, findClosest:boolean):boolean {
            return false;
        }

        public set pickingCollider(value:IPickingCollider) {
            this.m_pickingCollider = value;
        }

        /** 鼠标拾取器*/
        public get pickingCollider():IPickingCollider {
            if (this.m_pickingCollider == null) {
                this.m_pickingCollider = PickDefine.AS3_FIRST_ENCOUNTERED;
            }
            return this.m_pickingCollider;
        }

        public caculateRenderDepth(camera:ICamera):void {
            if (this.hasAlpha == false) {
                this.m_renderDepth = Number.MAX_VALUE;
                return;
            }

            if (this.m_depthOffsetX != 0
                || this.m_depthOffsetY != 0
                || this.m_depthOffsetZ != 0) {
                Entity.tempDepthVec.setTo(this.m_depthOffsetX, this.m_depthOffsetY, this.m_depthOffsetZ);
                Entity.tempDepthVec = this.sceneTransform.transformVector(Entity.tempDepthVec);
            }
            else {
                Entity.tempDepthVec.copyFrom(this.sceneTransform.position);
            }

            Entity.tempDepthVec.x = Entity.tempDepthVec.x - camera.x;
            Entity.tempDepthVec.y = Entity.tempDepthVec.y - camera.y;
            Entity.tempDepthVec.z = Entity.tempDepthVec.z - camera.z;
            this.m_renderDepth = this.m_addRenderDepth + (Entity.tempDepthVec.x * camera.lightOfSight.x
                + Entity.tempDepthVec.y * camera.lightOfSight.y
                + Entity.tempDepthVec.z * camera.lightOfSight.z) / camera.lightOfSight.length;
        }

        public setDepthOffsetPos(ox:number, oy:number, oz:number):void {
            this.m_depthOffsetX = ox;
            this.m_depthOffsetY = oy;
            this.m_depthOffsetZ = oz;
        }

        public get hasAlpha():boolean {
            return false;
        }

        public get renderDepth():number {
            return Entity.MAX_DEPTH - this.m_renderDepth;
        }

        /** 鼠标位置*/
        public getMousePosition(x:number, y:number, view:View):Vector3D {
            var rayPosition:Vector3D = view.unproject(x, y, 0);
            var rayDirection:Vector3D = view.unproject(x, y, 1);
            rayDirection.x = rayDirection.x - rayPosition.x;
            rayDirection.y = rayDirection.y - rayPosition.y;
            rayDirection.z = rayDirection.z - rayPosition.z;
            var localRayPosition:Vector3D;
            var localRayDirection:Vector3D;
            localRayPosition = this.inverseSceneTransform.transformVector(rayPosition);
            localRayDirection = this.inverseSceneTransform.deltaTransformVector(rayDirection);
            var bounds:BoundingVolumeBase = this.bound;
            if (this.pickingCollisionVO.localNormal == null) {
                this.pickingCollisionVO.localNormal = new Vector3D();
            }
            var rayEntryDistance:number = bounds.rayIntersection(localRayPosition, localRayDirection, this.pickingCollisionVO.localNormal);

            if (rayEntryDistance >= 0) {
                this.m_pickingCollisionVO.rayEntryDistance = rayEntryDistance;
                this.m_pickingCollisionVO.localRayPosition = localRayPosition;
                this.m_pickingCollisionVO.localRayDirection = localRayDirection;
                this.m_pickingCollisionVO.rayOriginIsInsideBounds = rayEntryDistance == 0;

                if (this.collidesBefore(Number.MAX_VALUE, false)) {
                    this.updateLocalPosition(this.m_pickingCollisionVO);
                    return this.pickingCollisionVO.localPosition;
                }
            }
            return null;
        }

        private updateLocalPosition(pickingCollisionVO:PickingCollisionVO):void {
            if (pickingCollisionVO.localPosition == null) {
                pickingCollisionVO.localPosition = new Vector3D();
            }

            var collisionPos:Vector3D = pickingCollisionVO.localPosition;
            var rayDir:Vector3D = pickingCollisionVO.localRayDirection;
            var rayPos:Vector3D = pickingCollisionVO.localRayPosition;
            var t:number = pickingCollisionVO.rayEntryDistance;
            collisionPos.x = rayPos.x + t * rayDir.x;
            collisionPos.y = rayPos.y + t * rayDir.y;
            collisionPos.z = rayPos.z + t * rayDir.z;
        }

        public set addRenderDepth(value:number) {
            this.m_addRenderDepth = value;
        }

        public dispose():void {
            super.dispose();
            this.m_bound = null;
        }
    }
}